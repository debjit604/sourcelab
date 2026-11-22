import { describe, it, expect } from "vitest";
import { convertCase } from "./process";

describe("case-converter/process", () => {
  it("converts standard casing correctly", () => {
    const input = "hello world! this is sourcelab.";

    expect(convertCase(input, "upper").output).toBe("HELLO WORLD! THIS IS SOURCELAB.");
    expect(convertCase(input, "lower").output).toBe("hello world! this is sourcelab.");
    expect(convertCase(input, "title").output).toBe("Hello World! This Is Sourcelab.");
    expect(convertCase(input, "sentence").output).toBe("Hello world! This is sourcelab.");
  });

  it("converts to programming identifiers (camel, pascal, snake, kebab, constant)", () => {
    const input = "user profile_avatar-image";

    expect(convertCase(input, "camel").output).toBe("userProfileAvatarImage");
    expect(convertCase(input, "pascal").output).toBe("UserProfileAvatarImage");
    expect(convertCase(input, "snake").output).toBe("user_profile_avatar_image");
    expect(convertCase(input, "kebab").output).toBe("user-profile-avatar-image");
    expect(convertCase(input, "constant").output).toBe("USER_PROFILE_AVATAR_IMAGE");
  });

  it("handles alternating case correctly", () => {
    const input = "sourcelab";
    expect(convertCase(input, "alternating").output).toBe("sOuRcElAb");
  });

  it("handles empty and whitespace input gracefully", () => {
    expect(convertCase("", "upper")).toEqual({
      output: "",
      wordCount: 0,
      charCount: 0,
    });

    const res = convertCase("   ", "camel");
    expect(res.output).toBe("");
    expect(res.wordCount).toBe(0);
  });

  it("handles camelCase inputs when converting to snake or kebab case", () => {
    const input = "myAwesomeVariable";

    expect(convertCase(input, "snake").output).toBe("my_awesome_variable");
    expect(convertCase(input, "kebab").output).toBe("my-awesome-variable");
    expect(convertCase(input, "constant").output).toBe("MY_AWESOME_VARIABLE");
    expect(convertCase(input, "title").output).toBe("Myawesomevariable");
  });
});
