# NewsPortal Backend Documentation

## Overview
NewsPortal is a full-stack Next.js web application with a file-based JSON persistence system. It provides a complete news portal where users can create, read, update, and delete news articles with authentication and comments.

---

## Architecture & Data Flow

### 📊 System Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React/Next.js)                     │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐   │
│  │ Navbar  │  │ NewsList │  │ NewsCard │  │ Forms & Auth   │   │
│  └────┬────┘  └─────┬────┘  └──────────┘  └────────┬───────┘   │
└───────┼──────────────┼────────────────────────────────┼──────────┘
        │              │                                │
        └──────────────┴────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│                  API Layer (Next.js Routes)                      │
│  ┌──────────────────┐      ┌──────────────────┐                 │
│  │  Auth API        │      │  News API        │                 │
│  │ - POST /login    │      │ - GET  /list     │                 │
│  │ - POST /register │      │ - POST /create   │                 │
│  │ - POST /logout   │      │ - GET  /:id      │                 │
│  │ - GET  /me       │      │ - PATCH /:id     │                 │
│  └──────────────────┘      │ - DELETE /:id    │                 │
│                             │ - POST /seed     │                 │
│                             └──────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│              Business Logic & Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ userService  │  │ newsService  │  │ auth utils   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│         Database Layer (File-based JSON Store)                   │
│                      .data/store.json                             │
│  ┌──────────────┐  ┌──────────────────┐                         │
│  │ Users Array  │  │ News Array       │                         │
│  │ - _id        │  │ - _id            │                         │
│  │ - name       │  │ - title          │                         │
│  │ - email      │  │ - body           │                         │
│  │ - password   │  │ - category       │                         │
│  │ - timestamps │  │ - comments []    │                         │
│  └──────────────┘  │ - timestamps     │                         │
│                    └──────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure

### Core Backend Files

#### 1. **lib/db.ts** - Database Layer
**Purpose**: Handles all data persistence and retrieval operations.

**Key Functions**:
- `readStore()` - Reads data from JSON file
- `writeStore(store)` - Writes data to JSON file
- `generateId()` - Creates UUID for new records
- `createUser(userData)` - Creates new user
- `findUserByEmail(email)` - Finds user by email
- `findUserById(id)` - Finds user by ID
- `createNewsItem(newsData)` - Creates new article
- `getAllNewsFromStore(category)` - Retrieves all news with optional category filter
- `getNewsById(id)` - Gets specific article
- `updateNewsItem(id, updates)` - Updates article
- `deleteNewsItem(id)` - Deletes article
- `addComment(newsId, commentData)` - Adds comment to article

**Data Structures**:
```typescript
// User
interface StoredUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// News Article
interface StoredNews {
  _id: string;
  title: string;
  body: string;
  category: string;
  authorId: string;
  authorName: string;
  comments: StoredComment[];
  createdAt: string;
  updatedAt: string;
}

// Comment
interface StoredComment {
  _id: string;
  userId: string;
  userName: string;
  body: string;
  createdAt: string;
}
```

#### 2. **lib/auth.ts** - Authentication Utils
**Purpose**: Handles JWT token creation and validation.

**Key Functions**:
- `createToken(userId, name)` - Generates JWT token (7-day expiry)
- `verifyToken(token)` - Validates and decodes JWT
- `authenticateRequest(request)` - Extracts and validates token from cookies

**Token Structure**:
- Algorithm: HS256
- Payload: `{ userId, name, iat, exp }`
- Secret: Loaded from `AUTH_SECRET` environment variable

#### 3. **lib/validation.ts** - Input Validation
**Purpose**: Schema validation using Zod.

**Schemas**:
- `loginSchema` - Email & password validation
- `registerSchema` - Name, email, password validation
- `newsSchema` - Title, body, category validation
- `commentSchema` - Comment body validation

