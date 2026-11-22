import { describe, it, expect } from "vitest";
import { processJwt } from "./process";

// Sample JWT token:
// Header: {"alg":"HS256","typ":"JWT"} -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
// Payload: {"sub":"1234567890","name":"Rahul Sharma","admin":true,"iat":1516239022,"exp":1516242622}
// -> eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJhaHVsIFNoYXJtYSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMn0
// Signature: 4PE_ZGwH2_P_9...
const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJhaHVsIFNoYXJtYSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMn0.4PE_ZGwH2_P_9X54Ypxw7z8f7N5c9jB3_x7L9m6K8PQ";

describe("JWT Decoder Process", () => {
  it("decodes valid JWT header and payload correctly", () => {
    const res = processJwt({ token: SAMPLE_JWT });

    expect(res.algorithm).toBe("HS256");
    expect(res.tokenType).toBe("JWT");
    expect(res.payload.name).toBe("Rahul Sharma");
    expect(res.payload.admin).toBe(true);
    expect(res.signature).toBe("4PE_ZGwH2_P_9X54Ypxw7z8f7N5c9jB3_x7L9m6K8PQ");
  });

  it("automatically strips Bearer prefix and trims whitespace", () => {
    const res = processJwt({ token: `  Bearer ${SAMPLE_JWT}  ` });
    expect(res.algorithm).toBe("HS256");
    expect(res.payload.sub).toBe("1234567890");
  });

  it("identifies expired tokens and parses timestamp claims accurately", () => {
    const res = processJwt({ token: SAMPLE_JWT });
    expect(res.isExpired).toBe(true);
    expect(res.expiresAt).toBeDefined();
    expect(res.expiresAt?.statusText).toContain("Expired");
    expect(res.issuedAt).toBeDefined();
  });

  it("decodes UTF-8 multibyte characters in claims", () => {
    // UTF-8 payload: {"user":"भारत"}
    // Base64URL for {"user":"भारत"} is eyJ1c2VyIjoi4KSt4KS+4KSw4KSkIn0
    const token = `eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoi4KSt4KS+4KSw4KSkIn0.sig`;
    const res = processJwt({ token });
    expect(res.payload.user).toBe("भारत");
  });

  it("throws friendly Hinglish errors for invalid formats", () => {
    expect(() => processJwt({ token: "" })).toThrow("JWT token khali hai");
    expect(() => processJwt({ token: "invalid.token" })).toThrow("Token me 3 parts");
    expect(() => processJwt({ token: "part1.part2.part3.part4" })).toThrow("Token me 3 parts");
    expect(() => processJwt({ token: "!!!.@@@.###" })).toThrow("decode nahi ho paya");
  });
});
