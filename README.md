# Blog API
The blog-api is a RESTful API built with Express.js and Prisma ORM, using a PostgreSQL database. It provides endpoints to manage blog posts, user authentication, and comments for a blog application.
This serves as backend for the Blog project. You can find the frontend code here: https://github.com/McTintor/blog-frontend

## Features
- User Authentication: Users can sign up, log in, and authenticate via JWT (JSON Web Tokens).
- Blog Posts: Users can create, edit, and delete blog posts.
- Comments: Users can add comments to specific blog posts.
- Database: Uses PostgreSQL as the database with Prisma ORM.
- JWT Authentication: Secure API endpoints with JWT tokens.

## Setting Up and Running blog-api Locally
### Prerequisites
- Install Node.js: Ensure you have Node.js installed on your system. You can download it from nodejs.org.
- Install PostgreSQL: Install PostgreSQL on your local machine. You can download it from postgresql.org.


- Step 1: Clone the Repository
`git clone https://github.com/mctintor/blog-api.git`
`cd blog-api`
- Step 2: Install Dependencies
`npm install`
- Step 3: Create a PostgreSQL Database
  - Access PostgreSQL:

Open your terminal or PostgreSQL management tool (like pgAdmin).
If using the terminal, connect to PostgreSQL:
`psql -U postgres`
(Replace postgres with your PostgreSQL username if it's different.)
Create a new database:
`CREATE DATABASE blogdb;`
* Optional: If you'd like to create a user with a specific password and grant permissions:

`CREATE USER bloguser WITH PASSWORD 'blogpassword';`
`GRANT ALL PRIVILEGES ON DATABASE blogdb TO bloguser;`


- Step 4: Set Up the .env File
In the root directory of the project, create a .env file and add the following:
`DATABASE_URL=postgresql://[username]:[password]@localhost:5432/blogdb`
`JWT_SECRET=your-jwt-secret`
* Replace [username] with your PostgreSQL username (e.g., postgres or bloguser if you created it).
* Replace [password] with your PostgreSQL password.
* Replace your-jwt-secret with a secure key for JWT.
Example:

`DATABASE_URL=postgresql://bloguser:blogpassword@localhost:5432/blogdb`
`JWT_SECRET=my-very-secure-jwt-key`


- Step 5: Apply Prisma Migrations
Run the following command to apply database schema migrations:
`npx prisma migrate deploy`
This command will set up the required tables in your database.


- Step 6: Start the Server
Run the following command to start the Express server:
`npm start`
The API will be running at http://localhost:5000.



## API Endpoints
- POST /api/users/register: Register a new user (sign up).
- POST /api/users/login: Log in and get a JWT token.
- GET /api/posts: Get all blog posts.
- POST /api/posts: Create a new blog post (requires authentication).
- PUT /api/posts/:id: Edit an existing blog post (requires authentication).
- DELETE /api/posts/:id: Delete a blog post (requires authentication).
- GET /api/posts/:id: Get details of a specific post by ID.
- POST /api/posts/:id/comments: Add a comment to a post.
- PUT /api/comments/:id: Edit a comment (requires authentication).
- DELETE /api/comments/:id: Delete a comment (requires authentication).
