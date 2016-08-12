const http = require('http');

function envOrBust(varName) {
  const result = process.env[varName];
  if (!result) {
    throw new Error(`Environment Variable ${varName} is not defined!`);
  }

  return result;
}

const mqttHost        = envOrBust('MOSQUITTO_ADDRESS');
const mailerAddress   = envOrBust('MAILER_ADDRESS');
const mailerPwd       = envOrBust('MAILER_PWD');
const configFilePath  = envOrBust('CONFIG_FILE_PATH');

module.exports = {
  mqttHost,
  mailerAddress,
  mailerPwd,
  configFilePath
};
