const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app'); // Adjust path to your main app file

/**
 * Create a test user for authentication
 * @param {Object} app - Express application
 * @param {Object} userData - User data for registration
 * @returns {Object} - Registered user and authentication token
 */
async function registerTestUser(userData = {}) {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpassword123',
    ...userData
  };

  // Register user
  const registerResponse = await request(app)
    .post('/register')
    .send(defaultUser);

  // Login to get token
  const loginResponse = await request(app)
    .post('/login')
    .send({
      email: defaultUser.email,
      password: defaultUser.password
    });

  return {
    user: registerResponse.body,
    token: loginResponse.body.token
  };
}

/**
 * Clean up database after tests
 */
async function cleanupDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

module.exports = {
  registerTestUser,
  cleanupDatabase
};
