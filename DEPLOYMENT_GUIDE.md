# 🚀 Deployment Guide - Step by Step

## ✅ What's Already Done

- ✅ PostgreSQL database created on Railway
- ✅ DATABASE_URL copied and saved
- ✅ Code updated for PostgreSQL
- ✅ Configuration files prepared

## 📋 Next Steps

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **"+"** button (top right) → **"New repository"**
3. Repository name: `cleaning-calculator` (or any name you like)
4. Description: "Cleaning service calculator"
5. Make it **Private** (or Public - your choice)
6. **DO NOT** check "Initialize with README" (we already have code)
7. Click **"Create repository"**

### Step 2: Upload Code to GitHub

**Option A: Using GitHub Desktop (Easiest)**

1. Download [GitHub Desktop](https://desktop.github.com)
2. Install and sign in with your GitHub account
3. Click **"File"** → **"Add Local Repository"**
4. Navigate to: `/Users/iharkazlou/Library/Mobile Documents/com~apple~CloudDocs/Cursor Projects/sales-trainer`
5. Click **"Add Repository"**
6. Click **"Publish repository"** (top right)
7. Choose your repository name
8. Click **"Publish Repository"**

**Option B: Using Terminal (If you're comfortable)**

```bash
cd "/Users/iharkazlou/Library/Mobile Documents/com~apple~CloudDocs/Cursor Projects/sales-trainer"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Cleaning calculator"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cleaning-calculator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New"** → **"GitHub Repo"**
3. Select your repository (`cleaning-calculator`)
4. Railway will detect it's a Node.js project
5. Click on the service that was created
6. Go to **"Variables"** tab
7. Add these environment variables:
   - `DATABASE_URL` = (paste your PostgreSQL URL from Railway)
   - `PORT` = `4000` (optional, Railway sets this automatically)
8. Go to **"Settings"** tab
9. Set **Root Directory** to:** `server`
10. Railway will automatically:
   - Install dependencies
   - Run `npm run build`
   - Run `npm start`
11. Wait for deployment (2-5 minutes)
12. Copy the **Public URL** (something like `https://your-app.railway.app`)

### Step 4: Run Database Migrations

After backend is deployed:

1. In Railway, go to your backend service
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Click **"View Logs"**
5. You should see the server running

**To run migrations manually (if needed):**

1. In Railway, go to your backend service
2. Click **"Settings"** → **"Deploy"**
3. Add a one-time command: `npx prisma migrate deploy`
4. Or use Railway CLI (advanced)

**Alternative: Run migrations locally first**

```bash
cd server
# Set DATABASE_URL to your Railway PostgreSQL URL
export DATABASE_URL="your-railway-postgres-url"
npx prisma migrate deploy
```

### Step 5: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variable:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Railway backend URL (e.g., `https://your-app.railway.app`)
7. Click **"Deploy"**
8. Wait for deployment (2-3 minutes)
9. Copy your Vercel URL (something like `https://your-app.vercel.app`)

### Step 6: Update Frontend API URL

After Vercel deployment, you need to update the frontend to use the Railway backend:

1. The frontend is already configured to use `/api` which will proxy to the backend
2. But for production, we need to update `vite.config.ts` or use environment variable

**Update `web/vite.config.ts`:**

The proxy in `vite.config.ts` only works in development. For production, you need to either:
- Use environment variable `VITE_API_URL`
- Or update the API calls to use the full Railway URL

**I'll help you update this after Vercel deployment.**

### Step 7: Connect Domain (Optional)

1. Buy a domain from Namecheap, GoDaddy, or Google Domains
2. In Vercel: **Settings** → **Domains** → **Add Domain**
3. Enter your domain
4. Vercel will show DNS records to add
5. Go to your domain registrar
6. Add the DNS records Vercel provided
7. Wait 24-48 hours for DNS propagation

## 🔍 Troubleshooting

### Backend not connecting to database?
- Check `DATABASE_URL` in Railway Variables
- Make sure it's the PostgreSQL URL (not SQLite)
- Check Railway logs for errors

### Frontend can't reach backend?
- Check `VITE_API_URL` in Vercel
- Make sure Railway backend is running
- Check CORS settings in backend

### Database migrations not running?
- Run `npx prisma migrate deploy` manually
- Check Prisma logs in Railway

## 📝 Important URLs to Save

After deployment, save these URLs:

- **Railway Backend:** `https://your-app.railway.app`
- **Vercel Frontend:** `https://your-app.vercel.app`
- **Database URL:** (keep it secret!)

## 🎉 You're Done!

Your app should now be live on the internet!

