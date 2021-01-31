const request = require('supertest');
const app = require('../server/app.js');


describe('Sample Test', () => {
  it('Assert True', () => {
    expect(1 === 1).toBe(true);
  });
});

describe('Static Files', () => {
  it('index.html served', async (done) => {
    const res = await request(app)
      .get('/')
    expect(res.status).toBe(200);
    done();
  });

  it ('static bundle served', async (done) => {
    const res = await request(app)
      .get('/build/bundle.js')
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/javascript');
    done();
  });
});

describe('Event Routes', () => {
  it('get request for all events', async (done) => {
    const res = await request(app)
      .get('/populate')
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    done();
  });

  // it('post to /populate', async (done) => {
  //   const res = request(app)
  //     .post('/populate')
  //     .send()
  //   expect(res.status).toBe(200);
  //   done();
  // });

  // it('delete to /populate', async (done) => {
  //   const res = request(app)
  //     .delete('/populate')
  //   expect(res.status).toBe(200);
  //   done();
  // });
});