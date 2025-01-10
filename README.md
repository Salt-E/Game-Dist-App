# FamGames - Game Distribution Platform

A Next.js-based game distribution platform that enables family sharing features, built with Supabase for authentication and data storage.
made by Alvin Fadhilah Akmal-18222079, for documentation with images can refer to [documentation](./docs)

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Family Sharing System](#family-sharing-system)
- [Containerization](#containerization)
- [Deployment](#deployment)
- [Service Integration](#service-integration)

## Features

- User authentication with Google OAuth
- Game library management
- Family group creation and management
- Game sharing between family members
- Game store with search and filtering
- Responsive UI with Steam-inspired design

## Tech Stack

- **Frontend**: Next.js 15.0.3
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS
- **UI Components**: Custom components built with Radix UI
- **State Management**: React Hooks
- **API**: Next.js API Routes
- **TypeScript**: For type safety

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Run the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## API Documentation

### Authentication Endpoints

#### GET /api/auth
- **Purpose**: Get current user's session and profile
- **Authentication**: Required
- **Response**: 
  ```typescript
  {
    user: {
      id: string;
      email: string;
      family_group_id?: string;
    }
  }
  ```

#### POST /api/auth
- **Purpose**: Handle authentication actions (logout)
- **Body**: 
  ```typescript
  {
    action: 'logout'
  }
  ```
- **Response**: `{ message: string }` or `{ error: string }`

### Family Management Endpoints

#### POST /api/family
- **Purpose**: Create a new family group
- **Authentication**: Required
- **Body**:
  ```typescript
  {
    name: string;
    userId: string;
  }
  ```
- **Response**: Created family group object

#### POST /api/family/members
- **Purpose**: Invite member to family group
- **Authentication**: Required (Owner only)
- **Body**:
  ```typescript
  {
    email: string;
    familyGroupId: string;
  }
  ```

### Games Endpoints

#### Games API ([id])
All endpoints require authentication and are located under `/api/games/[id]`

##### GET /api/games/[id]
- **Purpose**: Get detailed information about a specific game
- **Parameters**: 
  - `id`: Game ID (in URL path)
- **Response**: 
  ```typescript
  {
    id: string;
    title: string;
    description: string | null;
    price: number;
    genre: string[];
    created_at: string;
    is_owned: boolean;
    owner_id: string | null; // ID of the user or family member who owns the game
  }
  ```
- **Error Responses**:
  - `401`: Not authenticated
  - `404`: Game not found
  - `500`: Server error

##### PATCH /api/games/[id]
- **Purpose**: Update game details
- **Parameters**:
  - `id`: Game ID (in URL path)
- **Body**:
  ```typescript
  {
    title?: string;
    description?: string;
    price?: number;
    genre?: string[];
  }
  ```
- **Response**: Updated game object
- **Error Responses**:
  - `401`: Not authenticated
  - `500`: Failed to update game

##### DELETE /api/games/[id]
- **Purpose**: Delete a specific game
- **Parameters**:
  - `id`: Game ID (in URL path)
- **Response**:
  ```typescript
  {
    message: "Game deleted successfully"
  }
  ```
- **Error Responses**:
  - `401`: Not authenticated
  - `500`: Failed to delete game

#### GET /api/games
- **Purpose**: Get user's games (including family shared)
- **Query Parameters**:
  - `userId`: string
- **Authentication**: Required
- **Response**: Array of game objects with purchase information

## Database Schema

### Tables

#### family_groups
```sql
create table family_groups (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references auth.users(id) not null,
  name text not null,
  created_at timestamptz default now() not null
);
```

#### family_members
```sql
create table family_members (
  user_id uuid references auth.users(id) not null,
  family_group_id uuid references family_groups(id) not null,
  role text check (role in ('owner', 'member')) not null,
  created_at timestamptz default now() not null,
  primary key (user_id, family_group_id)
);
```

#### games
```sql
create table games (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price numeric not null,
  genre text[] not null,
  created_at timestamptz default now() not null
);
```

#### game_purchases
```sql
create table game_purchases (
  id uuid default uuid_generate_v4() primary key,
  game_id uuid references games(id) not null,
  owner_id uuid references auth.users(id) not null,
  purchased_at timestamptz default now() not null
);
```

## Authentication

The application uses Supabase Authentication with the following features:

- Google OAuth integration
- Protected routes using middleware
- Session management
- Automatic token refresh
- Route protection based on authentication state

Implementation details:
1. Middleware checks for authentication on protected routes
2. OAuth callback handling in `/auth/callback/route.ts`
3. Client-side auth state management using `useAuth` hook

## Family Sharing System

### Core Features

1. **Family Group Creation**
   - Users can create one family group
   - Creator becomes the owner automatically

2. **Member Management**
   - Owners can invite members via email
   - Members can be removed by the owner
   - Maximum of 5 members per group (including owner)

3. **Game Sharing**
   - Games purchased by any member are available to all group members
   - Original purchaser maintains ownership
   - Sharing can be enabled/disabled per game

### Implementation Details

1. **Real-time Updates**
   - Family member changes reflect immediately
   - Game library updates in real-time
   - Purchase status synchronization

## Custom React Hooks

### useAuth
Manages authentication state and user session:
```typescript
const { user, loading, error, logout } = useAuth();
```

### useFamilyGroup
Handles family group data and operations:
```typescript
const { familyGroup, members, loading, error, refreshMembers } = useFamilyGroup(userId);
```

### useGames
Manages game library and purchases:
```typescript
const { games, loading, error, purchaseGame, refreshGames } = useGames(userId, {
  includeFamily: true,
  genre: string,
  searchTerm: string
});
```

## Component Library

The application uses a custom component library built with Tailwind CSS and Radix UI primitives. Key components include:

- Button
- Card
- Input
- Select
- Badge

All components support dark mode and follow the Steam-inspired design system defined in `globals.css`.

## Error Handling

The application implements comprehensive error handling:

1. **API Errors**
   - Consistent error response format
   - Proper HTTP status codes
   - Error logging and monitoring

2. **UI Error States**
   - Loading states
   - Error messages
   - Fallback UI components

3. **Type Safety**
   - TypeScript interfaces for all data structures
   - Runtime type checking
   - Database type generation

## Performance Optimization

1. **Client-side**
   - React component memoization
   - Debounced search
   - Optimistic UI updates

2. **Server-side**
   - API route optimization
   - Database query optimization
   - Proper indexing

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Containerization
This project is deployed to railway app, hence a containerization is needed. For the containerization, Docker is used as seen in the Dockerfile and docker-compose directory.
The Dockerfile is used to build a Docker image for the Next.js application, starting with installing dependencies, building the application, and preparing a production-ready image. Meanwhile, the docker-compose.yaml file is used to run the application container based on the built image, with additional configurations such as port mapping, volumes, and environment variables (including the Supabase URL and key). Together, they enable this Game Distribution App to run in an isolated, efficient container that is easy to deploy across different environments.

## Deployment
Deployment is done in two domains:
- [Vercel Deployment](https://game-dist-app.vercel.app)  
- [Railway Deployment](https://game-dist-app-production.up.railway.app)
Deploying the application on both Vercel and Railway provides flexibility and redundancy. Vercel is optimized for hosting Next.js applications, offering seamless integration, automatic builds, and a globally distributed edge network for fast performance. Railway, on the other hand, is ideal for hosting the backend API or services requiring server-side execution, as it supports full control over Dockerized applications and provides scalability for diverse workloads. Using both ensures the application benefits from Vercel's front-end optimizations and Railway's robust backend hosting capabilities, while also offering a backup in case one service faces downtime.

## Service Integration
1. **Request Access**  
   Obtain permission from the third-party chatbot service by sharing the app’s link or API key.

2. **Embed the Chatbot Script**  
   Include the following snippet in the app to load the chatbot service:

   ```javascript
   window.MUSICMATE_API_KEY = "your_api_key_here";

   <script src="https://spotify-bot.azurewebsites.net/static/js/widget-loader.js"></script>
The service integration I used is from a friend's service which is a chatbot, I integrated it to the app page so that it has chatbot embedded to it.
