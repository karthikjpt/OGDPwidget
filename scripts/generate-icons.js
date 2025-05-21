const fs = require('fs');
const sharp = require('sharp');
const toIco = require('to-ico');

const generateIcons = async () => {
  const iconDir = './build/icons';
  if (!fs.existsSync(iconDir)) fs.mkdirSync(iconDir, { recursive: true });

  // Generate base icon (512x512 PNG)
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 102, b: 204 }
    }
  })
    .composite([{
      input: Buffer.from(
        `<svg viewBox="0 0 512 512">
          <circle cx="256" cy="256" r="230" fill="white"/>
          <text x="50%" y="50%" font-family="Arial" font-size="180" 
                text-anchor="middle" dominant-baseline="middle" fill="#0066cc">OG</text>
        </svg>`
      ),
      blend: 'over'
    }])
    .toFile(`${iconDir}/icon.png`);

  // Generate Windows ICO (multiple sizes)
  const icoSizes = [16, 32, 48, 64, 128, 256];
  const icoBuffers = await Promise.all(
    icoSizes.map(size => sharp(`${iconDir}/icon.png`).resize(size).toBuffer())
  );
  fs.writeFileSync(`${iconDir}/icon.ico`, await toIco(icoBuffers));

  console.log('✅ Generated all icon files');
};

generateIcons().catch(console.error);
