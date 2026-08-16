# SkyBook – Flight Booking Platform

A full-stack flight booking application built with **Next.js** (frontend), **Node.js + Express + Prisma** (backend), **PostgreSQL**, and **Stripe**.

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) for the frontend.

---

## Features

## Features

- Flight search by origin, destination, and departure date
- Mock flight inventory and seed data
- Flight details
- Passenger information collection
- Pending booking state while payment is processed
- Stripe Checkout payment flow
- Stripe webhook-based payment confirmation
- Payment failure handling
- Booking cancellation
- Stripe refund handling
- Automatic seat release after cancellation
- JWT-based authentication
- Admin login
- Admin booking management
- Booking filtering and pagination
- Booking/payment status visibility
- Dockerized PostgreSQL
- Prisma migrations and seed scripts

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js (App Router) + TypeScript   |
| Backend    | Node.js + Express                   |
| Database   | PostgreSQL + Prisma ORM             |
| Payments   | Stripe (Checkout Sessions + Webhooks) |
| Auth       | JWT                                 |
| Infra      | Docker Compose (Postgres)           |

---

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Stripe account (test mode keys)
- ngrok / Cloudflare Tunnel / localtunnel (for local webhooks)
- Git

---

## Project Structure
flight-booking-system/
├── backend/                 # Express + Prisma API
├── frontend/                # Next.js app
├── docker-compose.yml       # Postgres
└── README.md


---

## Getting Started

### 1. Clone the repository

git clone https://github.com/NIMISHA-1999/flight-booking-system.git
cd flight-booking

2. Start Postgres
docker compose up -d

3. Backend Setup
cd backend
cp .env.example .env

npm install

# Create and apply Prisma database migration
npx prisma migrate dev --name init

npx prisma db seed

# Seed mock flight and admin data
npm run seed:all

# Seed mock flight
npm run seed

# Seed admin user
npm run seed:admin

npx prisma studio          # optional visual DB tool
npm run dev                # → http://localhost:4000

4. Frontend Setup
Bashcd ../frontend
cp .env.local.example .env.local

npm install
npm run dev                # → http://localhost:3000

Open http://localhost:3000 with your browser.

5. Stripe Webhooks (Local Development)
In one terminal:
stripe listen --forward-to localhost:4000/api/stripe/webhook

6.Expose your local backend publicly (required to receive Stripe webhooks):
# Using ngrok
brew install ngrok
ngrok config add-authtoken YOUR_NGROK_AUTH_TOKEN
ngrok http 4000

# Admin Access

URL: http://localhost:3000/admin/login

Login admin with using the below credentials

Email: admin@skybook.com

Password: SkyBook@Admin123


# Database
docker compose up -d
cd backend && npx prisma migrate dev
npx prisma db seed
npx prisma studio

# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Stripe local webhook
stripe listen --forward-to localhost:4000/api/stripe/webhook
