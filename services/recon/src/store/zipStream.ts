import JSZip from "jszip";
import { ReconJob } from "./jobStore";

export async function createJobZipArchive(job: ReconJob): Promise<Buffer> {
  const zip = new JSZip();

  // 1. Add manifest.json
  if (job.manifest) {
    zip.file("manifest.json", JSON.stringify(job.manifest, null, 2));
  }

  // 2. Add screenshots if present
  if (job.screenshots.desktop) {
    zip.file("screenshots/desktop.png", job.screenshots.desktop);
  }
  if (job.screenshots.mobile) {
    zip.file("screenshots/mobile.png", job.screenshots.mobile);
  }

  // 3. Add assets grouped into folder structure
  for (const file of Array.from(job.files.values())) {
    const folder = file.folder || "other";
    const filePath = `${folder}/${file.filename}`;
    zip.file(filePath, file.data);
  }

  // 4. Generate zip buffer
  return await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}