#### 4. **services/userService.ts** - User Business Logic
**Key Functions**:
- `registerUser(email, password, name)` - Handles registration
  - Validates email format
  - Checks for duplicate email
  - Hashes password (bcrypt)
  - Creates user record
  - Returns user + JWT token
  
- `loginUser(email, password)` - Handles login
  - Finds user by email
  - Compares password with bcrypt
  - Generates JWT token
  - Returns user + token

#### 5. **services/newsService.ts** - News Business Logic
**Key Functions**:
- `createNews(title, body, category, authorId, authorName)` - Creates article
- `getAllNews(category)` - Retrieves articles with optional filtering
- `getNewsById(id)` - Gets single article with comments
- `updateNews(id, updates, userId)` - Updates article (authorization check)
- `deleteNews(id, userId)` - Deletes article (authorization check)
- `addComment(newsId, body, userId, userName)` - Adds comment to article

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
**Purpose**: Create a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (201)**:
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

**Errors**:
- `400` - Validation error (invalid email, password too short)
- `409` - Email already exists

---

#### POST `/api/auth/login`
**Purpose**: Authenticate user and get JWT token

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (200)**:
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

**Errors**:
- `400` - Validation error
- `401` - Invalid credentials

**Side Effects**:
- Sets `auth-token` HTTP-only cookie (7 days expiry)

---

#### POST `/api/auth/logout`
**Purpose**: Logout user

**Response (200)**:
```json
{
  "message": "Logged out successfully"
}
```

**Side Effects**:
- Clears `auth-token` cookie

---

#### GET `/api/auth/me`
**Purpose**: Get current authenticated user

**Response (200)**:
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors**:
- `401` - Not authenticated

---

### News Endpoints

#### GET `/api/news`
**Purpose**: Get all news articles with optional category filtering

**Query Parameters**:
- `category` (optional) - Filter by category (Technology, Sports, Politics, etc.)

**Response (200)**:
```json
[
  {
    "_id": "uuid",
    "title": "Breaking News Title",
    "body": "Article content...",
    "category": "Technology",
    "authorName": "John Doe",
    "comments": [
      {
        "_id": "uuid",
        "userName": "Jane Doe",
        "body": "Great article!",
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ],
    "createdAt": "2025-01-15T09:00:00Z"
  }
]
```

**Features**:
- Returns articles sorted by date (newest first)
- Always public (no authentication required)

---

#### POST `/api/news`
**Purpose**: Create a new news article

**Authentication**: Required (JWT token in cookie)

**Request Body**:
```json
{
  "title": "Article Title",
  "body": "Article content (minimum 20 characters)",
  "category": "Technology"
}
```

