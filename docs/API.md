# API Documentation

## Authentication

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "علی احمدی",
  "phone": "09123456789",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "name": "علی احمدی",
      "phone": "09123456789",
      "role": "user"
    },
    "message": "ثبت‌نام موفق"
  }
}
```

### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "phone": "09123456789",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "name": "علی احمدی",
      "phone": "09123456789",
      "role": "user"
    },
    "message": "ورود موفق"
  }
}
```

### POST /api/auth/logout
Logout user.

**Response:**
```json
{
  "success": true,
  "message": "خروج موفق"
}
```

### GET /api/auth/me
Get current user information.

**Response:**
```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "user": {
      "id": "user-123",
      "name": "علی احمدی",
      "phone": "09123456789",
      "role": "user"
    }
  }
}
```

## Products

### GET /api/products
Get all products with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 1000)
- `all` (optional): Include disabled products (default: false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "product-1",
      "name": "فیلتر روغن",
      "description": "فیلتر روغن موتور",
      "price": 50000,
      "brand": "Mann",
      "category": "موتور",
      "images": ["https://example.com/image.jpg"],
      "enabled": true,
      "inStock": true,
      "stockCount": 50
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

### POST /api/products
Create a new product (Admin only).

**Request Body:**
```json
{
  "name": "فیلتر روغن",
  "description": "فیلتر روغن موتور",
  "price": 50000,
  "brand": "Mann",
  "category": "موتور",
  "images": ["https://example.com/image.jpg"],
  "enabled": true,
  "inStock": true,
  "stockCount": 50
}
```

### GET /api/products/[id]
Get product by ID.

### PUT /api/products/[id]
Update product (Admin only).

### DELETE /api/products/[id]
Delete product (Admin only).

## Cart

### GET /api/cart
Get cart for current session.

**Headers:**
- `x-cart-session-id`: Session ID

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "product-1",
        "name": "فیلتر روغن",
        "price": 50000,
        "quantity": 2,
        "image": "https://example.com/image.jpg"
      }
    ],
    "shippingMethod": "air"
  }
}
```

### POST /api/cart
Update cart.

**Request Body:**
```json
{
  "sessionId": "session-123",
  "items": [
    {
      "id": "product-1",
      "name": "فیلتر روغن",
      "price": 50000,
      "quantity": 2,
      "image": "https://example.com/image.jpg"
    }
  ],
  "shippingMethod": "air"
}
```

## Orders

### POST /api/orders/create
Create a new order.

**Request Body:**
```json
{
  "items": [
    {
      "id": "product-1",
      "name": "فیلتر روغن",
      "price": 50000,
      "quantity": 2,
      "image": "https://example.com/image.jpg"
    }
  ],
  "total": 100000,
  "shippingCost": 50000,
  "shippingMethod": "air",
  "shippingAddress": {
    "firstName": "علی",
    "lastName": "احمدی",
    "phone": "09123456789",
    "address": "تهران، خیابان ولیعصر",
    "city": "تهران"
  }
}
```

### GET /api/orders
Get user orders (requires authentication).

### GET /api/orders/[id]
Get order by ID.

## Health Check

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": {
      "status": "up",
      "responseTime": 10
    },
    "api": {
      "status": "up"
    }
  },
  "version": "0.1.0",
  "uptime": 3600
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error


