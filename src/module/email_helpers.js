const request   = require('request');
const uri       = require('urijs');
const winston   = require('winston');
const validator = require('validator');
const consts    = require('../support/constants');


function validate(emailRequest) {
  const emailData = JSON.parse(emailRequest);
  if (!('receiver' in emailData)) return false;
  if (!(validator.isEmail(emailData.receiver))) return false;
  if (!('subject' in emailData)) return false;
  if (!('message' in emailData)) return false;
  return true;
}

function send(message) {
  return new Promise((fulfill, reject) =>  {
    const detoxHostUrl = getMailRequestUrl();
    if (!validate(message)) {
      reject('Invalid request');
    }

    winston.info(`Using detox central address: ${detoxHostUrl}`);
    request.post(detoxHostUrl, { json: { message } }, (err, response, body) => {
      if (err) {
        reject(err);
      } else if (response.statusCode === 200 || response.statusCode === 201) {
        fulfill(JSON.parse(body));
      }
    });
  });
}

function getMailRequestUrl() {
  const url = uri(consts.detoxCentralUrl).path('email');
  return url.toString();
}

module.exports = { send };
