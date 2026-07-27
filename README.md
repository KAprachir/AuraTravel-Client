# ✨ AuraTravel — Agentic Travel & Expense Copilot

**Live Demo (Frontend):** [https://frontend-rho-nine-40.vercel.app](https://frontend-rho-nine-40.vercel.app)  
**API Endpoint (Backend):** [https://backend-six-lyart-91.vercel.app](https://backend-six-lyart-91.vercel.app)

AuraTravel is a full-stack, agentic travel platform featuring role-based dashboards, AI-driven expense OCR parsing, context-aware AI travel copilot, curated planner itineraries, and comprehensive light/dark theme switching.

---

## 🌟 Key Features

### 🔐 Strict Role-Based Access Control (RBAC)
- **🧳 Traveler Mode:**
  - Browse, search, and filter public itineraries.
  - Book trips, select dates & travelers, process checkout.
  - Personal **Traveler Dashboard** (`/itineraries/manage`) to track active bookings, manage payment receipts, and request booking cancellations.
  - Log personal travel expenses with AI OCR receipt parsing.
  - *Restricted:* Cannot create public itineraries or access selling/admin portals.
- **🗺️ Planner / Seller Mode:**
  - Dedicated **Seller Dashboard** (`/planner`) with sales analytics and revenue tracking.
  - Create, edit, and delete published itineraries (`/itineraries/add`).
  - Manage itinerary booking inquiries and cancellation requests.
  - Display lead planner badges, bio, experience, and portfolio links on all created itineraries.
- **👑 Admin Control Center:**
  - Dedicated **Admin Dashboard** (`/admin`) for complete platform oversight.
  - View all user bookings platform-wide with status management controls.
  - Review and approve/reject pending planner account applications and pending itineraries.
  - User Role Manager to assign or update roles (`traveler`, `planner`, `admin`).

---

### 🎨 Universal Light & Dark Mode Theme Switching
- Global theme state persistence via `localStorage`.
- Smooth color transitions across all 12 page routes and UI components (Navbar, Footer, Dashboards, Modals, Forms, Tables).
- Toggle theme seamlessly via the sun/moon icon in the header navigation.

---

### 👨‍✈️ 3 Verified Lead Planners & 30 Curated Itineraries
- **Elena Rostova** (Alpine & Wilderness Expeditions Specialist — 8 yrs exp)
- **Kenji Takahashi** (Asian Heritage & Culinary Specialist — 12 yrs exp)
- **Sophia Martinez** (Luxury Coastal & Wellness Designer — 6 yrs exp)
- Each planner offers 10 specialized, day-by-day itineraries with complete activity schedules, pricing, ratings, and creator profile badges.

---

### 🧾 AI-Powered Expense Tracking & OCR Scanner
- Upload receipt images or invoices (JPEG, PNG, WebP) to parse transaction merchant, total cost, category, date, and location into structured JSON using **Google Gemini AI**.
- Visual expense analytics charts (Recharts) and category breakdowns.

---

### 💬 Context-Aware AI Travel Copilot
- Globally accessible chat drawer (`AIChatDrawer`).
- Backend dynamically injects the user's active bookings, itineraries, and logged expense summaries into Google Gemini system prompts for real-time personalized travel advice.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Capabilities |
|---|---|---|
| **Frontend** | **Next.js 16 (App Router)** | React Server Components, fast Turbopack/Webpack compilation, dynamic routes |
| **Styling** | **Tailwind CSS & shadcn/ui** | Light/dark mode themes, modern typography, responsive cards & tables |
| **Icons** | **Lucide React** | Modern icons for travel, navigation, and roles |
| **Client Auth** | **Better Auth Client** | Session management, secure cookies, Google OAuth social sign-in |
| **Backend** | **Node.js & Express** | RESTful endpoints, RBAC middleware, CORS handling, error boundaries |
| **Database** | **MongoDB & Mongoose** | Collections for users, itineraries, expenses, and bookings |
| **AI Engine** | **Google Generative AI SDK** | Gemini 3.5 Flash for chat context and multimodal receipt OCR |
| **Deployment** | **Vercel** | Automated CI/CD workflows and production hosting |

---

## 📂 Project Structure

```
AuraTravel/
├── frontend/                  # Next.js Web App
│   ├── src/
│   │   ├── app/              # App Router Pages
│   │   │   ├── about/        # About page
│   │   │   ├── admin/        # Admin Control Center (RBAC Admin)
│   │   │   ├── blog/         # Travel articles
│   │   │   ├── contact/      # Contact form
│   │   │   ├── expenses/     # AI Expense Tracker & OCR Scanner
│   │   │   ├── help/         # Help Center & FAQs
│   │   │   ├── itineraries/  # Explore directory & Detail pages
│   │   │   │   ├── [id]/     # Dynamic itinerary detail & checkout page
│   │   │   │   ├── add/      # Add itinerary page (Planner/Admin)
│   │   │   │   └── manage/   # Traveler Dashboard (Bookings & Cancellations)
│   │   │   ├── login/        # Sign-in with Demo options & Google OAuth
│   │   │   ├── onboarding/   # Profile setup & Role selection
│   │   │   ├── planner/      # Seller Dashboard (RBAC Planner)
│   │   │   └── register/     # User registration
│   │   ├── components/       # Custom React Components (Navbar, Footer, AIChatDrawer)
│   │   └── lib/              # Client API & Better Auth helpers
│   ├── package.json
│   └── tsconfig.json
│
└── backend/                   # Node/Express API Server
    ├── src/
    │   ├── config/           # DB & Auth setup
    │   ├── middleware/       # requireAuth & requireRole middleware
    │   ├── models/           # Mongoose Schemas (Itinerary, Booking, Expense)
    │   ├── routes/           # REST Endpoints (itineraries, bookings, users, expenses, ai)
    │   └── scripts/          # Database seeding scripts (3 Planners & 30 Itineraries)
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Local Installation & Setup

### Prerequisites
- **Node.js** (v20+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas Connection string)
- **Gemini API Key** (Google AI Studio - Optional)

### 1. Clone and Install Backend
```bash
git clone https://github.com/KAprachir/AuraTravel-Client.git
cd AuraTravel/backend
npm install
```
Configure `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_uri
BETTER_AUTH_SECRET=your_auth_random_secret_string
BETTER_AUTH_URL=http://localhost:5000
GEMINI_API_KEY=your_gemini_api_key
```

Seed the Database with 3 Planners & 30 Itineraries:
```bash
npx tsx src/scripts/seed.ts
```

Start the Backend Server:
```bash
npm run dev
```

### 2. Configure and Install Frontend
In a new terminal:
```bash
cd AuraTravel/frontend
npm install
```
Configure `frontend/.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:5000
```

Start the Frontend Server:
```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.
