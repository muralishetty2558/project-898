const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);
const server = require('../app');


describe('find treasure within 10km', () => {
    describe('/find/treasure', () => {
        it('it should GET all the treasure with in 10 km range of latitude and longitude', (done) => {
            chai.request(server)
                .get('/find/treasure')
                .query({ latitude: 1.3273451, longitude: 103.8756757, distance: 5 })
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    });
});

describe('find treasure within 10km and with prize greater that 10', () => {
    describe('/find/treasure', () => {
        it('it should GET all the treasure with in 10 km range of latitude and longitude with the prize range of 10 to 30', (done) => {
            chai.request(server)
                .get('/find/treasure')
                .query({ latitude: 1.3273451, longitude: 103.8756757, distance: 5, prize: 30 })
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    });
});