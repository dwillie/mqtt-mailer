function envOrBust(varName) {
  const result = process.env[varName];
  if (!result) {
    throw new Error(`Environment Variable ${varName} is not defined!`);
  }

  return result;
}

const mqttHost        = envOrBust('MOSQUITTO_ADDRESS');
const configFilePath  = envOrBust('CONFIG_FILE_PATH');
const detoxCentralUrl = envOrBust('DETOX_CENTRAL_ADDRESS');

module.exports = {
  mqttHost,
  configFilePath,
  detoxCentralUrl
};
