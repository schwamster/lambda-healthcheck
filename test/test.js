var assert = require('assert');
var healthcheck = require('../handler')

const backendVersion = '0.1.0-820';
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

        it('should prepare the message as planned', function () {

            let msg = '{"app":"sws-backend-maintainance-service","timestamp":"2017-02-23T13:49:21.1437670Z","message":"request to \\\"/api/Job/6789\\\" took 1ms","level":"Information","operation":"/api/Job/6789","duration":1,"category":"performance","correlationId":"0HL2RRRM7EAD0","threadId":22,"user":"2"}';
            
            let expected = 'H4sIAAAAAAAAA1WPQUvEMBCF/0qZc2OTdNm4vQkKruileJK9zKbjGrZJapKuiPjfnVY8eBgY3vveMO8LcJqgg/yRxRHtmcIgPLpQeDBYEpnSxVmCGorzlAv6BddSGSG10O2zarvNrtPqSm1aszXyhVEGM56IwUTvM6eqEqsDNDi55iEem6253h2AxXiulM+cGOlCI/P78BqTx+JiYDVOlH737n+YvWH+s1QNFgudYvpkjiPribA+bWNKNK7gfmBX3j/qvu+fzN3NrVxKvSXCYbG0rmHmtks7+P4BEasl5RgBAAA=';
            var result = healthcheck.prepareMessageContent(msg);

            assert.equal(result, expected);
            
        });
    });
});