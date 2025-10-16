/**
 * Zod Validation Middleware
 * Provides middleware functions for validating request data using Zod schemas
 */

import { z } from 'zod';
import { asyncHandler } from './errorHandler.js';

/**
 * Create validation middleware for request body
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateBody = (schema) => {
  return asyncHandler((req, res, next) => {
    try {
      // Validate and parse the request body
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = err.errors.map(errItem => ({
          field: errItem.path.join('.'),
          message: errItem.message,
          value: errItem.input,
          code: errItem.code
        }));

        const validationError = new Error('Validation failed');
        validationError.statusCode = 400;
        validationError.code = 'VALIDATION_ERROR';
        validationError.details = validationErrors;
        throw validationError;
      }
      throw err;
    }
  });
};

/**
 * Create validation middleware for request parameters
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return asyncHandler((req, res, next) => {
    try {
      // Validate and parse the request parameters
      req.params = schema.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = err.errors.map(errItem => ({
          field: errItem.path.join('.'),
          message: errItem.message,
          value: errItem.input,
          code: errItem.code
        }));

        const validationError = new Error('Validation failed');
        validationError.statusCode = 400;
        validationError.code = 'VALIDATION_ERROR';
        validationError.details = validationErrors;
        throw validationError;
      }
      throw err;
    }
  });
};

/**
 * Create validation middleware for request query parameters
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return asyncHandler((req, res, next) => {
    try {
      // Validate and parse the request query parameters
      req.query = schema.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = err.errors.map(errItem => ({
          field: errItem.path.join('.'),
          message: errItem.message,
          value: errItem.input,
          code: errItem.code
        }));

        const validationError = new Error('Validation failed');
        validationError.statusCode = 400;
        validationError.code = 'VALIDATION_ERROR';
        validationError.details = validationErrors;
        throw validationError;
      }
      throw err;
    }
  });
};

/**
 * Create validation middleware for multiple request parts
 * @param {Object} schemas - Object containing schemas for different parts
 * @param {z.ZodSchema} schemas.body - Schema for request body
 * @param {z.ZodSchema} schemas.params - Schema for request parameters
 * @param {z.ZodSchema} schemas.query - Schema for request query
 * @returns {Function} Express middleware function
 */
const validate = (schemas) => {
  return asyncHandler((req, res, next) => {
    const errors = [];

    // Validate body if schema provided
    if (schemas.body) {
      try {
        req.body = schemas.body.parse(req.body);
      } catch (err) {
        if (err instanceof z.ZodError) {
          errors.push(...err.errors.map(errItem => ({
            part: 'body',
            field: errItem.path.join('.'),
            message: errItem.message,
            value: errItem.input,
            code: errItem.code
          })));
        }
      }
    }

    // Validate params if schema provided
    if (schemas.params) {
      try {
        req.params = schemas.params.parse(req.params);
      } catch (err) {
        if (err instanceof z.ZodError) {
          errors.push(...err.errors.map(errItem => ({
            part: 'params',
            field: errItem.path.join('.'),
            message: errItem.message,
            value: errItem.input,
            code: errItem.code
          })));
        }
      }
    }

    // Validate query if schema provided
    if (schemas.query) {
      try {
        req.query = schemas.query.parse(req.query);
      } catch (err) {
        if (err instanceof z.ZodError) {
          errors.push(...err.errors.map(errItem => ({
            part: 'query',
            field: errItem.path.join('.'),
            message: errItem.message,
            value: errItem.input,
            code: errItem.code
          })));
        }
      }
    }

    // If there are validation errors, throw them
    if (errors.length > 0) {
      const validationError = new Error('Validation failed');
      validationError.statusCode = 400;
      validationError.code = 'VALIDATION_ERROR';
      validationError.details = errors;
      throw validationError;
    }

    next();
  });
};

/**
 * Sanitize request data using Zod schemas
 * This will transform and clean the data according to the schema
 * @param {z.ZodSchema} schema - Zod schema to sanitize against
 * @returns {Function} Express middleware function
 */
const sanitize = (schema) => {
  return asyncHandler((req, res, next) => {
    try {
      // Sanitize the request body using the schema
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = err.errors.map(errItem => ({
          field: errItem.path.join('.'),
          message: errItem.message,
          value: errItem.input,
          code: errItem.code
        }));

        const validationError = new Error('Data sanitization failed');
        validationError.statusCode = 400;
        validationError.code = 'SANITIZATION_ERROR';
        validationError.details = validationErrors;
        throw validationError;
      }
      throw err;
    }
  });
};

export {
  validateBody,
  validateParams,
  validateQuery,
  validate,
  sanitize
};