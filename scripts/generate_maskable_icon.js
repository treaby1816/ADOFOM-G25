const sharp = require('sharp');
const path = require('path');

async function generateMaskableIcons() {
  const sourceIcon = path.join(__dirname, '..', 'public', 'icons', 'icon-512.png');
  const outDir = path.join(__dirname, '..', 'public', 'icons');

  // For maskable icons, the "safe zone" is 80% of the canvas (centered).
  // Android will clip up to ~10% from each edge with adaptive icon masks.
  // So we place the logo in the center 80% area on a solid background.

  const sizes = [192, 512];

  for (const size of sizes) {
    const padding = Math.round(size * 0.1); // 10% padding on each side = logo occupies 80%
    const logoSize = size - (padding * 2);

    // Resize the original logo to fit within the safe zone
    const resizedLogo = await sharp(sourceIcon)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toBuffer();

    // Create a white canvas and composite the logo centered
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .composite([{
        input: resizedLogo,
        top: padding,
        left: padding
      }])
      .png()
      .toFile(path.join(outDir, `icon-maskable-${size}.png`));

    console.log(`Generated icon-maskable-${size}.png`);
  }

  console.log('Done!');
}

generateMaskableIcons().catch(console.error);
