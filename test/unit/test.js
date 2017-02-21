const assert     = require('assert');
const mockery    = require('mockery');
const rewire     = require('rewire');

let emailHelper;
let detoxCentral;
const opts = {};

const requestMock = (url, req, callback) => {
  console.log('requesting.. ');
  opts.request = { url, req };
  callback(undefined, { statusCode: 200 }, 'test-response-body');
};

const centralAuthMock = {
  getCentralOptions: new Promise((fulfull) => {
    const options = {
      headers: {
        Authorization: 'Bearer testing-token'
      }
    };
    fulfull(options);
  })
};

describe('mqtt-mailer', () => {
  describe('emails', () => {
    // This is where you set up anything that needs to happen before any tests are run
    before(() => {
      process.env.MOSQUITTO_ADDRESS = 'mqtt://localhost';
      process.env.CONFIG_FILE_PATH = '.';
      process.env.DETOX_CENTRAL_ADDRESS = 'http://localhost:3001';
      process.env.DETOX_API_ADDRESS = 'http://localhost:2999';

      mockery.registerMock('request', requestMock);
      mockery.registerMock('detox-node-service-auth-module', centralAuthMock);
      mockery.enable();

      emailHelper = rewire('../../src/module/email_helpers.js');
      detoxCentral = 'detox-central-address';
      emailHelper.__set__('consts.detoxCentralUrl', detoxCentral);
    });

    after(() => {
      mockery.disable();
    });

    it('should be able to validate an email request', () => {
      const validate = emailHelper.__get__('validate');
      const message = { receiver: 'test@test.com', message: 'testing message', subject: 'testing subject' };
      const valid = validate(JSON.stringify(message));
      assert.equal(true, valid);
    });
  });
});
