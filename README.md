# massenger-app

A Node.js/Express backend for a messaging application, built with TypeScript and MongoDB.

## Features

- **User Authentication:** Sign up, log in, and log out with JWT-based authentication.
- **User Profiles:** View your own profile and recommended users.
- **Friend Requests:** Send, accept, and reject friend requests.
- **Chat Integration:** Generate chat tokens for real-time messaging (using Stream Chat).
- **Protected Routes:** Most user and chat endpoints require authentication.
- **Validation & Error Handling:** Robust input validation and consistent error responses.

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT, HTTP-only cookies
- **Real-time Chat:** Stream Chat API

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- [Stream Chat](https://getstream.io/chat/) account (for chat features)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/YOUR-USERNAME/massenger-app-api.git
   cd massenger-app-api
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STREAM_KEY=your_stream_key
   STREAM_SECRET_KEY=your_stream_secret
   NODE_ENV=development
   ```

4. **Run the app:**
   - For development:
     ```sh
     npm run dev
     ```
   - For production:
     ```sh
     npm run build
     npm start
     ```

## API Endpoints

### Auth

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Log in
- `POST /api/auth/logout` — Log out

### Users

- `GET /api/users/` — Get recommended users (auth required)
- `GET /api/users/me` — Get your profile (auth required)
- `POST /api/users/friend-request` — Send a friend request (auth required)
- `POST /api/users/accept-friend-request` — Accept a friend request (auth required)
- `POST /api/users/reject-friend-request` — Reject a friend request (auth required)
- `GET /api/users/friends` — List your friends (auth required)
- `GET /api/users/friend-requests` — List your friend requests (auth required)

### Chat

- `GET /api/chat/token` — Get a Stream Chat token (auth required)

### Home

- `GET /api/` — Home route (public)

## Scripts

- `npm run dev` — Start in development mode
- `npm run build` — Compile TypeScript
- `npm start` — Run compiled app
- `npm test` — Run tests (Jest)

## License

ISC