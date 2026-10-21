const fs = require('node:fs');
const path = require('node:path');

const publicAssets = path.resolve(
  __dirname,
  '..',
  'android',
  'app',
  'src',
  'main',
  'assets',
  'public'
);

fs.rmSync(publicAssets, { recursive: true, force: true });
