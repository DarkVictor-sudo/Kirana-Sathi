const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const adoptiumDir = 'C:\\Program Files\\Eclipse Adoptium';
const installedJdk21 = fs.existsSync(adoptiumDir)
  ? fs.readdirSync(adoptiumDir)
      .find((name) => /^jdk-21.*-hotspot$/i.test(name))
  : null;
const javaHome = installedJdk21
  ? path.join(adoptiumDir, installedJdk21)
  : process.env.JAVA_HOME;
const sdkPath = process.env.ANDROID_HOME
  || path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');

if (!javaHome || !fs.existsSync(path.join(javaHome, 'bin', 'java.exe'))) {
  console.error('JDK 21 is required. Install Temurin JDK 21 or set JAVA_HOME to JDK 21.');
  process.exit(1);
}

if (!fs.existsSync(path.join(sdkPath, 'platform-tools'))) {
  console.error('Android SDK not found. Install it or set ANDROID_HOME to its folder.');
  process.exit(1);
}

const result = spawnSync(
  path.join(javaHome, 'bin', 'java.exe'),
  [
    '-classpath',
    path.join(root, 'android', 'gradle', 'wrapper', 'gradle-wrapper.jar'),
    'org.gradle.wrapper.GradleWrapperMain',
    'assembleDebug'
  ],
  {
    cwd: path.join(root, 'android'),
    env: {
      ...process.env,
      JAVA_HOME: javaHome,
      ANDROID_HOME: sdkPath,
      ANDROID_SDK_ROOT: sdkPath,
      PATH: `${path.join(javaHome, 'bin')};${path.join(sdkPath, 'platform-tools')};${process.env.PATH || ''}`
    },
    stdio: 'inherit'
  }
);

process.exit(result.status ?? 1);