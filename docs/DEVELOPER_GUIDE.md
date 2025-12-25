# Developer Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+ or XAMPP
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd saded
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up database
```bash
npm run setup-mysql
npm run seed-db
npm run create-indexes
```

5. Run development server
```bash
npm run dev
```

## Project Structure

```
saded/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   └── [pages]/           # Public pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── cart/             # Cart components
│   └── product/          # Product components
├── lib/                  # Utility libraries
│   ├── db/               # Database utilities
│   ├── auth/             # Authentication utilities
│   ├── validations/      # Zod validation schemas
│   └── security/         # Security utilities
├── store/                # Zustand stores
├── types/                # TypeScript types
├── __tests__/            # Test files
└── scripts/              # Utility scripts
```

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint rules
- Use Prettier for formatting
- Write JSDoc comments for public functions

### Testing
- Write unit tests for all utilities
- Write integration tests for API routes
- Aim for 80%+ code coverage
- Run tests before committing: `npm test`

### API Development
- Use Zod schemas for validation
- Implement proper error handling
- Add rate limiting for public endpoints
- Use security headers
- Document all endpoints

### Database
- Use prepared statements (already handled by wrapper)
- Add indexes for frequently queried columns
- Use transactions for multi-step operations
- Never expose sensitive data in logs

### Security
- Always validate and sanitize user input
- Use CSRF protection for state-changing operations
- Implement proper authentication/authorization
- Never log sensitive information
- Use environment variables for secrets

## Common Tasks

### Adding a New API Route

1. Create route file: `app/api/[route]/route.ts`
2. Add Zod validation schema: `lib/validations/[name].ts`
3. Implement error handling
4. Add tests: `__tests__/api/[route]/route.test.ts`
5. Update API documentation

### Adding a New Component

1. Create component file: `components/[category]/[name].tsx`
2. Add TypeScript types
3. Write tests: `__tests__/components/[category]/[name].test.tsx`
4. Add to storybook (if applicable)

### Database Migration

1. Create migration script: `scripts/migrations/[name].js`
2. Test on development database
3. Document changes
4. Run on production with backup

## Troubleshooting

### Database Connection Issues
- Check MySQL is running
- Verify credentials in .env
- Test connection: `npm run test-mysql`

### Build Errors
- Clear .next directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

### Test Failures
- Clear Jest cache: `npm test -- --clearCache`
- Check test environment variables
- Verify mocks are set up correctly

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit a pull request


