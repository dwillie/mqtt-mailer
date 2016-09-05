const mqtt       = require('mqtt');
const winston    = require('winston');
const detoxMail  = require('./module/email_helpers');
const consts     = require('./support/constants');
const config     = require('./support/app_config').getConfig();

const client = mqtt.connect(consts.mqttHost);

if (consts.mailerAddress) {
  winston.info(`Server email: ${consts.mailerAddress}`);
  client.on('connect', () => {
    client.subscribe(config.topic.sub);
    winston.info(`Mail sender subscribed topic: ${config.topic.sub}`);
  });

  client.on('message', (topic, message) => {
    winston.info(`Message received: ${message.toString()}`);
    detoxMail.send(message.toString())
    .then((result) => {
      winston.info(`Email send attempted result: ${JSON.stringify(result)}`);
    }).catch((error) => {
      winston.error(error);
    });
  });
} else {
  winston.error('No email config found!!!');
}
