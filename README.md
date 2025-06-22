# SleepCode - LeetCode Alarm Clock 🚀

SleepCode is a unique alarm clock application that combines the functionality of a traditional alarm with LeetCode problem-solving motivation. The alarm can only be turned off by successfully solving a LeetCode problem, making it a perfect tool for developers who want to maintain a consistent coding practice.

## 👥 Team Members

- Mohammed Saad
- Vikramjeet Singh
- Prateek Prateek

## 🌟 Features

- **Smart Alarm System**: Set alarms that can only be disabled by solving LeetCode problems
- **Real-time Problem Verification**: Automatically checks if you've solved a new problem
- **Progress Tracking**: Keep track of your solved problems count
- **User Authentication**: Secure login with LeetCode username
- **Persistent Alarm**: Continues ringing until a new problem is actually solved
- **Mobile Responsive**: Beautiful UI that works across all devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: 
  - Shadcn/ui (Based on Radix UI)
  - Tailwind CSS for styling
  - Lucide React for icons
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Additional Features**:
  - Theme support with next-themes
  - Toast notifications with Sonner
  - Charts with Recharts
  - Mobile support with Capacitor

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **API Integration**: [alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api) - A custom LeetCode API
- **Container**: Docker and Docker Compose
- **API Features**:
  - Rate limiting
  - Caching with apicache
  - CORS support
- **Testing**:
  - Jest for unit testing
  - Supertest for API testing
  - MSW for API mocking

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm package manager
- Docker and Docker Compose
- Git

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/svingh/sleepcode.git
cd sleepcode
```

### Backend Setup with Docker

```bash
cd backend
# Build the Docker containers
docker compose build
# Start the services
docker compose up
```

The backend will be available at `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:8080`


Made by Mohammad Saad, Vikramjeet Singh, and Prateek Prateek 
for Spurhacks 2025