'use strict';
const axios = require('axios');
const log = require('lambda-log');
const AWS = require('aws-sdk');
const zlib = require('zlib');
AWS.config.update({ region: 'us-west-2' });
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

module.exports.healthcheck = (event, context, callback) => {

  log.config.meta.app = event.service.app;
  log.config.meta.version = event.service.version;
  log.config.meta.url = event.service.url;
  log.config.tags.push('dev');

  log.on('log', function (data) {
    let params = {
      DelaySeconds: 10,
      MessageAttributes: {
        "Type": {
          DataType: "String",
          StringValue: "Healthcheck"
        }
      },
      MessageBody: prepareMessageContent(JSON.stringify(data)),
      QueueUrl: "https://sqs.eu-west-1.amazonaws.com/394296847239/healthcheck-queue"
    };

    sqs.sendMessage(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });

  });

  axios.get(event.service.url)
    .then(response => {
      if (response.data.app != event.service.app) {
        let msg = `the app name did not match the expected app name. expected ${event.service.app}, actual ${response.data.app}`;
        log.info(`Healthcheck NOK [${msg}]`);
        callback(null, { statusCode: 500, error: msg, input: event });
      }
      else if (response.data.version != event.service.version) {
        let msg = `the app version did not match the expected app version. expected ${event.service.version}, actual ${response.data.version}`
        log.info(`Healthcheck NOK [${msg}]`);
        callback(null, { statusCode: 500, error: msg, input: event });
      }
      else {
        log.info("Healthcheck OK");
        callback(null, { statusCode: 200, body: response.data, input: event });
      }
    })
    .catch(error => {
      log.info(error);
      callback(null, { statusCode: 500, error: error });
    });
};

function prepareMessageContent(message){
  var compressed = zlib.gzipSync(message).toString('base64');
  return compressed;
}

module.exports.prepareMessageContent = (message) => {

  return prepareMessageContent(message);
}
