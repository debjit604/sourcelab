export function matchFileType(file: File, accept: string): boolean {
  if (!accept || accept === "*") return true;

  const acceptedTypes = accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return acceptedTypes.some((type) => {
    if (type.startsWith(".")) {
      return fileName.endsWith(type);
    }
    if (type.endsWith("/*")) {
      const prefix = type.slice(0, -2);
      return fileType.startsWith(prefix);
    }
    return fileType === type;
  });
}
