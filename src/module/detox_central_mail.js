const request   = require('request');
const uri       = require('urijs');
const winston   = require('winston');
const consts    = require('../support/constants');

function send(message) {
  return new Promise((fulfill, reject) =>  {
    const detoxHostUrl = getMailRequestUrl();
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
