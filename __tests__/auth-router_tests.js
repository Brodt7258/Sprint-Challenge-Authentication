const request = require('supertest');
const bcrypt = require('bcrypt');

const users = require('../database/usersQueries');
const server = require('../api/server');

describe('test registration functions', () => {
  beforeEach(() => {
    return users.delUsers();
  });
  afterAll(() => {
    return users.delUsers();
  });

  test('201 code', () => {
    return request(server).post('/api/auth/register')
      .send({
        username: 'test',
        password: 'password'
      })
      .then(response => {
        expect(response.statusCode).toBe(201);
    });
  });

  test('correct format for registration response', () => {
    return request(server).post('/api/auth/register')
      .send({
        username: 'test2',
        password: 'password'
      })
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            username: expect.any(String),
            password: expect.any(String)
          })
        );
      });
  });
});

describe('test login functions', () => {
  beforeAll(async () => {
    return users.delUsers()
      .then(() => {
        return users.addUser({ username: 'test3', password: bcrypt.hashSync('password', 8) });
      });
  });
  afterAll( () => {
    return users.delUsers();
  });

  test('return 200 status on successful login', () => {
    return request(server).post('/api/auth/login')
      .send({
        username: 'test3',
        password: 'password'
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('return 403 status on unsuccessful login', () => {
    return request(server).post('/api/auth/login')
      .send({
        username: 'test',
        password: 'wrong password'
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
      });
  });
});