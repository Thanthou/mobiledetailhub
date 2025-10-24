/**
 * Integration test suite for authentication flow
 * Tests the complete auth cycle: login → refresh → protected endpoint → token rotation
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { createTestApp, createTestUser, cleanupTestUsers, extractCookies } from '../setup/testApp.js';

let app;
let testUser;
let testUserEmails = [];

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {
    // Initialize test app
    app = await createTestApp();
    
    // Create test user
    testUser = await createTestUser({
      name: 'Auth Test User',
      email: `auth-test-${Date.now()}@example.com`
    });
    testUserEmails.push(testUser.email);
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestUsers(testUserEmails);
  });

  describe('Complete Auth Flow', () => {
    let accessToken;
    let refreshToken;
    let cookies;

    it('should allow user to login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.success).toBe(true);

      // Extract tokens
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
      
      // Extract cookies
      cookies = extractCookies(response);
      expect(cookies.refresh_token).toBeDefined();
      expect(cookies.access_token).toBeDefined();
    });

    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/incorrect/i);
    });

    it('should allow access to protected endpoint with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.email).toBe(testUser.email);
      expect(response.body.id).toBe(testUser.id);
    });

    it('should reject access to protected endpoint without token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });

    it('should reject access to protected endpoint with invalid token', async () => {
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);
    });

    it('should refresh access token using refresh token cookie', async () => {
      // Wait a moment to ensure token timestamp differs
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [`refresh_token=${cookies.refresh_token}`])
        .set('X-CSRF-Token', 'test-csrf-token') // Bypass CSRF for test
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.success).toBe(true);
      
      // Store new tokens
      const newAccessToken = response.body.accessToken;
      const newRefreshToken = response.body.refreshToken;
      
      expect(newAccessToken).toBeDefined();
      expect(newAccessToken).not.toBe(accessToken);
      expect(newRefreshToken).not.toBe(refreshToken);

      // Verify new token works
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(200);
      
      expect(meResponse.body.email).toBe(testUser.email);

      // Update for next tests
      accessToken = newAccessToken;
      refreshToken = newRefreshToken;
      cookies = extractCookies(response);
    });

    it('should reject refresh request without refresh token', async () => {
      await request(app)
        .post('/api/auth/refresh')
        .set('X-CSRF-Token', 'test-csrf-token')
        .expect(400);
    });

    it('should logout and revoke tokens', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', [`refresh_token=${cookies.refresh_token}`])
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/logged out/i);

      // Verify token is now invalid (blacklisted)
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401);
    });
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const newUserEmail = `register-test-${Date.now()}@example.com`;
      testUserEmails.push(newUserEmail);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: newUserEmail,
          password: 'NewUserPass123!',
          name: 'New Test User',
          phone: '555-0199'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(newUserEmail);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it('should reject registration with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUser.email, // Already exists
          password: 'AnotherPass123!',
          name: 'Duplicate User'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/already exists/i);
    });
  });

  describe('Session Management', () => {
    let userToken;
    let userCookies;

    beforeEach(async () => {
      // Login to get fresh tokens
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      userToken = response.body.accessToken;
      userCookies = extractCookies(response);
    });

    it('should list user sessions', async () => {
      const response = await request(app)
        .get('/api/auth/sessions')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sessions).toBeDefined();
      expect(Array.isArray(response.body.sessions)).toBe(true);
      expect(response.body.sessions.length).toBeGreaterThan(0);
    });
  });
});

