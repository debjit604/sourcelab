export interface HashMatch {
  name: string;
  category: string;
  hashcat: string;
  john: string;
  confidence: "High" | "Medium" | "Low";
  description: string;
}

export interface HashAnalysisResult {
  raw: string;
  length: number;
  charset: string;
  matches: HashMatch[];
}

export function detectCharset(input: string): string {
  if (/^[0-9a-fA-F]+$/.test(input)) return "Hexadecimal (0-9, a-f)";
  if (/^[a-zA-Z0-9+/=]+$/.test(input)) return "Base64 (a-z, A-Z, 0-9, +, /)";
  if (input.startsWith("$")) return "Crypt / Modular Format ($...)";
  return "Mixed / ASCII";
}

export function identifyHash(rawInput: string): HashAnalysisResult {
  const hash = rawInput.trim();
  if (!hash) {
    return { raw: "", length: 0, charset: "None", matches: [] };
  }

  const length = hash.length;
  const charset = detectCharset(hash);
  const matches: HashMatch[] = [];
  const isHex = /^[0-9a-fA-F]+$/.test(hash);

  // Modular crypt formats
  if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
    matches.push({
      name: "bcrypt",
      category: "Unix Password Hash",
      hashcat: "-m 3200",
      john: "bcrypt",
      confidence: "High",
      description: "Blowfish-based password-hashing function with salt and cost factor.",
    });
  } else if (hash.startsWith("$1$")) {
    matches.push({
      name: "MD5-Crypt",
      category: "Unix Password Hash",
      hashcat: "-m 500",
      john: "md5crypt",
      confidence: "High",
      description: "Standard FreeBSD/Linux MD5 crypt password format.",
    });
  } else if (hash.startsWith("$5$")) {
    matches.push({
      name: "SHA-256-Crypt",
      category: "Unix Password Hash",
      hashcat: "-m 7400",
      john: "sha256crypt",
      confidence: "High",
      description: "Linux standard SHA-256 based shadow password format.",
    });
  } else if (hash.startsWith("$6$")) {
    matches.push({
      name: "SHA-512-Crypt",
      category: "Unix Password Hash",
      hashcat: "-m 1800",
      john: "sha512crypt",
      confidence: "High",
      description: "Modern Linux standard SHA-512 shadow password format.",
    });
  } else if (hash.startsWith("$argon2i$") || hash.startsWith("$argon2id$")) {
    matches.push({
      name: "Argon2",
      category: "Memory-Hard KDF",
      hashcat: "-m 18700",
      john: "argon2",
      confidence: "High",
      description: "Winner of Password Hashing Competition (PHC).",
    });
  }

  // Hexadecimal hashes by length
  if (isHex) {
    if (length === 8) {
      matches.push({
        name: "CRC-32 / CRC-32B",
        category: "Checksum",
        hashcat: "-m 11500",
        john: "crc32",
        confidence: "High",
        description: "32-bit cyclic redundancy check checksum.",
      });
    } else if (length === 32) {
      matches.push({
        name: "MD5",
        category: "Cryptographic Hash",
        hashcat: "-m 0",
        john: "raw-md5",
        confidence: "High",
        description: "128-bit MD5 digest. Most common 32-character hex hash.",
      });
      matches.push({
        name: "NTLM",
        category: "Windows Authentication",
        hashcat: "-m 1000",
        john: "nt",
        confidence: "Medium",
        description: "Windows NT LAN Manager hash (MD4 of UTF-16LE).",
      });
      matches.push({
        name: "MD4",
        category: "Cryptographic Hash",
        hashcat: "-m 900",
        john: "raw-md4",
        confidence: "Low",
        description: "Older 128-bit message digest preceding MD5.",
      });
    } else if (length === 40) {
      matches.push({
        name: "SHA-1",
        category: "Cryptographic Hash",
        hashcat: "-m 100",
        john: "raw-sha1",
        confidence: "High",
        description: "160-bit secure hash algorithm. Common in Git and legacy certificates.",
      });
      matches.push({
        name: "RIPEMD-160",
        category: "Cryptographic Hash",
        hashcat: "-m 6000",
        john: "ripemd-160",
        confidence: "Low",
        description: "160-bit cryptographic hash function developed in Europe.",
      });
    } else if (length === 56) {
      matches.push({
        name: "SHA-224",
        category: "SHA-2 Family",
        hashcat: "-m 1300",
        john: "raw-sha224",
        confidence: "High",
        description: "224-bit truncated version of SHA-256.",
      });
    } else if (length === 64) {
      matches.push({
        name: "SHA-256",
        category: "SHA-2 Family",
        hashcat: "-m 1400",
        john: "raw-sha256",
        confidence: "High",
        description: "256-bit hash. Industry standard for SSL/TLS, Bitcoin, and integrity.",
      });
      matches.push({
        name: "HMAC-SHA256",
        category: "Message Auth Code",
        hashcat: "-m 1450",
        john: "hmac-sha256",
        confidence: "Medium",
        description: "Keyed-hash message authentication code using SHA-256.",
      });
    } else if (length === 96) {
      matches.push({
        name: "SHA-384",
        category: "SHA-2 Family",
        hashcat: "-m 10800",
        john: "raw-sha384",
        confidence: "High",
        description: "384-bit truncated version of SHA-512.",
      });
    } else if (length === 128) {
      matches.push({
        name: "SHA-512",
        category: "SHA-2 Family",
        hashcat: "-m 1700",
        john: "raw-sha512",
        confidence: "High",
        description: "512-bit hash. Used in modern cryptographic signatures and shadow files.",
      });
      matches.push({
        name: "Whirlpool",
        category: "Cryptographic Hash",
        hashcat: "-m 6100",
        john: "whirlpool",
        confidence: "Low",
        description: "512-bit hash designed by Vincent Rijmen and Paulo Barreto.",
      });
    }
  }

  return {
    raw: hash,
    length,
    charset,
    matches,
  };
}
