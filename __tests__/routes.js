const request = require('supertest');
const app = require('../server/app.js');


describe('Sample Test', () => {
  it('Assert True', () => {
    expect(1 === 1).toBe(true);
  });
});

describe('Endpoint Testing', () => {

  it('index.html served', async (done) => {
    const res = await request(app)
      .get('/')
    expect(res.status).toBe(200);
    done();
  });
});