process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

/*
* Test the /PUT route
*/
describe('/PUT dependency', () => {
    it('dependency', (done) => {
        chai.request(server)
            .put('/maven/com/commit451/test/testfile.txt')
            .auth('admin', process.env.PASSWORD)
            .set("Content-Type", "application/octet-stream")
            .send("asdf")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

/*
* Test the /GET route
*/
describe('/GET dependency', () => {
    it('dependency', (done) => {
        chai.request(server)
            .get('/maven/com/commit451/test/testfile.txt')
            .auth('admin', process.env.PASSWORD)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
