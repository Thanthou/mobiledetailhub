# Input Validation System

## Overview

The backend now includes a comprehensive input validation system that provides consistent validation across all API endpoints. This system helps prevent invalid data from being processed and provides clear error messages to clients.

## Components

### 1. Validation Utilities (`utils/validators.js`)

Contains common validation functions and patterns:

- **PATTERNS**: Regular expressions for common data formats
- **ValidationError**: Custom error class for validation failures
- **validators**: Collection of validation functions
- **sanitizers**: Functions to clean and normalize input data

#### Available Validators

- `required`: Checks if value exists and is not empty
- `email`: Validates email format
- `phone`: Validates phone number format
- `zipCode`: Validates ZIP code format
- `stateCode`: Validates 2-letter state codes
- `slug`: Validates URL-friendly slugs
- `url`: Validates URL format
- `alphanumeric`: Checks for letters, numbers, and spaces
- `alphabetic`: Checks for letters and spaces only
- `numeric`: Checks if value is numeric
- `decimal`: Checks if value is a valid decimal
- `length`: Validates string length (min/max)
- `range`: Validates numeric range (min/max)
- `enum`: Checks if value is in allowed list
- `boolean`: Validates boolean values
- `date`: Validates date format
- `array`: Checks if value is an array
- `object`: Checks if value is an object

#### Available Sanitizers

- `trim`: Removes whitespace from strings
- `toLowerCase`: Converts to lowercase
- `toUpperCase`: Converts to uppercase
- `cleanPhone`: Removes non-numeric characters from phone numbers
- `escapeHtml`: Escapes HTML characters

### 2. Validation Middleware (`middleware/validation.js`)

Provides middleware functions for validating request data:

- `validateBody`: Validates request body
- `validateParams`: Validates URL parameters
- `validateQuery`: Validates query parameters
- `sanitize`: Applies sanitization to input data
- `rateLimit`: Basic rate limiting
- `limitInputSize`: Limits input size

### 3. Validation Schemas (`utils/validationSchemas.js`)

Predefined validation schemas for different endpoints:

- `authSchemas`: User registration and login
- `affiliateSchemas`: Affiliate application and updates
- `adminSchemas`: Admin operations
- `customerSchemas`: Customer operations
- `serviceAreaSchemas`: Service area operations
- `commonSchemas`: Common parameter validation

## Usage Examples

### Basic Route Validation

```javascript
const { validateBody, validateParams } = require('../middleware/validation');
const { authSchemas } = require('../utils/validationSchemas');

// Validate request body
router.post('/register', 
  validateBody(authSchemas.register),
  async (req, res) => {
    // Route handler code
  }
);

// Validate URL parameters
router.get('/user/:id', 
  validateParams({ id: [validators.required, validators.numeric] }),
  async (req, res) => {
    // Route handler code
  }
);
```

### Custom Validation Schema

```javascript
const customSchema = {
  username: [
    validators.required,
    validators.alphanumeric,
    validators.length(3, 20)
  ],
  age: [
    validators.numeric,
    validators.range(18, 100)
  ]
};

router.post('/custom', 
  validateBody(customSchema),
  async (req, res) => {
    // Route handler code
  }
);
```

### Sanitization

```javascript
const { sanitize } = require('../middleware/validation');

const sanitizers = {
  body: {
    email: 'toLowerCase',
    name: 'trim',
    phone: 'cleanPhone'
  }
};

router.post('/user', 
  sanitize(sanitizers),
  async (req, res) => {
    // Input data is now sanitized
  }
);
```

### Rate Limiting

```javascript
const { rateLimit } = require('../middleware/validation');

// Limit to 100 requests per 15 minutes
router.use(rateLimit({ max: 100, windowMs: 15 * 60 * 1000 }));

// Limit to 10 requests per minute for specific endpoint
router.post('/sensitive', 
  rateLimit({ max: 10, windowMs: 60 * 1000 }),
  async (req, res) => {
    // Route handler code
  }
);
```

## Error Handling

Validation errors return a consistent format:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "email must be a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

## Best Practices

1. **Always validate input**: Use validation middleware for all user inputs
2. **Sanitize when appropriate**: Clean input data before processing
3. **Use predefined schemas**: Leverage existing schemas for consistency
4. **Custom validation**: Create custom schemas for specific requirements
5. **Error handling**: Let the error handling middleware handle validation errors
6. **Rate limiting**: Apply rate limiting to prevent abuse
7. **Input size limits**: Set appropriate limits for request sizes

## Security Benefits

- **Input sanitization**: Prevents XSS and injection attacks
- **Data validation**: Ensures data integrity
- **Rate limiting**: Prevents abuse and DoS attacks
- **Size limits**: Prevents large payload attacks
- **Consistent error handling**: Prevents information leakage

## Testing

Test validation by sending invalid data to endpoints:

```bash
# Test email validation
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "password123", "name": "Test"}'

# Test required field validation
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## Migration Notes

- Existing routes have been updated to use the new validation system
- Manual validation code has been replaced with middleware
- Error responses now follow a consistent format
- All inputs are automatically sanitized where appropriate
