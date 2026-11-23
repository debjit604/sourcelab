import { describe, it, expect, vi } from "vitest";
import { handleBrowserRoute, PlaywrightRoute } from "./routeHandler";
import { SafeFetchResponse } from "../guard/fetch";

function createMockRoute(url: string): { route: PlaywrightRoute; aborted: boolean; continued: boolean; fulfilled: unknown } {
  const state = { aborted: false, continued: false, fulfilled: null as unknown };
  const route: PlaywrightRoute = {
    request: () => ({ url: () => url }),
    continue: async () => {
      state.continued = true;
    },
    abort: async () => {
      state.aborted = true;
    },
    fulfill: async (resp) => {
      state.fulfilled = resp;
    },
  };
  return { route, ...state, get aborted() { return state.aborted; }, get continued() { return state.continued; }, get fulfilled() { return state.fulfilled; } };
}

describe("Browser-Level Route & DNS-Rebinding Guard", () => {
  describe("DNS-Rebinding Defense at Browser Layer", () => {
    it("aborts browser request if hostname rebinds to a different IP than pinned", async () => {
      const mock = createMockRoute("http://attacker.example.com/api");
      // Initially pinned to 93.184.216.34, but current check resolves to a different IP (rebinding attempt)
      await handleBrowserRoute(mock.route, {
        pinnedHosts: { "attacker.example.com": "198.51.100.99" }, // mismatch triggers rebinding abort
      });
      expect(mock.aborted).toBe(true);
      expect(mock.continued).toBe(false);
    });

    it("fulfills via safeFetch so Chromium makes zero direct socket connections", async () => {
      const mock = createMockRoute("https://example.com/style.css");
      const mockSafeFetch = vi.fn().mockResolvedValue({
        url: "https://example.com/style.css",
        status: 200,
        statusText: "OK",
        headers: { "content-type": "text/css" },
        contentType: "text/css",
        contentLength: 21,
        body: Buffer.from("body { color: red; }"),
        redirects: [],
        pinnedIp: "93.184.216.34",
      } as unknown as SafeFetchResponse);

      await handleBrowserRoute(mock.route, {
        fulfillThroughSafeFetch: true,
        safeFetchFn: mockSafeFetch,
      });

      expect(mockSafeFetch).toHaveBeenCalled();
      expect(mock.fulfilled).not.toBeNull();
      expect(mock.continued).toBe(false);
    });
  });

  describe("Scheme Allowlist & Default-Deny", () => {
    it("aborts WebSocket schemes (ws: and wss:) by default", async () => {
      const wsMock = createMockRoute("ws://example.com/socket");
      await handleBrowserRoute(wsMock.route);
      expect(wsMock.aborted).toBe(true);
      expect(wsMock.continued).toBe(false);

      const wssMock = createMockRoute("wss://example.com/socket");
      await handleBrowserRoute(wssMock.route);
      expect(wssMock.aborted).toBe(true);
    });

    it("aborts file:, ftp:, gopher:, and blob: schemes by default", async () => {
      for (const schemeUrl of [
        "file:///etc/passwd",
        "ftp://example.com/file",
        "gopher://example.com/",
        "blob:http://example.com/uuid-here",
        "javascript:alert(1)",
      ]) {
        const mock = createMockRoute(schemeUrl);
        await handleBrowserRoute(mock.route);
        expect(mock.aborted).toBe(true);
        expect(mock.continued).toBe(false);
      }
    });

    it("aborts invalid/unparseable URLs by default", async () => {
      const mock = createMockRoute("not_a_valid_url:::://");
      await handleBrowserRoute(mock.route);
      expect(mock.aborted).toBe(true);
    });
  });

  describe("Data URL Safety", () => {
    it("allows inline image and font data URLs (no network socket needed)", async () => {
      const imgMock = createMockRoute("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");
      await handleBrowserRoute(imgMock.route);
      expect(imgMock.continued).toBe(true);
      expect(imgMock.aborted).toBe(false);

      const fontMock = createMockRoute("data:font/woff2;base64,d09GMgABAAAAAA...");
      await handleBrowserRoute(fontMock.route);
      expect(fontMock.continued).toBe(true);
    });

    it("aborts data:text/html or data:javascript to prevent iframe/script bypass", async () => {
      const htmlMock = createMockRoute("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==");
      await handleBrowserRoute(htmlMock.route);
      expect(htmlMock.aborted).toBe(true);
      expect(htmlMock.continued).toBe(false);

      const jsMock = createMockRoute("data:application/javascript;base64,Y29uc29sZS5sb2coMSk=");
      await handleBrowserRoute(jsMock.route);
      expect(jsMock.aborted).toBe(true);
    });
  });
});
