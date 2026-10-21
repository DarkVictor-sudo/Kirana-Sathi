const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'www');
const assets = ['index.html', 'styles.css', 'app.js', 'voice.js', 'sw.js', 'manifest.json', 'icon.svg'];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const asset of assets) {
  const contents = fs.readFileSync(path.join(root, asset));
  fs.writeFileSync(path.join(output, asset), contents);
}

console.log(`Copied ${assets.length} app assets to www/`);