# ✨ AuraTravel — Agentic Travel & Expense Copilot

AuraTravel is a premium, feature-rich web application designed to act as an agentic travel assistant and budget tracker. It enables users to explore and plan smart day-by-day itineraries, track travel expenses with automated AI-driven receipt OCR parsing, and chat with a context-aware AI travel copilot that knows their exact trip plans and expenditures.

---

## 🌟 Key Features

### 🗺️ Smart Itinerary Management
- **Explore Hub:** Browse, search, and filter curated itineraries based on travel styles (e.g., Adventure, Cultural, Wellness, Food).
- **Interactive Day-by-Day Planners:** View details for every trip including duration, total estimated cost, custom tags, and complete lists of scheduled daily activities.
- **Creator Dashboard:** An onboarding and profile panel to manage created/saved itineraries, customize traveler profiles, and set default travel styles.

### 🧾 AI-Powered Expense Tracking
- **Multi-Category Logs:** Log and categorize expenses under Accommodation, Transport, Dining, Activities, Shopping, and Misc.
- **Gemini Receipt OCR Scanner:** Upload a receipt, ticket, invoice, or booking document (image, PDF, or text) to automatically parse the title, merchant, amount, category, date, and location into structured JSON.
- **Visual Budget Analytics:** Visual summary cards tracking total budget spent and category breakdowns.

### 💬 Context-Aware AI Travel Copilot
- **Live Assistant Sidebar:** A globally accessible chat drawer to interact with your personal AI travel agent.
- **Injected Contextual Intelligence:** Instead of generic conversations, the backend dynamically fetches the logged-in user's active travel itineraries and logged expenses and feeds them as system context to Google Gemini.
- **Actionable Queries:** Ask questions like *"Can you summarize my dining expenses in Kyoto?"* or *"What is my plan for Day 2 in my Japan trip?"* and receive personalized, structured answers.

### 🔒 Secured Authentication & Profiles
- **Multi-Method Auth:** Powered by Better Auth supporting standard Email/Password credentials and Google OAuth social sign-in.
- **Extended User Metadata:** Collects traveler profiles, including travel style, home location, bio, years of travel experience, and portfolio URLs.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Capabilities |
|---|---|---|
| **Frontend** | **Next.js 16 (App Router)** | React Server Components, fast Turbopack compilation, dynamic routes |
| **Styling** | **Tailwind CSS & shadcn/ui** | Clean aesthetics, premium dark-mode, responsive layouts, animated elements |
| **Icons** | **Lucide React** | Beautiful modern UI icons |
| **Client Auth** | **Better Auth Client** | State-managed sessions, secure cookie transmission, Google Social provider |
| **Backend** | **Node.js & Express** | RESTful routing, payload parsers, CORS handling, error boundaries |
| **Database** | **MongoDB & Mongoose** | NoSQL document stores for users, itineraries, expenses, and bookings |
| **AI Engine** | **Google Generative AI SDK** | Multimodal `gemini-3.5-flash` model for chat context and receipt OCR |
| **Deployment** | **Vercel** | Automated CI/CD workflows and serverless hosting |

---

## 📂 Project Structure

