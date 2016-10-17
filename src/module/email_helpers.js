const request   = require('request');
const uri       = require('urijs');
const validator = require('validator');
const consts    = require('../support/constants');
const winston   = require('winston');
const auth      = require('detox-node-service-auth-module');


function validate(emailRequest) {
  const emailData = JSON.parse(emailRequest);
  if (!('receiver' in emailData)) return false;
  if (!(validator.isEmail(emailData.receiver))) return false;
  if (!('subject' in emailData)) return false;
  if (!('message' in emailData)) return false;
  return true;
}

function send(message) {
  return new Promise((resolve, reject) => {
    winston.info('getting central options..');
    return auth.getCentralOptions
    .then((centralOptions) => {
      winston.info('Received token...');
      const options = centralOptions;
      if (!validate(message)) {
        reject(`Invalid request, body: ${message}`);
      }
      options.json = { message };
      options.method = 'POST';
      winston.info(`Using detox central address: ${getMailRequestUrl()}`);
      request(getMailRequestUrl(), options, (err, response, body) => {
        if (err) {
          reject(err);
        } else if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 202) {
          resolve(body);
        } else if (response.statusCode === 401) {
          reject('You are unauthorised');
        } else {
          reject(`Something else happened: ${response.statusCode}, body: ${JSON.stringify(body)}`);
        }
      });
    });
  });
}

function getMailRequestUrl() {
  const url = uri(consts.detoxCentralUrl).path('email');
  return url.toString();
}

module.exports = { send };
