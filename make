#!/usr/bin/node
const fs = require("fs");
const { execSync } = require("child_process");

const PACKAGE_JSON = "./node/package.json";
const COMPOSER_JSON = "./php/composer.json";

const node = require(PACKAGE_JSON);
const php = require(COMPOSER_JSON);

const updateVersion = (path, major, minor, patch) => {
  const previews = JSON.parse(fs.readFileSync(path, { encoding: "utf8" }));
  previews.version = `${major}.${minor}.${patch}`;
  fs.writeFileSync(path, JSON.stringify(previews, null, 2) + "\n", {
    encoding: "utf8",
  });
};

const execute = (command) => {
  return execSync(command, { encoding: "utf8" }).trim();
};

const getCurrentVersion = () => {
  const v = execute("git tag --list | tail -n 1").split("\n");
  if (v) {
    return parseVersion(v);
  }
  return {
    major: 0,
    minor: 0,
    patch: 0,
  };
};

const addTag = (major, minor, patch) => {
  updateVersion(PACKAGE_JSON, major, minor, patch);
  updateVersion(COMPOSER_JSON, major, minor, patch);
  execute(`git commit -a -m "New version: v${major}.${minor}.${patch}"`);
  execute(`git tag v${major}.${minor}.${patch}`);
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
  return false;
};

const action = process.argv[2] ? process.argv[2] : null;
const value = process.argv[3] ? process.argv[3] : "";

if (action === "set-tag") {
  const version = parseVersion(value);
  if (version) {
    addTag(version.major, version.minor, version.patch);
  }
}
