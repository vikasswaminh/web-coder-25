# Web Coder 25

AI-powered code editor and project management platform.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/web-coder-25)

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand + Immer
- **Build Output:** Static (Vercel-ready)

## 📦 Project Structure

```
web-coder-25/
├── src/
│   ├── api/          # API client & endpoints
│   ├── components/   # UI components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Route pages
│   ├── stores/       # Zustand state stores
│   ├── types/        # TypeScript types
│   └── styles/       # Global CSS
├── .github/          # CI/CD workflows
├── public/           # Static assets
└── vercel.json       # Vercel configuration
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/web-coder-25.git
cd web-coder-25

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://your-backend-api.com
```

## 🚢 Deployment

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option 2: GitHub + Vercel Integration

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/web-coder-25.git
git push -u origin main
```

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Framework Preset: Vite
   - Add environment variable: `VITE_API_URL`
   - Deploy!

### Option 3: GitHub Actions (CI/CD)

Already configured in `.github/workflows/deploy.yml`

Add these secrets to your GitHub repository:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VITE_API_URL`

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run typecheck` | Run TypeScript checks |

## 🔐 Security Headers

Configured in `vercel.json`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 📄 License

MIT
