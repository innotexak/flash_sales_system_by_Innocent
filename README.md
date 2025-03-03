```markdown
# Microservice API

## Overview
This is a Node.js microservice using Express and TypeScript with a test-driven development (TDD) approach. The service provides basic user management, including retrieving users, creating users, and fetching a user by email.

## Features
- Get a list of users
- Create a new user
- Retrieve a user by email
- Written in TypeScript
- Tested with Jest and Supertest

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd microservice
   ```

2. Install dependencies:
   ```sh
   yarn install
   ```

3. Start the development server:
   ```sh
   yarn dev
   ```

## Running Tests
To run the Jest tests with coverage:
```sh
yarn test
```

## API Endpoints

### Get all users
```http
GET /users
```
Response:
```json
[
  { "name": "John Doe", "email": "john@example.com" }
]
```

### Create a user
```http
POST /users
```
Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```
Response:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Get user by email
```http
GET /users/:email
```
Response (if user exists):
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```
Response (if user not found):
```json
{
  "message": "User not found"
}
```

## Git Workflow

### Undo `git add .`
If you mistakenly staged all changes, run:
```sh
git reset .
```
To unstage a specific file:
```sh
git reset <file-name>
```
If you already committed and want to undo it:
```sh
git reset --soft HEAD~1
```

## License
MIT License
```

