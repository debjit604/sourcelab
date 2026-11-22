export interface DimensionInput {
  originalWidth: number;
  originalHeight: number;
  targetWidth?: number;
  targetHeight?: number;
  lockAspectRatio?: boolean;
  scalePercent?: number;
}

export interface DimensionResult {
  width: number;
  height: number;
  aspectRatio: number;
  scalePercent: number;
  error?: string;
}

export function calculateTargetDimensions(input: DimensionInput): DimensionResult {
  const { originalWidth, originalHeight, targetWidth, targetHeight, lockAspectRatio = true, scalePercent } = input;

  if (originalWidth <= 0 || originalHeight <= 0) {
    return {
      width: 0,
      height: 0,
      aspectRatio: 1,
      scalePercent: 100,
      error: "Original dimensions zero se badi honi chahiye.",
    };
  }

  const aspectRatio = originalWidth / originalHeight;

  // Percentage scaling
  if (scalePercent !== undefined && scalePercent > 0) {
    const scale = scalePercent / 100;
    const w = Math.max(1, Math.min(10000, Math.round(originalWidth * scale)));
    const h = Math.max(1, Math.min(10000, Math.round(originalHeight * scale)));
    return {
      width: w,
      height: h,
      aspectRatio,
      scalePercent,
    };
  }

  // Absolute dimensions
  let w = targetWidth ?? originalWidth;
  let h = targetHeight ?? originalHeight;

  if (lockAspectRatio) {
    if (targetWidth !== undefined && targetHeight === undefined) {
      h = Math.round(targetWidth / aspectRatio);
    } else if (targetHeight !== undefined && targetWidth === undefined) {
      w = Math.round(targetHeight * aspectRatio);
    }
  }

  w = Math.max(1, Math.min(10000, Math.round(w)));
  h = Math.max(1, Math.min(10000, Math.round(h)));

  const computedScale = Math.round((w / originalWidth) * 100);

  return {
    width: w,
    height: h,
    aspectRatio,
    scalePercent: computedScale,
  };
}

export async function resizeImageToBlob(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  mimeType: string = "image/jpeg",
  quality: number = 0.92
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context initialize nahi ho paya.");
  }

  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Image blob generate karne me error aaya."));
        }
      },
      mimeType,
      quality
    );
  });
}

export function createSampleImageBlob(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context initialize nahi ho paya."));
      return;
    }
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, "#0B0F1A");
    grad.addColorStop(0.5, "#171F34");
    grad.addColorStop(1, "#22D3EE");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);
    ctx.fillStyle = "#E6EAF2";
    ctx.font = "bold 56px sans-serif";
    ctx.fillText("SourceLab Image Resizer", 100, 400);

    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Blob failed"));
    }, "image/jpeg");
  });
}
