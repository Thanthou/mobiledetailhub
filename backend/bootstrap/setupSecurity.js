// backend/bootstrap/setupSecurity.js
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import { env } from '../config/env.js';

export function setupSecurity(app) {
  // Helmet security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          connectSrc: ["'self'", 'https://api.stripe.com'],
          frameSrc: ["'self'", 'https://js.stripe.com'],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'self'"],
          objectSrc: ["'none'"],
          scriptSrcAttr: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    })
  );

  // CORS configuration
  const allowedOrigins = [
    'http://localhost:5175', // main app
    'http://localhost:5176', // admin app
    'http://localhost:5177', // tenant app
    env.FRONTEND_URL,
    env.ADMIN_URL,
  ].filter(Boolean);

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    })
  );

  // Body parsing and cookies
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  console.log('🔒 Security middlewares loaded');
  console.log(`   CORS origins: ${allowedOrigins.length} configured`);
}

