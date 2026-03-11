# 🏨 Siladan Hotel Booking System

**JADE SILADAN — BSCS-3**

A luxury hotel booking web application built with the MERN stack (MongoDB, Express, React, Node.js).

![License](https://img.shields.io/badge/license-MIT-gold)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![Stack](https://img.shields.io/badge/stack-MERN-blue)
![Platform](https://img.shields.io/badge/deployed-Render-purple)

---

## 📋 Description

The Hotel Booking System is a comprehensive digital platform designed to streamline the process of reserving hotel accommodations. This system serves as a bridge between customers seeking lodging and hotels offering their rooms, automating what was traditionally a manual, time-consuming process.

LINK: https://silada-hotel.onrender.com

### Core Purpose

The system enables customers to search for available rooms, view room details and pricing, make reservations for specific dates, and manage their bookings — all through an intuitive digital interface. For hotel administrators, it provides tools to manage room inventory, track occupancy, process payments, and maintain customer records efficiently.

### Key Components

- **Customer Management** — Handles guest information, including registration, profile management, and booking history. The system stores essential customer details such as name, contact information, and preferences to streamline future bookings.
- **Room Management** — Maintains a comprehensive database of available rooms with detailed specifications including room type, amenities, capacity, and pricing. The system automatically updates room availability status in real-time.
- **Booking Management** — Processes reservation requests, validates availability for requested dates, and manages the complete booking lifecycle from creation to cancellation or completion.
- **Payment Processing** — Calculates total charges based on room rates, number of nights, and any additional services. The system handles secure payment transactions and generates invoices for completed bookings.

### System Benefits

This system eliminates manual paperwork, reduces booking errors, provides 24/7 availability for customers to make reservations, and offers hotels better control over their inventory and revenue management. It creates a seamless experience for both guests and hotel staff by centralizing all reservation-related activities in one platform.

---

## 🔄 Transaction: Detailed Process Flow

The following illustrates the complete journey of a hotel room booking from initial search to final confirmation:

### Step 1: Customer Initiates Search

**Action:** Customer accesses the hotel booking website and enters their requirements.

**Input Details:**
- Destination / Hotel name
- Check-in date
- Check-out date
- Number of guests
- Room preferences (optional)

**System Response:** The system queries the database and retrieves all available rooms matching the search criteria, displaying them with relevant details and pricing.

### Step 2: Room Selection and Review

**Action:** Customer browses available rooms and views detailed information.

**Displayed Information:**
- Room type and capacity
- Amenities and facilities
- Price per night
- Room images and descriptions
- Cancellation policies
- Total cost calculation

**Customer Decision:** After comparing options, the customer selects their preferred room and proceeds to booking.

### Step 3: Customer Information Entry

**Action:** Customer provides personal and contact information for the reservation.

**Required Information:**
- Full name (primary guest)
- Email address
- Phone number
- Identification details
- Special requests or notes (optional)

**System Validation:** The system validates all entered information for completeness and accuracy, checking for proper email format, phone number validity, and required fields.

### Step 4: Availability Verification

**System Process:** Before proceeding to payment, the system performs a final availability check.

**Verification Steps:**
- Queries database for room availability on selected dates
- Checks for conflicting reservations
- Temporarily locks the room to prevent double booking
- Sets a timer for completing the transaction

**Outcomes:**
- If Available: Proceed to payment
- If Unavailable: Notify customer and suggest alternative dates or rooms

### Step 5: Payment Processing

**Action:** Customer proceeds to payment gateway to complete the transaction.

**Payment Details:**
- Room rate × number of nights
- Taxes and service charges
- Any additional fees
- Total amount due

**Payment Methods Accepted:**
- Credit / Debit cards
- Digital wallets
- Bank transfers
- Pay at hotel (if enabled)

**Security Measures:** All payment information is encrypted and processed through secure payment gateways compliant with industry standards.

### Step 6: Booking Confirmation

**System Actions:** Upon successful payment, the system executes multiple processes simultaneously:
- Creates a unique booking reference number
- Updates room status from "available" to "booked" for selected dates
- Stores complete booking record in the database
- Generates booking confirmation document
- Sends confirmation email to customer with booking details
- Notifies hotel staff of new reservation

**Confirmation Details Provided:**
- Booking reference number
- Hotel name and address
- Room details and preferences
- Check-in and check-out dates
- Guest information
- Total amount paid
- Cancellation policy
- Contact information for inquiries

### Step 7: Post-Booking Management

**Customer Options:** After booking confirmation, customers can:
- **View Booking** — Access booking details anytime using the reference number
- **Modify Booking** — Change dates or room type (subject to availability and policy)
- **Cancel Booking** — Request cancellation and refund according to cancellation policy
- **Add Services** — Request additional amenities or special arrangements

**Pre-Arrival Communication:**
- Reminder emails sent 48 hours before check-in
- Check-in instructions and hotel information
- Option for early check-in or late check-out requests

### Step 8: Check-in and Stay

**On Arrival:**
- Customer presents booking confirmation or reference number
- Hotel staff retrieves reservation from system
- Verification of customer identity
- Room keys/cards issued
- System updates booking status to "checked-in"

**During Stay:**
- System tracks room occupancy
- Records any additional charges or services
- Customer can extend stay if rooms available

### Step 9: Check-out and Completion

**Check-out Process:**
- Customer completes check-out at reception or through express check-out
- System calculates final bill including any additional charges
- Settlement of outstanding amount if any
- System updates room status to "available" for selected dates
- Booking status changed to "completed"

**Post-Stay:**
- System sends feedback survey to customer
- Customer history updated for future reference
- Invoice and receipt sent via email
- Booking record archived for hotel records

### Process Flow Summary

1. **Customer Search** → System displays available rooms
2. **Room Selection** → Customer reviews details
3. **Enter Information** → System validates data
4. **Availability Check** → System verifies and locks room
5. **Payment** → Secure transaction processing
6. **Confirmation** → System creates booking record
7. **Post-Booking** → Customer manages reservation
8. **Check-in** → System updates status
9. **Check-out** → Booking completion

---

## ✨ Features

- 🛏️ **Room Browsing & Booking** — Browse rooms by type (Standard, Deluxe, Suite, Presidential), price, and capacity with real-time availability
- 🔐 **User Authentication** — Secure JWT-based registration/login with bcrypt password hashing
- 👤 **User Profiles** — View booking history, manage profile, cancel pending bookings
- 🛡️ **Admin Dashboard** — Manage rooms, bookings, and users with analytics overview
- 💰 **Philippine Peso (₱) Pricing** — All rates displayed in PHP
- 🎨 **Luxury Design** — Elegant dark theme with gold accents, smooth animations, fully responsive
- 🗄️ **Zero-Config Database** — Uses MongoDB Memory Server; no external database setup needed

---

## 🚀 Quick Start (Standalone / Local Hosting)

### Prerequisites
- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)

> ⚠️ **No external MongoDB needed!** This app uses **MongoDB Memory Server** which runs an in-memory database automatically. Just install and run — no setup required.

### 1. Clone the Repository
```bash
git clone https://github.com/DeathKnell837/Silada-Hotel-Booking-System.git
cd Silada-Hotel-Booking-System
```

### 2. Install All Dependencies
```bash
npm install
```
This automatically installs both server and client dependencies.

### 3. Start the Application
```bash
npm run dev
```
This starts both the backend (port 5000) and frontend (port 5173) concurrently.

### 4. Open in Browser
Navigate to: **http://localhost:5173**

---

## 🔑 Default Accounts

The database is automatically seeded with the following accounts on first run:

| Role  | Name          | Email              | Password  |
|-------|---------------|--------------------|-----------|
| Admin | Admin Siladan | admin@siladan.com  | admin123  |
| User  | John Doe      | john@example.com   | user123   |
| User  | Jane Smith    | jane@example.com   | user123   |

> **Admin** has full access to the Admin Dashboard (manage rooms, bookings, and users).  
> **Users** can browse rooms, make bookings, and manage their own profile and reservations.

---

## 📁 Project Structure

```
├── client/                 # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Page components (Home, Rooms, Booking, Admin, ...)
│   │   ├── services/       # API & data service functions
│   │   ├── utils/          # Helper utilities
│   │   └── App.jsx         # Main app with routes
│   └── package.json
├── server/                 # Node.js/Express Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route handler logic
│   ├── middleware/         # Auth & error middleware
│   ├── models/             # Mongoose schemas (User, Room, Booking)
│   ├── routes/             # API route definitions
│   ├── utils/              # Token generation helpers
│   ├── seed.js             # Database seeder (auto-runs on start)
│   └── server.js           # Express app entry point
├── render.yaml             # Render deployment config
└── package.json            # Root scripts (dev, build, start)
```

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS                    |
| Backend    | Node.js 18+, Express.js                         |
| Database   | MongoDB Memory Server (in-memory, no setup)     |
| Auth       | JWT (JSON Web Tokens), bcryptjs                 |
| UI / UX    | Framer Motion, React Icons, Swiper              |
| Hosting    | Render (free tier)                              |
| Currency   | Philippine Peso (PHP ₱)                         |

---

## 📡 API Endpoints

| Method | Endpoint                  | Description           | Access  |
|--------|---------------------------|-----------------------|---------|
| POST   | /api/auth/register        | Register user         | Public  |
| POST   | /api/auth/login           | Login user            | Public  |
| GET    | /api/auth/profile         | Get profile           | Private |
| GET    | /api/rooms                | Get all rooms         | Public  |
| GET    | /api/rooms/featured       | Get featured rooms    | Public  |
| GET    | /api/rooms/:id            | Get room details      | Public  |
| POST   | /api/rooms                | Create room           | Admin   |
| PUT    | /api/rooms/:id            | Update room           | Admin   |
| DELETE | /api/rooms/:id            | Delete room           | Admin   |
| POST   | /api/bookings             | Create booking        | Private |
| GET    | /api/bookings/my          | My bookings           | Private |
| GET    | /api/bookings             | All bookings          | Admin   |
| PUT    | /api/bookings/:id/status  | Update booking status | Admin   |
| PUT    | /api/bookings/:id/cancel  | Cancel booking        | Private |
| GET    | /api/users                | Get all users         | Admin   |
| DELETE | /api/users/:id            | Delete user           | Admin   |

---

## 📝 Conclusion

The Hotel Booking System represents a sophisticated yet user-friendly solution that revolutionizes the hospitality industry's reservation management. By digitizing and automating the entire booking workflow, this system delivers substantial benefits to both customers and hotel operators.

For customers, the system provides unparalleled convenience through 24/7 accessibility, instant booking confirmation, transparent pricing, and flexible management options. The intuitive interface guides users smoothly from search to confirmation, eliminating the frustrations traditionally associated with hotel reservations. Real-time availability updates ensure customers can make informed decisions, while secure payment processing provides peace of mind throughout the transaction.

From the hotel's perspective, the system optimizes operational efficiency by automating routine tasks, minimizing human error, and providing comprehensive oversight of room inventory and occupancy. The centralized database ensures accurate, up-to-date information across all booking channels, preventing costly double-bookings and improving revenue management. Hotel staff can focus on delivering exceptional guest experiences rather than managing paperwork and manual reservations.

The system's scalability allows it to serve establishments of varying sizes, from small boutique hotels to large international chains. Its modular design means hotels can implement basic functionality initially and expand capabilities as needs grow, making it an accessible solution for businesses at different stages of digital transformation.

---

## 📜 License

MIT License — feel free to use this project for learning or personal use.

---

**Developed by Jade Siladan | BSCS-3**
