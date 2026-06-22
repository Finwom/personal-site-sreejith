const fs = require("fs");
const path = require("path");

const imageDirectory = path.resolve(__dirname, "..", "assets", "photo-slide");
const manifestPath = path.join(imageDirectory, "manifest.json");
const scriptManifestPath = path.join(imageDirectory, "manifest.js");
const supportedImage = /\.(?:jpe?g|png|webp)$/i;

const images = fs.readdirSync(imageDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && supportedImage.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

fs.writeFileSync(manifestPath, `${JSON.stringify(images, null, 2)}\n`);
fs.writeFileSync(
    scriptManifestPath,
    `window.PHOTO_GALLERY_IMAGES = ${JSON.stringify(images, null, 2)};\n`
);
console.log(`Wrote ${images.length} images to ${path.relative(process.cwd(), manifestPath)}`);
