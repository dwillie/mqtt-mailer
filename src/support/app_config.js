const fs      = require('fs');
const path    = require('path');
const winston = require('winston');
const consts  = require('../support/constants');

let loadedConfig = undefined;

function getConfig() {
  if (loadedConfig) { return loadedConfig; }

  if (canReadAndWrite(consts.configFilePath)) {
    if (fileExists(consts.configFilePath)) {
      winston.info('Found config file, loading it!');
      const configString = fs.readFileSync(consts.configFilePath).toString();
      loadedConfig = JSON.parse(configString);
    } else {
      winston.info('No config file, using defaults and saving them.');
      loadedConfig = require('../config/default_config.json');
      fs.writeFileSync(consts.configFilePath, JSON.stringify(loadedConfig));
    }
  } else {
    winston.error(`Invalid permissions for config file path! (${consts.configFilePath}) Falling back to default configuration.`);
    loadedConfig = require('../config/default_config.json');
  }

  winston.info(`Using config:\n${JSON.stringify(loadedConfig, null, 2)}\n`);
  return loadedConfig;
}

function canReadAndWrite(targetPath) {
  if (fileExists(targetPath)) {
    try {
      fs.accessSync(targetPath, fs.W_OK | fs.R_OK);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    const directory = path.dirname(targetPath);
    try {
      fs.accessSync(directory, fs.W_OK | fs.R_OK);
      return true;
    } catch (e) {
      return false;
    }
  }
}

function fileExists(targetPath) {
  try {
    fs.statSync(targetPath);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  getConfig
};