**Response (201)**:
```json
{
  "_id": "uuid",
  "title": "Article Title",
  "body": "Article content",
  "category": "Technology",
  "authorId": "user_uuid",
  "authorName": "John Doe",
  "comments": [],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

**Errors**:
- `401` - Not authenticated
- `400` - Validation error

---

#### GET `/api/news/:id`
**Purpose**: Get a specific news article with all comments

**Response (200)**:
```json
{
  "_id": "uuid",
  "title": "Article Title",
  "body": "Full article content",
  "category": "Technology",
  "authorId": "user_uuid",
  "authorName": "John Doe",
  "comments": [
    {
      "_id": "uuid",
      "userId": "commenter_uuid",
      "userName": "Jane Doe",
      "body": "Great article!",
      "createdAt": "2025-01-15T11:00:00Z"
    }
  ],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

**Errors**:
- `404` - Article not found

---

#### PATCH `/api/news/:id`
**Purpose**: Update a news article (author only)

**Authentication**: Required (must be article author)

**Request Body**:
```json
{
  "title": "Updated Title",
  "body": "Updated content",
  "category": "Science"
}
```

**Response (200)**:
```json
{
  "_id": "uuid",
  "title": "Updated Title",
  "body": "Updated content",
  "category": "Science",
  "authorId": "user_uuid",
  "authorName": "John Doe",
  "comments": [],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T12:00:00Z"
}
```

**Errors**:
- `401` - Not authenticated or not author
- `403` - Not permission to edit
- `404` - Article not found

---

#### DELETE `/api/news/:id`
**Purpose**: Delete a news article (author only)

**Authentication**: Required (must be article author)

**Response (200)**:
```json
{
  "message": "News article deleted successfully"
}
```

**Errors**:
- `401` - Not authenticated
- `403` - Not author of article
- `404` - Article not found

---

#### POST `/api/news/:id/comments`
**Purpose**: Add a comment to an article

**Authentication**: Required

**Request Body**:
```json
{
  "body": "This is a great article!"
}
```

**Response (201)**:
```json
{
  "comment": {
    "_id": "uuid",
    "userId": "user_uuid",
    "userName": "Jane Doe",
    "body": "This is a great article!",
    "createdAt": "2025-01-15T11:30:00Z"
  },
  "totalComments": 5
}
```

**Errors**:
- `401` - Not authenticated
- `404` - Article not found

---

#### GET `/api/news/:id/comments`
**Purpose**: Get all comments for an article

**Response (200)**:
```json
[
  {
    "_id": "uuid",
    "userName": "Jane Doe",
    "body": "Great article!",
    "createdAt": "2025-01-15T11:00:00Z"
  }
]
```

---

#### POST `/api/seed` (admin only)
**Purpose**: Seed database with sample data (for demo/testing)

**Response (200)**:
```json
{
  "message": "Database seeded successfully"
}
```

**Features**:
- Clears existing data
- Creates sample users and articles
- Creates sample comments
- Useful for testing and demos

---

## Authentication Flow

### User Registration/Login Flow

```
Client Registration Request
         ↓
[POST /api/auth/register]
         ↓
Validate Input (Zod Schema)
         ↓
Check Email Exists → [409 Conflict]
         ↓
Hash Password (bcrypt)
         ↓
Create User in DB
         ↓
Generate JWT Token
         ↓
Set HTTP-only Cookie (auth-token)
         ↓
Return User + Token [201]
```

### Protected Endpoint Access

```
Client Makes Request
         ↓
[Cookie auth-token sent automatically]
         ↓
Middleware checks token in cookie
         ↓
JWT Verification (HS256)
         ↓
Token Valid? → Extract userId & name
         ↓
Attach to request context
         ↓
Process Request & Return Response
```

---

## Security Features

### 1. **Password Security**
- Uses bcrypt with salt rounds for hashing
- Never stores plain-text passwords
- Comparison done using bcrypt.compare()

### 2. **Authentication**
- JWT tokens with 7-day expiration
- HTTP-only cookies prevent XSS attacks
- SameSite=Lax for CSRF protection
- Secure flag in production

### 3. **Authorization**
- Only article authors can edit/delete
- Users can only modify their own articles
- Comments are read-only once created

### 4. **Input Validation**
- Zod schema validation on all inputs
- Email format validation
- Password length requirements
- Title and body length checks

### 5. **Data Persistence**
- File-based JSON store is read/written atomically
- No SQL injection risks (not using SQL)
- Data backed up in .data/store.json

---

## Data Persistence

### How File-Based Storage Works

1. **Initialization** (`lib/db.ts`)
   - Checks if `.data/store.json` exists
   - If not, creates directory and file
   - Loads data into memory on server start

2. **Reading Data**
   - `readStore()` parses JSON file
   - Returns in-memory store object
   - Handles file corruption gracefully

3. **Writing Data**
   - `saveStore()` writes entire store to file
   - Uses `JSON.stringify()` with 2-space indent
   - Creates directory if not exists
   - Overwrites previous data

4. **Data Consistency**
   - All reads happen before writes
   - No concurrent write conflicts
   - File sync ensures data is saved to disk

### Limitations & Considerations
- ⚠️ Not suitable for high-concurrency applications
- ✅ Perfect for single-server deployments
- ✅ Great for learning and demos
- Data lost if .data directory is deleted
- No transaction support

---

## Error Handling

### Error Response Format
```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

| Code | Meaning | Cause |
|------|---------|-------|
| 400 | Bad Request | Invalid input data, failed validation |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, resource conflict |
| 500 | Server Error | Unexpected server error |

---

## Key Features & Flows

### 1. Create Article Flow
```
User clicks "New Article"
    ↓
Redirected to /news/create
    ↓
Check if user authenticated
    ↓
User fills in form (title, body, category)
    ↓
Form validation in UI
    ↓
POST /api/news
    ↓
Backend validates input
    ↓
Extract authorId from JWT
    ↓
Create article in DB
    ↓
Return article with _id
    ↓
Redirect to /news/:id (view article)
```

### 2. Filter by Category Flow
```
User clicks category (e.g., "Technology")
    ↓
setActiveCategory("Technology")
    ↓
Fetch /api/news?category=Technology
    ↓
Backend filters articles by category
    ↓
Returns filtered articles
    ↓
UI displays filtered results
```

### 3. Add Comment Flow
```
User writes comment on article
    ↓
POST /api/news/:id/comments
    ↓
Backend validates comment text
    ↓
Extract userId from JWT
    ↓
Add comment to article.comments array
    ↓
Save updated article to DB
    ↓
Return updated comments count
```

---

## Environment Variables

```env
# Authentication
AUTH_SECRET=your-secret-key-for-jwt-signing

# Node Environment
NODE_ENV=development|production

# API URLs (for frontend)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Database Schema

### Store Structure (store.json)
```json
{
  "users": [
    {
      "_id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "bcrypt_hashed_password",
      "createdAt": "2025-01-15T09:00:00Z",
      "updatedAt": "2025-01-15T09:00:00Z"
    }
  ],
  "news": [
    {
      "_id": "uuid",
      "title": "Article Title",
      "body": "Article content",
      "category": "Technology",
      "authorId": "user_uuid",
      "authorName": "John Doe",
      "comments": [
        {
          "_id": "uuid",
          "userId": "commenter_uuid",
          "userName": "Jane Doe",
          "body": "Comment text",
          "createdAt": "2025-01-15T11:00:00Z"
        }
      ],
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

## Running the Backend

### Start Development Server
```bash
npm run dev
# or
pnpm dev
```

### Build for Production
```bash
npm run build
npm start
```

### Seed Database
```bash
POST /api/seed
```

---

## Troubleshooting

### Issue: "Authentication required" on protected routes
**Solution**: Check that cookies are being sent with requests
- Verify `credentials: "include"` in fetch calls
- Check browser DevTools > Application > Cookies
- Ensure auth-token cookie exists and is valid

### Issue: Articles not persisting after restart
**Solution**: Check .data directory permissions
- Ensure `.data` directory has write permissions
- Check `process.cwd()` is correct
- Verify store.json file exists and is readable

### Issue: "Email already exists" on registration
**Solution**: Clear database and try again
- POST /api/seed to reset database (requires admin authentication)
- Or delete .data/store.json

---

## Performance Considerations

1. **File I/O** - Reading/writing JSON on every operation
   - Acceptable for < 1000 articles
   - Consider caching for larger datasets

2. **Memory** - Entire database loaded per request
   - ~MB per 1000 articles (acceptable)

3. **Scalability** - Not horizontally scalable
   - Stick to single instance deployments
   - For more users, migrate to MongoDB/PostgreSQL

---

## Future Improvements

- [ ] Migrate to MongoDB for better scalability
- [ ] Add database indexing
- [ ] Implement rate limiting
- [ ] Add article search functionality
- [ ] Add user profiles
- [ ] Add email notifications
- [ ] Add article tags and advanced filtering
- [ ] Add like/upvote feature
- [x] Add user roles (admin, reporter) -- implemented by extending user model, JWT payload, and seed script to create default admin and reporter accounts.

---

**Document Version**: 1.0  
**Last Updated**: March 1, 2026
