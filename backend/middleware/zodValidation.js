/**
 * Zod Validation Middleware
 * Provides middleware functions for validating request data using Zod schemas
 */

const { z } = require('zod');
const { asyncHandler } = require('./errorHandler');

/**
 * Create validation middleware for request body
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateBody = (schema) => {
  return asyncHandler(async (req, res, next) => {
    try {
      // Validate and parse the request body
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.input,
          code: err.code
        }));

        const error = new Error('Validation failed');
        error.statusCode = 400;
        error.code = 'VALIDATION_ERROR';
        error.details = validationErrors;
        throw error;
      }
      throw error;
    }
  });
};

/**
 * Create validation middleware for request parameters
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return asyncHandler(async (req, res, next) => {
    try {
      // Validate and parse the request parameters
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.input,
          code: err.code
        }));

        const error = new Error('Validation failed');
        error.statusCode = 400;
        error.code = 'VALIDATION_ERROR';
        error.details = validationErrors;
        throw error;
      }
      throw error;
    }
  });
};

/**
 * Create validation middleware for request query parameters
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return asyncHandler(async (req, res, next) => {
    try {
      // Validate and parse the request query parameters
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.input,
          code: err.code
        }));

        const error = new Error('Validation failed');
        error.statusCode = 400;
        error.code = 'VALIDATION_ERROR';
        error.details = validationErrors;
        throw error;
      }
      throw error;
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
  return asyncHandler(async (req, res, next) => {
    try {
      const errors = [];

      // Validate body if schema provided
      if (schemas.body) {
        try {
          req.body = schemas.body.parse(req.body);
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors.push(...error.errors.map(err => ({
              part: 'body',
              field: err.path.join('.'),
              message: err.message,
              value: err.input,
              code: err.code
            })));
          }
        }
      }

      // Validate params if schema provided
      if (schemas.params) {
        try {
          req.params = schemas.params.parse(req.params);
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors.push(...error.errors.map(err => ({
              part: 'params',
              field: err.path.join('.'),
              message: err.message,
              value: err.input,
              code: err.code
            })));
          }
        }
      }

      // Validate query if schema provided
      if (schemas.query) {
        try {
          req.query = schemas.query.parse(req.query);
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors.push(...error.errors.map(err => ({
              part: 'query',
              field: err.path.join('.'),
              message: err.message,
              value: err.input,
              code: err.code
            })));
          }
        }
      }

      // If there are validation errors, throw them
      if (errors.length > 0) {
        const error = new Error('Validation failed');
        error.statusCode = 400;
        error.code = 'VALIDATION_ERROR';
        error.details = errors;
        throw error;
      }

      next();
    } catch (error) {
      throw error;
    }
  });
};

/**
 * Sanitize request data using Zod schemas
 * This will transform and clean the data according to the schema
 * @param {z.ZodSchema} schema - Zod schema to sanitize against
 * @returns {Function} Express middleware function
 */
const sanitize = (schema) => {
  return asyncHandler(async (req, res, next) => {
    try {
      // Sanitize the request body using the schema
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.input,
          code: err.code
        }));

        const error = new Error('Data sanitization failed');
        error.statusCode = 400;
        error.code = 'SANITIZATION_ERROR';
        error.details = validationErrors;
        throw error;
      }
      throw error;
    }
  });
};

module.exports = {
  validateBody,
  validateParams,
  validateQuery,
  validate,
  sanitize
};
