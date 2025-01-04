import favicons from "favicons";
import fs from "fs/promises";
import path from "path";

const src = "./public/images/logo.png"; // Icon source file path.
const dest = "./app"; // Output directory path.

(async () => {
  // Below is the processing.
  const response = await favicons(src);

  await fs.mkdir(dest, { recursive: true });

  await Promise.all(
    response.images.map(async (image) => {
      if (image.name === "android-chrome-384x384.png") {
        return await fs.writeFile(path.join(dest, "icon.png"), image.contents);
      }

      if (image.name === "apple-touch-icon-180x180.png") {
        return await fs.writeFile(
          path.join(dest, "apple-icon.png"),
          image.contents
        );
      }

      if (image.name === "favicon-48x48.png") {
        return await fs.writeFile(
          path.join(dest, "favicon.ico"),
          image.contents
        );
      }
    })
  );
})();
