var assert = require('assert');
var healthcheck = require('../handler')

const backendVersion = '0.1.0-783';
const backendUrl = 'https://maintenance-backend.sws-fieldtest.prod.aws.scania.com/healthcheck';

describe('Array', function () {
    describe('#healthcheck', function () {
        it('should return OK when checking sws-maintenance-backend', function (done) {

            let request = {
                service: { app: 'sws-maintenance-backend', url: backendUrl, version: backendVersion }
            };

            healthcheck.healthcheck(request, null, (x, response) => {
                console.log('called with response => ', response);
                try {
                    assert.equal(response.statusCode, 200)
                    assert.equal(response.body.message, 'i am alive!');
                    done();
                }
                catch (error) {
                    done(error);
                }
            });
        });

        it('should return NOK when checking public-workshop-user but got result from different service', function (done) {

            let request = {
                service: { app: 'public-workshop-user', url: backendUrl, version: backendVersion }
            };

            healthcheck.healthcheck(request, null, (x, response) => {
                console.log('called with response => ', response);
                try {
                    assert.equal(response.statusCode, 500);
                    done();
                }
                catch (error) {
                    done(error);
                }
            });
        });

        it('should return NOK when checking service that returns wrong version', function (done) {

            let request = {
                service: { app: 'sws-maintenance-backend', url: backendUrl, version: '0.1.0-1' }
            };

            healthcheck.healthcheck(request, null, (x, response) => {
                console.log('called with response => ', response);
                try {
                    assert.equal(response.statusCode, 500);
                    done();
                }
                catch (error) {
                    done(error);
                }
            });
        });
    });
});