const request = require('supertest');

const users = require('../database/usersQueries');
const server = require('../api/server');

test('joke fetching fails with 403 when not logged in', () => {
  return request(server).get('/api/jokes')
    .then(response => {
      expect(response.statusCode).toBe(403);
    });
});

describe('test jokes router functions', () => {
  let cookie = '';
  beforeAll(async () => {
    return users.delUsers()
      .then(() => {
        return request(server).post('/api/auth/register')
          .send({
            username: 'test4',
            password: 'password'
          });
      })
      .then(() => {
        return request(server).post('/api/auth/login')
          .send({
            username: 'test4',
            password: 'password'
          })
      })
      .then(response => {
        cookie = response.headers['set-cookie'][0];
      });
  });
  afterAll(() => {
    return users.delUsers();
  });

  test('get 20 items from joke api', () => {
    return request(server).get('/api/jokes')
      .set('Cookie', cookie)
      .then(response => {
        expect(response.body.length).toBe(20);
      });
  });

  test('response body in correct format', () => {
    return request(server).get('/api/jokes')
      .set('Cookie', cookie)
      .then(response => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              joke: expect.any(String)
            })
          ])
        );
      });
  });
});