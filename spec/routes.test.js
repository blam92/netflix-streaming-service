process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server/app');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'hello' });

describe('Endpoints', () => {

  describe('GET /chunks', () => {
    it('should return correct chunk', (done) => {
      chai.request(server)
      .get('/chunks/1234?playId=18593221-fd60-4e4f-9406-50fd29f5e275')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.id.should.equal(1234);
        res.body.chunk.should.exist;
        res.body.chunk.nextchunk.should.equal(1235);
        done();
      });
    });
    it('should return error if chunk was not found', (done) => {
      chai.request(server)
      .get('/chunks/1234343232332?playId=18593221-fd60-4e4f-9406-50fd29f5e275')
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(500);
        res.type.should.eql('application/json');
        res.body.err.should.exist;
        done();
      });
    });
    it('should update play to the chunks from seconds', (done) => {
      chai.request(server)
      .get('/chunks/123?playId=18593221-fd60-4e4f-9406-50fd29f5e275')
      .end((err, res) => {
        res.status.should.eql(200);
        const query = `SELECT * FROM plays WHERE id=18593221-fd60-4e4f-9406-50fd29f5e275`;
        client.execute(query, {prepare: true})
        .then((result) => {
          result.rows[0].secondswatched.should.equal(res.body.chunk.start);
          done();
        })
      });
    });
  });
  describe('POST /plays', () => {
    it('should return chunk', (done) => {
      chai.request(server)
      .post('/plays').send({
        userId: 13,
        contentId: 12
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.start.should.equal(0);
        res.body.end.should.equal(1);
        done();
      });
    });
    it('should return err if no body was provided', (done) => {
      chai.request(server)
      .post('/plays')
      .end((err, res) => {
        res.status.should.eql(500);
        res.type.should.eql('application/json');
        res.body.err.should.exist;
        done();
      });
    });
    it('should return err if no content was found', (done) => {
      chai.request(server)
      .post('/plays').send({
        userId: 13,
        contentId: 1200002302302030202020202
      })
      .end((err, res) => {
        res.status.should.eql(500);
        res.type.should.eql('application/json');
        res.body.err.should.exist;
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
        Array.isArray(res.body).should.be.true;
        if(res.body.length) {
          res.body[0].uid.should.equal(1);
          let endDate = res.body[0].enddate;
          should.equal(endDate, null);
        }
        done();
      });
    });
  });
});