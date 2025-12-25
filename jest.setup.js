// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Simple polyfill for Request/Response (for tests that don't need full undici)
// Only define if not already available
if (typeof global.Request === 'undefined') {
  // Use a minimal mock for Request
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = init.method || 'GET'
      this.headers = new Map()
      if (init.headers) {
        Object.entries(init.headers).forEach(([key, value]) => {
          this.headers.set(key, value)
        })
      }
    }
    async json() {
      return {}
    }
  }
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = new Map()
      if (init.headers) {
        Object.entries(init.headers).forEach(([key, value]) => {
          this.headers.set(key, value)
        })
      }
    }
    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    }
    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
    }
  }
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this.map = new Map()
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.map.set(key.toLowerCase(), value)
        })
      }
    }
    get(name) {
      return this.map.get(name.toLowerCase())
    }
    set(name, value) {
      this.map.set(name.toLowerCase(), value)
    }
    has(name) {
      return this.map.has(name.toLowerCase())
    }
  }
}

