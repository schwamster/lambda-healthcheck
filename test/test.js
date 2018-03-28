var assert = require('assert');
var healthcheck = require('../handler')

describe('Array', function () {
    describe('#healthcheck', function () {
        it('should return OK when checking sws-maintenance-backend', function (done) {

            let request = {
                service: { app: 'sws-maintenance-backend', url: 'https://maintenance-backend.sws-fieldtest.prod.aws.scania.com/healthcheck', version: '0.1.0-783' }
            };

            healthcheck.healthcheck(request, null, (x, response) => {
                console.log('called with response => ', response);
                assert.equal(response.statusCode, 200)
                assert.equal(response.body.message, 'i am alive!');
                done();
            });
        });

        it('should return NOK when checking public-workshop-user but got result from different service', function (done) {

            let request = {
                service: { app: 'public-workshop-user', url: 'https://maintenance-backend.sws-fieldtest.prod.aws.scania.com/healthcheck', version: '0.1.0-783' }
            };

            healthcheck.healthcheck(request, null, (x, response) => {
                console.log('called with response => ', response);
                assert.equal(response.statusCode, 500)
                done();
            });
        });
    });
});