# 🌍 **BookIt: Experiences & Slots**

> _Suggestion: Replace the placeholder below with a real screenshot of your app's home page._

![BookIt Screenshot](ADD_YOUR_SCREENSHOT_LINK_HERE)

---

## 🚀 **Live Demo Links**

- **Frontend (Vercel):** [ADD YOUR VERCEL LINK HERE]  
- **Backend (Render):** [ADD YOUR RENDER LINK HERE]

---

## ✨ **Project Overview**

**BookIt** is a full-stack web application built for an intern assignment.  
It allows users to:

- Browse travel experiences  
- View detailed descriptions  
- Check slot availability  
- Complete a full booking flow  

This project emphasizes **industry-standard practices**, including:

- Layered backend architecture  
- Atomic transactions for bookings  
- Modern, component-based frontend using **Next.js 14**

---

## ⚙️ **Tech Stack & Architecture**

This repository is a **monorepo** containing two separate projects:  
🖥️ **Frontend** and ⚙️ **Backend**

---

### 🖥️ **Frontend (Deployed on Vercel)**

- **Framework:** Next.js 14 (App Router)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  

#### **Architecture Highlights**

- **Server Components (`page.tsx`)** → For initial data fetching and rendering  
- **Client Components (`"use client"`)** → For interactivity (search, forms, slot selection)  
- **URL State Management:** Uses `useSearchParams` as the single source of truth for real-time search  
- **Component-Based UI:** Reusable and modular, following clear separation of concerns  
  - Example directories: `layout/`, `features/`, `ui/`

---

### ⚙️ **Backend (Deployed on Render)**

- **Framework:** Node.js + Express  
- **Language:** JavaScript (ESM)  
- **Database:** MongoDB (with Mongoose)  

#### **Architecture Highlights**

- **Layered (N-Tier) Architecture:**  
  - **Routes:** Define API endpoints  
  - **Controllers:** Validate and orchestrate requests  
  - **Services:** Core business logic (e.g., price calculation, slot availability)  
  - **Models:** Define Mongoose schemas  

- **Atomic Transactions:**  
  The booking service (`booking.service.js`) uses  
  `mongoose.startSession()` to ensure booking creation and availability checks  
  are executed atomically — preventing double-booking or race conditions.

---

## 🔧 **Getting Started (Local Setup)**

To run this project locally, you’ll need to set up both the **backend** and **frontend** servers.

### ✅ **Prerequisites**

- [Node.js](https://nodejs.org/) (v18.x or later)  
- [Git](https://git-scm.com/)  
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

---

### 🧩 **1. Backend Setup**

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install
```

#### Create a `.env` file in `backend/` and add:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://...

# Local backend server port
PORT=8000

# The URL your frontend runs on
CORS_ORIGIN=http://localhost:3000
```

#### Seed the database:
```bash
npm run seed
```

#### Start the backend server:
```bash
npm run dev
```

Your backend will be running at:  
👉 **http://localhost:8000**

---

### 💻 **2. Frontend Setup**

Open a new terminal (keep the backend running):

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

#### Create a `.env.local` file in `frontend/` and add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

#### Start the frontend:
```bash
npm run dev
```

Your frontend will be available at:  
👉 **http://localhost:3000**

---

## 📚 **API Endpoints**

All backend endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description |
|:------:|:----------|:-------------|
| **GET** | `/experiences` | Get a list of all experiences |
| **GET** | `/experiences/:id` | Get details and available slots for a specific experience |
| **POST** | `/promo/validate` | Validate a promo code against a price |
| **POST** | `/bookings` | Create a new booking |

---

### 🧠 **Pro Tip**
To make your README more engaging:
- Add GIFs or screenshots of booking flow  
- Include sample `.env` and response examples  
- Link to your API docs if hosted (like Postman / Swagger)
