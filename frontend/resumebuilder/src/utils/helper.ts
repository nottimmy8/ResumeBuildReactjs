// import html2canvas from "html2canvas";
// import moment from "moment";

// export const validateEmail = (email: string): boolean => {
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return regex.test(email);
// };

// // Get lightest average color
// export const getLightColorFromImage = (imageUrl: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     // Check if imageUrl is valid
//     if (!imageUrl || typeof imageUrl !== "string") {
//       return reject(new Error("Invalid image URL"));
//     }
//     const img = new Image();
//     // If not base64 string, set crossOrigin (Important for CORS)
//     if (!imageUrl.startsWith("data")) {
//       img.crossOrigin = "anonymous";
//     }
//     img.src = imageUrl;
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);

//       const imageData = ctx.getImageData(
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       ).data;
//       let r = 0,
//         g = 0,
//         b = 0,
//         count = 0;
//       for (let i = 0; i < imageData.length; i += 4) {
//         const red = imageData[i];
//         const green = imageData[i + 1];
//         const blue = imageData[i + 2];
//         const brightness = (red + green + blue) / 3;
//         // Only count light pixels
//         if (brightness > 100) {
//           r += red;
//           g += green;
//           b += blue;
//           count++;
//         }
//       }
//       if (count === 0) {
//         resolve("#ffffff");
//       } else {
//         r = Math.round(r / count);
//         g = Math.round(g / count);
//         b = Math.round(b / count);
//         resolve(`rgb(${r},${g},${b})`);
//       }
//     };
//     img.onerror = (e) => {
//       console.error("Failed to load image:", e);
//       reject(new Error("Image could not be loaded or is blocked by CORS"));
//     };
//   });
// };

// // Eg: Mar 2025
// export function formatYearMonth(yearMonth) {
//   return yearMonth ? moment(yearMonth, "YYYY-MM").format("MMM YYYY") : "";
// }

// export const fixTailwindColors = (element) => {
//   const elements = element.querySelectorAll("*");
//   elements.forEach((el) => {
//     const style = window.getComputedStyle(el);
//     if (value.includes("oklch")) {
//       el.style[prop] = "#000";
//     }
//   });
// };

// // convert component to image
// export async function captureElementAsImage(element) {
//   if (!element) throw new Error("No element provided");

//   const canvas = await html2canvas(element);
//   return canvas.toDataURL("image/png");
// }

// // utility to convert base64 data URL to File object
// export const dataURLtoFile = (dataUrl, fileName) => {
//   const arr = dataUrl.split(",");
//   const mime = arr[0].match(/:(.*?);/)[1];
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], fileName, { type: mime });
// };

import html2canvas from "html2canvas";
import moment from "moment";

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Get lightest average color
export const getLightColorFromImage = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if imageUrl is valid
    if (!imageUrl || typeof imageUrl !== "string") {
      return reject(new Error("Invalid image URL"));
    }
    const img = new Image();
    // If not base64 string, set crossOrigin (Important for CORS)
    if (!imageUrl.startsWith("data")) {
      img.crossOrigin = "anonymous";
    }
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Failed to get canvas context"));
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      let r = 0,
        g = 0,
        b = 0,
        count = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        const red = imageData[i];
        const green = imageData[i + 1];
        const blue = imageData[i + 2];
        const brightness = (red + green + blue) / 3;
        // Only count light pixels
        if (brightness > 100) {
          r += red;
          g += green;
          b += blue;
          count++;
        }
      }
      if (count === 0) {
        resolve("#ffffff");
      } else {
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        resolve(`rgb(${r},${g},${b})`);
      }
    };
    img.onerror = (e) => {
      console.error("Failed to load image:", e);
      reject(new Error("Image could not be loaded or is blocked by CORS"));
    };
  });
};

// Eg: Mar 2025
export function formatYearMonth(yearMonth: string): string {
  return yearMonth ? moment(yearMonth, "YYYY-MM").format("MMM YYYY") : "";
}

export const fixTailwindColors = (element: HTMLElement): void => {
  const elements = element.querySelectorAll("*");
  elements.forEach((el: Element) => {
    const style = window.getComputedStyle(el);
    for (const prop of style) {
      const value = style.getPropertyValue(prop);
      if (value.includes("oklch")) {
        (el as HTMLElement).style.setProperty(prop, "#000");
      }
    }
  });
};

// Convert component to image
export async function captureElementAsImage(
  element: HTMLElement
): Promise<string> {
  if (!element) throw new Error("No element provided");

  const canvas = await html2canvas(element);
  return canvas.toDataURL("image/png");
}

// Utility to convert base64 data URL to File object
export const dataURLtoFile = (dataUrl: string, fileName: string): File => {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error("Invalid data URL");
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};
