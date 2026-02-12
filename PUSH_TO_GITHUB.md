# 🚀 Push to GitHub & Deploy to Vercel

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `web-coder-25`
3. Description: "AI-powered code editor and project management"
4. Make it **Public** (for free Vercel deployments)
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Push Local Code to GitHub

Open PowerShell in the project folder and run:

```powershell
cd C:\Users\test\web-coder-25

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Vercel-ready React + Vite frontend"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/web-coder-25.git

# Push to main
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Vercel CLI (Fastest)

```powershell
# Install Vercel CLI globally
npm i -g vercel

# Login (opens browser)
vercel login

# Deploy
vercel --prod
```

When prompted:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name: **web-coder-25**
- Directory: **./** (current)

### Option B: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import Git Repository
3. Select `web-coder-25`
4. Configure:
   - Framework Preset: **Vite**
   - Root Directory: **./**
   - Build Command: **npm run build**
   - Output Directory: **dist**
5. Environment Variables:
   - `VITE_API_URL` = your backend URL
6. Click **Deploy**

## Step 4: Add Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-api.com`
3. Click Save
4. Redeploy: Go to Deployments → Click "Redeploy"

## Step 5: Configure Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## 📁 Repository Structure (After Push)

```
web-coder-25/
├── .github/workflows/     # CI/CD
├── public/               # Static assets
├── src/                  # Source code
│   ├── api/             # API layer
│   ├── components/      # UI components
│   ├── hooks/           # React hooks
│   ├── pages/           # Route pages
│   ├── stores/          # Zustand stores
│   ├── styles/          # CSS
│   └── types/           # TypeScript types
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json          # Vercel config
```

## 🔧 GitHub Secrets (For CI/CD)

If using GitHub Actions deployment, add these secrets:

1. Go to GitHub → Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add:
   - `VERCEL_TOKEN` - From vercel.com/account/tokens
   - `VERCEL_ORG_ID` - From project settings
   - `VERCEL_PROJECT_ID` - From project settings
   - `VITE_API_URL` - Your backend URL

## ✅ Verification Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build successful (green checkmark)
- [ ] Site accessible at `https://web-coder-25.vercel.app`

## 🆘 Troubleshooting

### "git is not recognized"
Download Git from [git-scm.com](https://git-scm.com/download/win)

### "fatal: not a git repository"
Run `git init` first

### Build fails on Vercel
Check that `vercel.json` exists and `dist` folder is created in build

### "Module not found" errors
Make sure all dependencies are in package.json

## 📞 Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vite Docs: [vitejs.dev](https://vitejs.dev)
- React Docs: [react.dev](https://react.dev)
