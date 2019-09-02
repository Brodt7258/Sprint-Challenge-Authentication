const request = require('supertest');
const authRouter = require('../auth/auth-router');

describe('test registration functions', () => {
  test('201 code', () => {
    return request(authRouter).post('/register').then(response => {
      expect(response.statusCode).toBe(201);
    });
  });

  // test('response contains 3 items', () => {
  //   return request(authRouter).get('/').then(response => {
  //     expect(response.body.length).toBe(3);
  //   });
  // });
});