# Git Deployment Guide for Vercel

## 🎯 Overview

This guide will help you deploy your Node.js Express API to Vercel using Git (GitHub/GitLab/Bitbucket). This is the **simplest and recommended** method.

---

## 📋 Prerequisites

1. **Git Repository**: Your code should be on GitHub, GitLab, or Bitbucket
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free)
3. **Production Database**: Database accessible from the internet

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Git Repository

#### 1.1 Initialize Git (if not already done)
```bash
git init
```

#### 1.2 Create .gitignore (if not exists)
Make sure `.gitignore` includes:
```
node_modules/
.env
.env.local
*.log
.DS_Store
.vercel
```

#### 1.3 Commit Your Code
```bash
git add .
git commit -m "Ready for Vercel deployment"
```

#### 1.4 Push to GitHub/GitLab/Bitbucket
```bash
# If using GitHub
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

---

### Step 2: Run Database Migrations

**⚠️ IMPORTANT**: Run migrations on your production database BEFORE deploying.

```bash
# Set production database credentials
export NODE_ENV=production
export DB_USERNAME=your_production_db_username
export DB_PASSWORD=your_production_db_password
export DB_NAME=your_production_database_name
export DB_HOST=your_production_db_host
export DB_DIALECT=postgres
export JWT_SECRET=your_secure_jwt_secret_key

# Run migrations
npx sequelize db:migrate
```

**OR** run migrations directly on your production database server.

---

### Step 3: Connect Repository to Vercel

#### 3.1 Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign up or log in (use GitHub account for easier setup)

#### 3.2 Import Project
1. Click **"Add New Project"** or **"Import Project"**
2. You'll see a list of your Git repositories
3. Select your repository
4. Click **"Import"**

#### 3.3 Configure Project
Vercel will auto-detect your project settings:

- **Framework Preset**: Node.js (auto-detected)
- **Root Directory**: `./` (leave as is)
- **Build Command**: Leave empty (Vercel handles it)
- **Output Directory**: Leave empty
- **Install Command**: `npm install` (auto-detected)

Click **"Deploy"** (we'll add environment variables next)

---

### Step 4: Set Environment Variables

#### 4.1 Go to Project Settings
1. After first deployment, go to your project
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the sidebar

#### 4.2 Add Required Variables
Add each variable one by one:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `DB_USERNAME` | Your production DB username | Production, Preview, Development |
| `DB_PASSWORD` | Your production DB password | Production, Preview, Development |
| `DB_NAME` | Your production database name | Production, Preview, Development |
| `DB_HOST` | Your production DB host | Production, Preview, Development |
| `DB_DIALECT` | `postgres` | Production, Preview, Development |
| `JWT_SECRET` | Your secure JWT secret | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |

**Optional** (if your database requires SSL):
- `DB_SSL` = `true` (if needed)

#### 4.3 Redeploy
After adding environment variables:
1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. This will redeploy with the new environment variables

---

### Step 5: Verify Deployment

#### 5.1 Check Deployment Status
- Go to **"Deployments"** tab
- Wait for deployment to complete (green checkmark)

#### 5.2 Test Health Endpoint
```http
GET https://your-project.vercel.app/health
```

Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 5.3 Test Login Endpoint
```http
POST https://your-project.vercel.app/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 🔄 Automatic Deployments

### How It Works

- **Push to `main` branch** → Production deployment
- **Push to any other branch** → Preview deployment
- **Create Pull Request** → Preview deployment

### Example Workflow

```bash
# Make changes
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Vercel automatically creates a preview deployment!
# You'll get a preview URL like: https://your-project-git-feature-new-feature.vercel.app
```

---

## 📝 Project Structure

Your project should have this structure:

```
your-project/
├── api/
│   └── index.js          ← Serverless entry point (REQUIRED)
├── src/                  ← Your application code
├── vercel.json          ← Vercel configuration (REQUIRED)
├── package.json
└── .gitignore
```

---

## 🔧 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel handles SSL automatically

---

## 🐛 Troubleshooting

### Database Connection Errors

**Problem**: Can't connect to database

**Solutions**:
1. Verify database is accessible from internet (not localhost)
2. Check firewall allows Vercel IPs
3. Verify environment variables are set correctly
4. Check database credentials

### Build Errors

**Problem**: Deployment fails during build

**Solutions**:
1. Check Vercel build logs
2. Ensure all dependencies are in `package.json`
3. Check for syntax errors
4. Verify Node.js version compatibility

### Function Timeout

**Problem**: Requests timeout

**Solutions**:
- Default timeout: 10 seconds (Hobby plan)
- Configured: 30 seconds (in vercel.json)
- For longer operations, upgrade to Pro plan (60 seconds)

---

## 📊 Monitoring

### View Logs
1. Go to **Deployments** tab
2. Click on a deployment
3. Click **"Functions"** tab
4. View real-time logs

### View Analytics
- Go to **Analytics** tab
- See request counts, response times, errors

---

## 🔄 Updating Your Deployment

### Automatic (Recommended)
Just push to Git:
```bash
git add .
git commit -m "Update API"
git push origin main
```
Vercel automatically deploys!

### Manual Redeploy
1. Go to **Deployments** tab
2. Click **"..."** on any deployment
3. Click **"Redeploy"**

---

## ✅ Deployment Checklist

- [ ] Code pushed to Git repository
- [ ] Database migrations run on production
- [ ] Project imported in Vercel
- [ ] Environment variables set in Vercel
- [ ] First deployment successful
- [ ] Health endpoint working
- [ ] Login endpoint tested
- [ ] All API endpoints tested

---

## 🎉 You're Done!

Your API is now live on Vercel! Every time you push to Git, Vercel will automatically deploy your changes.

**Production URL**: `https://your-project.vercel.app`

---

## 📚 Additional Resources

- Vercel Docs: https://vercel.com/docs
- Vercel Dashboard: https://vercel.com/dashboard
- Support: https://vercel.com/support

