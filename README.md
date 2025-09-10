# Digital Contribution Platform

A modern web platform for managing digital contributions and transactions built with Next.js, NestJS, and Prisma.

## Features

- User Authentication (Register/Login)
- User Profile Management
- Admin Dashboard
- Group Management
- Transaction Processing
- Auto-logout Security Feature

## Tech Stack

### Frontend

- Next.js 15.5
- React 19.1
- TailwindCSS
- TypeScript

### Backend

- NestJS 11
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- pnpm/npm/yarn

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Smlchinaza/digital-contribution-platform.git
cd digital-contribution-platform
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   - Create `.env` file in `apps/backend`
   - Add required environment variables (see `.env.example`)

4. Set up the database:

```bash
cd apps/backend
npx prisma migrate dev
```

5. Start the development servers:

```bash
# From root directory
pnpm dev
```

The frontend will be available at http://localhost:3000 and the backend at http://localhost:3001

## Project Structure

```
digital-contribution-platform/
├── apps/
│   ├── frontend/          # Next.js frontend application
│   └── backend/          # NestJS backend application
├── packages/             # Shared packages (if any)
├── .gitignore
├── package.json
└── turbo.json
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Smlchinaza** - _Initial work_
