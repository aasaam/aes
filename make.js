const fs = require("fs");
const { execSync } = require("child_process");

const PACKAGE_JSON = "./node/package.json";
const COMPOSER_JSON = "./php/composer.json";

const node = require(PACKAGE_JSON);
const php = require(COMPOSER_JSON);

const execute = (command) => {
  return execSync(command, { encoding: "utf8" }).trim();
};

const getCurrentVersion = () => {
  const v = execute('git tag --list | tail -n 1').split('\n');
  if (v) {
    return parseVersion(v);
  }
  return {
    major: 0,
    minor: 0,
    patch: 0,
  };
};

const addTag = (minor, major, patch) => {
  execSync('git tag --list', { encoding: "utf8" }).split('\n');
};

/**
 * @param {String} version
 * @return {{major: Number, minor: Number, patch: Number}}
 */
const parseVersion = (version) => {
  const m = version.match(
    /(?<major>[0-9]+)\.(?<minor>[0-9]+)\.(?<patch>[0-9]+)/
  );
  if (m && m.groups && m.groups.major) {
    return {
      major: parseInt(m.groups.major, 10),
      minor: parseInt(m.groups.minor, 10),
      patch: parseInt(m.groups.patch, 10),
    };
  }
  throw new Error("Invalid semantic version");
};

const action = process.argv[2] ? process.argv[2] : null;
const mode = process.argv[3] ? process.argv[3] : null;

if (action === "version") {
  const currentVersion = getCurrentVersion();
  console.log(currentVersion);
}
