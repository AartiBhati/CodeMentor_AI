# CodeMentor AI

A full-stack online coding practice platform where users can solve programming problems in an in-browser editor, get their code judged in real time, and receive AI-powered hints when they get stuck — inspired by platforms like LeetCode.

## Features

- **In-browser code editor** — Monaco Editor (the engine behind VS Code)
- **Real-time code execution & judging** — powered by the Judge0 API, with batch submission and evaluation against test cases
- **Submission rate limiting** — Redis-backed cooldown (10 seconds) between submissions to prevent spam/abuse
- **AI doubt-solving assistant** — a Gemini-powered chat assistant that gives contextual hints and debugging support for the problem you're working on
- **Secure authentication** — JWT (cookie-based) with bcrypt password hashing, plus role-based access control for admin vs. regular users
- **Problem management (admin)** — create, update, and delete problems, complete with reference solutions and test cases
- **Video editorials (admin)** — upload solution walkthrough videos via Cloudinary
- **Submission history** — track past submissions and view solved problems per user

### 🚧 Known Limitations / In Progress
- **Forgot Password / Reset Password** — frontend pages and backend routes exist as scaffolding but are **not yet functional** (routes are commented out, controller logic isn't implemented). Currently there is no self-serve password recovery flow.

## Tech Stack

**Frontend**
- React 19 + Vite
- Redux Toolkit (global state — auth, UI)
- React Router
- Tailwind CSS + DaisyUI
- React Hook Form + Zod (form validation)
- Monaco Editor
- Axios

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Redis (session handling + submission rate limiting)
- JWT + bcrypt (auth)
- Judge0 API (code execution & judging)
- Google Gemini API (AI doubt-solving assistant)
- Cloudinary (video storage)

## Project Structure

```
CodeMentor_AI/
├── Frontend/
│   └── src/
│       ├── pages/         # Homepage, Login, Signup, ProblemPage, Admin,
│       │                  # ForgotPassword*, ResetPassword* (*not yet functional)
│       ├── components/    # ChatAi, Editorial, SubmissionHistory,
│       │                  # AdminPanel, AdminUpload, AdminDelete, AdminVideo
│       ├── utils/          # axiosClient
│       ├── store.js
│       └── authSlice.js
└── Backend/
    └── src/
        ├── routes/         # userAuth, problemCreator, submit, aiChatting, videoCreator
        ├── controllers/    # userAuthenticate, userProblem, userSubmission, solveDoubt, videoSection
        ├── models/         # user, problem, submission, solutionVideo
        ├── middleware/     # userMiddleware, adminMiddleware, waitBeforSubmit (rate limiter)
        ├── config/         # db, redis
        └── index.js
```

## API Overview

| Route prefix | Description |
|---|---|
| `/user` | Register, login, logout, get/delete profile, admin registration, auth check |
| `/problem` | Create, update, delete, and fetch problems (admin + user access) |
| `/submission` | Submit and run code against test cases (rate-limited) |
| `/chat` | AI-powered doubt-solving chat |
| `/video` | Upload and manage solution videos (admin) |

20 active REST endpoints across these five route groups (forgot/reset password endpoints exist in code but are currently disabled — see Limitations above).

## Getting Started

### Prerequisites
- Node.js
- MongoDB instance (local or Atlas)
- Redis instance
- API keys: [Judge0](https://rapidapi.com/judge0-official/api/judge0-ce) (via RapidAPI), [Google Gemini](https://ai.google.dev/), [Cloudinary](https://cloudinary.com/)

### Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/` with:
```
PORT=
DB_CONNECT_STRING=
JWT_KEY=
REDIS_PASS=
JUDGE=
GEMINI_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run the server:
```bash
node src/index.js
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and talks to the backend at `http://localhost:4000` with credentials (cookies) enabled.

## How It Works

1. Users sign up / log in — auth handled via JWT stored in an HTTP-only cookie
2. Users browse problems and open one in the code editor
3. On "Run" or "Submit," code is sent to the backend, batched, and forwarded to Judge0 for execution against the problem's test cases (submissions are rate-limited to 1 every 10 seconds per user)
4. Results (pass/fail, output, errors) are returned and displayed to the user
5. If stuck, users can open the AI chat assistant for contextual hints without seeing the full solution
6. Admins can create/edit problems, upload reference/editorial videos, and manage the problem bank

## Roadmap

- [ ] Complete Forgot Password / Reset Password flow (email-based token verification)
- [ ] Add automated tests
- [ ] Deploy live demo

## License

This project was built for educational purposes as part of personal learning in full-stack development.
