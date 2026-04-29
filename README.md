🚀 WanderLust — Next-Gen Travel Platform

WanderLust is a modern full-stack travel listing platform engineered with scalability, performance, and real-world usability in mind.
It enables users to explore destinations, create listings, upload media, share experiences, and interact seamlessly — all within a secure and structured ecosystem.

💡 Designed as a production-ready application showcasing clean architecture, authentication, and real-world features

✨ Key Highlights
⚡ Scalable MVC Architecture
🔐 Secure Authentication with Passport
🧠 Smart Authorization (Owner-based access control)
🌍 Integrated Geolocation & Maps (MapTiler)
☁️ Cloud-based Image Uploads (Cloudinary)
💬 Review & Rating System
🔎 Advanced Search & Filtering
📩 Contact & Subscriber Management
🧾 Session-based User Experience
🧱 Tech Stack
🖥 Backend
Node.js
Express.js
MongoDB + Mongoose
🎨 Frontend
EJS + EJS-Mate
Bootstrap (Server-rendered UI)
🔐 Authentication
Passport.js
Passport Local Strategy
Passport-Local-Mongoose
🧰 Tools & Utilities
Joi (Validation)
Multer (File Upload)
Method Override
Connect Flash
Cookie Parser
☁️ External Services
Cloudinary (Media Storage)
MapTiler API (Geocoding & Maps)
⚙️ Core Features
🔑 Authentication System
User Registration & Login
Secure Session Handling
Redirect after login (UX optimized)
🏡 Listings Engine
Create / Edit / Delete Listings
Image Upload Support
Location-based Listings
Category-based organization (Trending, Mountains, Pools, etc.)
⭐ Review System
Add & Delete Reviews
Rating System (1–5)
Author-based access control
Automatic cleanup on deletion
🔍 Search & Filtering
Search by:
Title
Location
Country
Filter by:
Category
Price
📬 Engagement Modules
Contact Form (Message handling system)
Subscriber Management (Newsletter-ready)
📁 Project Structure
WANDERLUST/
├── controllers/        # Business logic
├── middleware/         # Auth & validation layers
├── models/             # Database schemas
├── routes/             # API endpoints
├── views/              # EJS templates
├── public/             # Static assets
├── utils/              # Helpers & error handlers
├── uploads/            # Temporary storage
├── app.js              # App entry point
├── cloudConfig.js      # Cloudinary setup
├── validation.js       # Joi validation logic
└── package.json
🧠 Architecture

WanderLust follows a clean MVC pattern:

Models → Define data schema
Views → Render UI using EJS
Controllers → Handle logic
Routes → Manage endpoints
Middleware → Security & validation

✔ Keeps code maintainable, modular, and scalable

🔐 Environment Configuration

Create a .env file:

MONGO_URI=your_mongodb_connection_string
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAPTILER_KEY=your_maptiler_api_key
🚀 Local Setup
git clone https://github.com/dk5847001-stack/WanderLust.git
cd WanderLust
npm install
npm start

🔗 App runs at:

http://localhost:3000
🌐 API Overview
🔓 Public Routes
/ → Home
/login → Login
/register → Signup
🏡 Listings
/listings → All listings
/listings/:id → Listing details
/listings/new → Create listing
⭐ Reviews
/listings/:id/reviews → Add review
📩 Contact & Subscribers
/message
/subscriber
🚀 Deployment (Render)

Recommended Config:

Runtime: Node
Build: npm install
Start: npm start
🔑 Add Environment Variables:
MONGO_URI
SECRET
CLOUD_NAME
CLOUD_API_KEY
CLOUD_API_SECRET
MAPTILER_KEY
📊 Data Models
👤 User
email
username
password (hashed)
🏡 Listing
title, description
image
price
location, country
owner
reviews
⭐ Review
comment
rating
author
🛡 Security
Joi Validation
Auth + Authorization Middleware
Session-based Authentication
Flash Messaging for UX
Protected CRUD Operations
💡 Future Enhancements
🧑‍💼 Admin Dashboard
📄 Pagination
❤️ Wishlist Feature
📅 Booking System
🧪 Automated Testing
📚 API Docs
🛡 Rate Limiting & Security Headers
👨‍💻 Author

Developed by WanderLust Creator

📜 License

MIT License (Recommended for open source)