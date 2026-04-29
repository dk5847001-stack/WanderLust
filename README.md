# WanderLust

WanderLust is a full-stack travel listing platform built with Node.js, Express, MongoDB, EJS, and Passport authentication. It allows users to browse stays, create and manage listings, upload listing images, leave reviews, and interact through subscriber and contact flows.

This project is designed as a real-world CRUD web application with authentication, authorization, server-side rendering, validation, media uploads, session management, and third-party map/geocoding integration.

## Highlights

- Full-stack MVC architecture with clean separation of routes, controllers, models, middleware, and views
- User authentication with Passport Local and `passport-local-mongoose`
- Protected create, edit, and delete flows for listings
- Ownership-based authorization for listing updates and deletes
- Review creation and deletion with author-based permission checks
- Cloudinary image upload support using Multer
- MapTiler geocoding integration for listing coordinates
- Search, category filtering, and price filtering
- Session persistence with MongoDB-backed session store
- Flash messaging for user feedback
- Contact message management and subscriber management panels

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend

- EJS
- EJS-Mate
- Bootstrap-based server-rendered UI

### Authentication and Sessions

- Passport.js
- Passport Local
- Passport Local Mongoose
- Express Session
- Connect Mongo

### Validation and Utilities

- Joi
- Method Override
- Connect Flash
- Cookie Parser

### Media and External Services

- Cloudinary
- Multer
- Multer Storage Cloudinary
- MapTiler Geocoding API

## Core Features

### 1. Authentication

- User registration
- User login
- User logout
- Persistent login sessions
- Redirect-to-original-page after authentication

### 2. Listings

- Create a new travel listing
- Upload cover images for listings
- Edit and delete owned listings
- View all listings
- View individual listing details
- Automatic geocoding for location and country
- Listing categories such as `Trending`, `Rooms`, `Cities`, `Mountains`, `Pools`, `Camping`, and more

### 3. Reviews

- Add reviews to listings
- Rating support
- Review author protection for delete actions
- Average rating calculation on listing detail pages
- Cascade cleanup of listing reviews when a listing is deleted

### 4. Search and Filtering

- Search by title
- Search by location
- Search by country
- Filter by category
- Filter by price threshold

### 5. Contact and Subscriber Modules

- Contact form for user messages
- Admin-style message listing, editing, and deletion flow
- Newsletter or subscriber capture flow
- Subscriber edit and delete support

## Project Structure

```text
WANDERLUST/
├── controllers/        # Request handlers and business logic
├── middleware/         # Authentication and authorization middleware
├── models/             # Mongoose schemas and models
├── public/             # Static assets
├── routes/             # Express routes
├── uploads/            # Local upload-related workspace files
├── utils/              # Utility helpers and custom error handling
├── views/              # EJS templates
├── app.js              # Main application entry point
├── cloudConfig.js      # Cloudinary configuration
├── schema.js           # Joi schemas
├── validation.js       # Validation middleware
└── package.json
```

## Architecture Overview

This application follows the MVC pattern:

- Models define the MongoDB data structure.
- Routes define request endpoints.
- Controllers contain the main business logic.
- Middleware handles reusable guards such as authentication and authorization.
- Views render server-side HTML using EJS.

This structure keeps the app scalable and easier to maintain as features grow.

## Environment Variables

Create a `.env` file in the project root and configure the following values:

```env
MONGO_URI=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAPTILER_KEY=your_maptiler_api_key
```

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/dk5847001-stack/WanderLust.git
cd WanderLust
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Add the `.env` file using the keys listed above.

### 4. Start the application

```bash
npm start
```

The app runs on:

```text
http://localhost:3000
```

If a `PORT` environment variable is provided by the hosting platform, the app will use that automatically.

## Important Routes

### Public and Auth

- `GET /` - Home page
- `GET /register` - Register page
- `POST /register` - Create a user account
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `POST /logout` - Logout user

### Listings

- `GET /listings` - List all listings
- `GET /listings/new` - Render new listing form
- `POST /listings` - Create listing
- `GET /listings/:id` - Listing detail page
- `GET /listings/:id/edit` - Edit form for owner
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `GET /listings/api` - JSON listing feed with filters

### Reviews

- `POST /listings/:id/reviews` - Create review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Messages and Subscribers

- `GET /message` - Contact page
- `POST /message` - Submit message
- `GET /message/read` - Read saved messages
- `GET /subscriber` - View subscribers
- `POST /subscriber` - Add subscriber

## Render Deployment

This project is ready to be deployed as a Render `Web Service`.

### Recommended Render configuration

- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

### Add these environment variables on Render

- `MONGO_URI`
- `SECRET`
- `CLOUD_NAME`
- `CLOUD_API_KEY`
- `CLOUD_API_SECRET`
- `MAPTILER_KEY`

### Deployment notes

- Use MongoDB Atlas for production instead of a local MongoDB URL.
- Do not commit your `.env` file.
- Make sure Cloudinary credentials are valid before testing image uploads.
- The application expects the hosting platform to provide `PORT`, which Render does automatically.

## Data Models

### User

- `email`
- `username`
- password handling via Passport Local Mongoose

### Listing

- `title`
- `description`
- `image`
- `price`
- `location`
- `country`
- `geometry`
- `category`
- `reviews`
- `owner`

### Review

- linked to listing
- linked to author
- rating and comment data

### Message

- name
- email
- subject
- message

### Subscriber

- email

## Security and Validation

- Joi-based request validation for listings and reviews
- Authentication checks for protected routes
- Authorization checks for listing owners and review authors
- Session-backed login state
- Flash-based error and success communication

## Current Strengths

- Practical full-stack architecture
- Strong CRUD coverage
- Clean feature separation
- Useful third-party service integration
- Good foundation for scaling into a production-grade travel marketplace

## Suggested Future Improvements

- Add role-based admin authorization for message and subscriber management
- Add pagination for listings
- Add advanced filters like date availability and sorting
- Add image gallery support per listing
- Add wishlists or favorites
- Add booking workflow
- Add automated tests
- Add API documentation
- Add rate limiting and security headers

## Author

Developed by the WanderLust project owner.

If you want, this README can be further customized with:

- project screenshots
- live demo link
- author name and portfolio links
- badges for Node, Express, MongoDB, and Render

## License

This project is currently shared without a custom license file. Add an MIT license if you plan to make it open source for wider reuse.
