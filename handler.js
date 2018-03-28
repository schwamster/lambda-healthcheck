'use strict';
const axios = require('axios');

module.exports.healthcheck = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'i am alive!',
      input: event,
    }),
  };


  axios.get(event.service.url)
    .then(response => {
      callback(null, {statusCode: 200, body: response.data});
    })
    .catch(error => { 
      console.log(error);
    });


  //callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
