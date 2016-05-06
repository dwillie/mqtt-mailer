const mqtt      = require('mqtt');
const prompt    = require('prompt');
const winston   = require('winston');
const validator = require('validator');
const spawn     = require('child_process').spawn;
const client    = mqtt.connect('mqtt://localhost');
const config    = require('config.json')('./src/config/config.json');

const mqttConfig = { qos: 1 };

checkEnvVar()
.then(() => {
  winston.info('Environment variables found');
  launchService()
  .then(() => {
    getTargetEmail();
  });
}, (error) => {
  throw (error);
});

function checkEnvVar() {
  return new Promise((fullfil, reject) => {
    winston.info('Checking environment variables');
    if (process.env.MAILER_ADDRESS && process.env.MAILER_PWD) {
      fullfil();
    } else {
      reject(new Error('Required environment is not available'));
    }
  });
}

function launchService() {
  return new Promise((fullfil) => {
    winston.info('Launching mailer service...');
    const service = spawn('npm', ['start']);

    service.stdout.on('data', (data) => {
      winston.info(`MQTT-Mailer log: ${data}`);
      if (data.indexOf(config.topic.sub) > -1) {
        fullfil();
      }
      if (data.indexOf('was sent') > -1) {
        winston.info('Test succeeded');
        process.exit();
      }
    });

    service.stderr.on('data', (data) => {
      winston.info(`MQTT-Mailer log: ${data}`);
    });

    service.on('close', (code) => {
      winston.info(`MQTT-Mailer exited with code ${code}`);
    });
  });
}

function getTargetEmail() {
  winston.info('Please input an email address to receive the test email');
  prompt.start();
  prompt.get(['email'], (err, result) => {
    if (validator.isEmail(result.email)) {
      publishToMailer(result.email);
    } else {
      winston.info('Email was invalid');
      getTargetEmail();
    }
  });
}

function publishToMailer(email) {
  const topic = config.topic.sub.replace('#', 'test');
  winston.info(`Publishing queue message to topic ${topic} with target email ${email}`);
  const message = JSON.stringify({
    receiver: email,
    subject:  'This is a test email',
    message:  '<H1>This is email body</H1>This email is only for testing'
  });
  client.publish(topic, message, mqttConfig);
  setTimeout(() => {
    winston.error(new Error('Test failed. Waiting for message timeout'));
    process.exit();
  }, 10000);
}
