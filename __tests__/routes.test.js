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

describe('Error handling', () => {
  it('404 handler', async (done) => {
    const res = await request(app)
      .get('/allwrong')
    expect(res.status).toBe(404);
    expect(res.text).toBe('Not found!');
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
  }, 10000);

  it('post to /populate', async (done) => {
    const res = await request(app)
      .post('/populate')
      .send({
        events: [{time_start: '13:00:00', time_end: '15:00:00', location: 'Rehearsal Room', info: 'Bring score', name: ['Jessica Vosk']}],
        day: 3,
        week: 3,
      })
    expect(res.status).toBe(200);
    done();
  });

  // it('delete to /populate', async (done) => {
  //   const res = await request(app)
  //     .delete('/populate')
  //   expect(res.status).toBe(200);
  //   done();
  // });
});