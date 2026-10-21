const esbuild = require('esbuild');
const path = require('node:path');

esbuild.buildSync({
  entryPoints: [path.resolve(__dirname, 'voice-entry.js')],
  outfile: path.resolve(__dirname, '..', 'voice.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020']
});

console.log('Built Capacitor speech-recognition bridge.');