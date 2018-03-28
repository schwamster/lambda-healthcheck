'use strict';
const axios = require('axios');

module.exports.healthcheck = (event, context, callback) => {
  
  axios.get(event.service.url)
    .then(response => {
      if(response.data.app != event.service.app){
        callback(null, {statusCode: 500, error: `the app name did not match the expected app name. expected ${event.service.app}, actual ${response.data.app}`, input: event});  
      }
      else if(response.data.version != event.service.version){
        callback(null, {statusCode: 500, error: `the app version did not match the expected app version. expected ${event.service.version}, actual ${response.data.version}`, input: event});  
      }
      else{
        callback(null, {statusCode: 200, body: response.data, input: event});
      }
    })
    .catch(error => { 
      console.log(error);
      callback(null, {statusCode: 500, error: error});
    });


  //callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
