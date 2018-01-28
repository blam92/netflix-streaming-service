process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server/app');

describe('Endpoints', () => {

  describe('GET /chunks', () => {
    it('should return correct JSON', (done) => {
      chai.request(server)
      .get('/chunks/1234')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.id.should.equal(1234);
        res.body.chunk.should.eql({});
        // res.body.message.should.eql('hello, world!');
        done();
      });
    });
  });
  describe('POST /plays', () => {
    it('should return chunk', (done) => {
      chai.request(server)
      .post('/plays')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.start.should.equal(0);
        res.body.end.should.equal(1);
        done();
      });
    });
  });
  describe('GET /unfinished', () => {
    it('should return array of plays', (done) => {
      chai.request(server)
      .get('/unfinished?userId=1')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        Array.isArray(res.body.results).should.be.true;
        if(res.body.results.length) {
          res.body.results[0].uid.should.equal(1);
          let endDate = res.body.results[0].endDate;
          chai.assert(endDate === null);
        }
        done();
      });
    });
  });
});