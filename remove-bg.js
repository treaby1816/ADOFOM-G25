/* eslint-disable @typescript-eslint/no-require-imports */
const Jimp = require('jimp');

async function removeBackground() {
    try {
        const image = await Jimp.read('public/Ondo-Logo.png');

        // Iterate over pixels to remove white background
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            const alpha = this.bitmap.data[idx + 3];

            // If the pixel is mostly white, make it transparent
            if (red > 240 && green > 240 && blue > 240 && alpha > 0) {
                this.bitmap.data[idx + 3] = 0; // set alpha to 0
            }
        });

        await image.writeAsync('public/ondo-logo-transparent.png');
        console.log('Background removed successfully! Saved to ondo-logo-transparent.png');
    } catch (err) {
        console.error('Error processing image:', err);
    }
}

removeBackground();