```
AuraTravel/
├── frontend/                  # Next.js Web App
│   ├── .github/workflows/    # CI/CD configs (GitHub Actions)
│   ├── src/
│   │   ├── app/              # Next.js App Router (Layouts & Pages)
│   │   │   ├── about/        # About page
│   │   │   ├── blog/         # Travel blogs
│   │   │   ├── contact/      # Contact forms
│   │   │   ├── expenses/     # Receipt scanner & Expense manager
│   │   │   ├── itineraries/  # Core travel hub & builders
│   │   │   │   ├── [id]/     # Dynamic day-by-day planner page
│   │   │   │   ├── add/      # Add new itineraries
│   │   │   │   └── manage/   # Traveler dashboard
│   │   │   ├── login/        # Sign-in page
│   │   │   ├── register/     # Registration/Sign-up page
│   │   │   ├── globals.css   # Main styles, fonts, tailwind variables
│   │   │   └── layout.tsx    # Root layout & global provider wrap
│   │   ├── components/       # Custom React Components
│   │   │   ├── ui/           # shadcn/ui design primitives
│   │   │   ├── AIChatDrawer  # Global AI Copilot sidebar
│   │   │   ├── Navbar        # Main navigation header
│   │   │   └── Footer        # Global footer
│   │   └── lib/              # Client utilities
│   │       └── auth-client   # Better Auth client config
│   ├── package.json
│   └── tsconfig.json
│
└── backend/                   # Node/Express API Server
    ├── src/
    │   ├── app.ts            # Server entry point
    │   ├── config/           # DB & Auth integrations
    │   │   ├── db.ts         # Mongoose connection
    │   │   └── auth.ts       # Better Auth Node adapter & schemas
    │   ├── middleware/       # Authentication guards
    │   ├── models/           # Mongoose schemas (Itinerary, Expense, User, Booking)
    │   ├── routes/           # REST endpoints
    │   │   ├── ai.ts         # Gemini Copilot routes
    │   │   ├── itineraries.ts# Itinerary endpoints
    │   │   └── expenses.ts   # Expense & OCR endpoints
    │   └── services/         # Core business logic
    │       └── ai.ts         # Gemini API handler (OCR & Chat prompts)
    ├── package.json
    └── tsconfig.json
```

---

## 🧠 Behind the Scenes: How the AI Works

### 1. The Context-Aware Chat Pipeline
When you ask a question to the **AuraTravel Copilot**:
```mermaid
graph TD
    User([User asks: 'How much did I spend in Kyoto?']) --> ChatDrawer[AIChatDrawer UI]
    ChatDrawer --> API[/api/ai/chat]
    API --> DB[(MongoDB Query)]
    DB --> Context[Retrieve user's saved itineraries & expenses]
    Context --> Formatter[Format context as structured markdown text]
    Formatter --> Gemini[Gemini 3.5 Flash Model]
    Gemini --> SystemPrompt[Construct System Instructions with active context]
    SystemPrompt --> Response[Return tailored, exact travel/budget answer]
    Response --> User
```

### 2. Smart Receipt OCR Scanner
When you drop an image of a receipt:
1. The file buffer is read as a Base64 string and sent to the `/api/expenses/upload` (or `/api/expenses/parse`) endpoint.
2. If `GEMINI_API_KEY` is active:
   - We construct a multimodal request containing the receipt file and a structured JSON schema instruction prompt.
   - `gemini-3.5-flash` analyzes the document and responds with **pure structured JSON** containing the merchant, amount, category, transaction date, and location.
3. If no API key is set, the server runs in **Simulation Mode**, mock-generating a high-fidelity parsed transaction matching your file name (e.g. detecting "hotel" or "uber" and building matching datasets) so you can test features without configuration overhead.

---

## 🚀 Local Installation & Setup

### Prerequisites
- **Node.js** (v20+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas Connection string)
- **Google Cloud Console Credentials** (For Google Social Login - Optional)
- **Gemini API Key** (From Google AI Studio - Optional)

### 1. Clone and Navigate
```bash
git clone https://github.com/KAprachir/AuraTravel-Client.git
cd AuraTravel
```

### 2. Configure the Backend
Navigate to the `backend/` folder and create a `.env` file:
```bash
cd backend
touch .env
```
Add the following configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_uri
BETTER_AUTH_SECRET=your_auth_random_secret_string
BETTER_AUTH_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# Google Social Login
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Engine Key
GEMINI_API_KEY=your_google_gemini_api_key
```
Install dependencies and run in development mode:
```bash
npm install
npm run dev
```

### 3. Configure the Frontend
Navigate to the `frontend/` folder and create a `.env` file:
```bash
cd ../frontend
touch .env
```
Add the following configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:5000
```
Install dependencies and run in development mode:
```bash
npm install
npm run dev
```

The frontend will start on **[http://localhost:3000](http://localhost:3000)** and communicate with the backend running on **[http://localhost:5000](http://localhost:5000)**.
