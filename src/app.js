const mqtt       = require('mqtt');
const winston    = require('winston');
const MailSender = require('./module/mail-sender.js');
const config     = require('config.json')('./config/config.json');

const client = mqtt.connect('mqtt://localhost');

if (process.env.MAILER_ADDRESS) {
  winston.info(`Server email: ${process.env.MAILER_ADDRESS}`);
  client.on('connect', () => {
    client.subscribe(config.topic.sub);
    winston.info(`Mail sender subscribed topic: ${config.topic.sub}`);
  });

  client.on('message', (topic, message) => {
    winston.info(`Message received: ${message.toString()}`);
    new MailSender(message.toString())
    .then((emailAddress) => {
      winston.info(`Email was sent to: ${emailAddress}`);
    }, (error) => {
      winston.error(error);
    });
  });
} else {
  winston.error('No email config found!!!');
}
