# Deploying Sequelize PostgreSQL App to Vercel

This guide will help you deploy your Sequelize PostgreSQL application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up PostgreSQL Database

You have two options for PostgreSQL on Vercel:

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Click **Create Database** → Select **Postgres**
4. Choose a name for your database
5. Vercel will automatically create a `POSTGRES_URL` environment variable

### Option B: External PostgreSQL Database

You can use external services like:
- **Neon** (https://neon.tech) - Serverless Postgres
- **Supabase** (https://supabase.com) - Open source Firebase alternative
- **Railway** (https://railway.app) - Simple deployment platform
- **Render** (https://render.com) - Cloud platform

For external databases, you'll need to:
1. Create a PostgreSQL database on your chosen platform
2. Get the connection string (usually in format: `postgresql://user:password@host:port/database`)
3. Add it as `POSTGRES_URL` or `DATABASE_URL` in Vercel environment variables

## Step 2: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### If using Vercel Postgres:
- `POSTGRES_URL` - Automatically set by Vercel (you don't need to add this manually)

### If using external database:
- `POSTGRES_URL` or `DATABASE_URL` - Your PostgreSQL connection string
- `NODE_ENV` - Set to `production`

### Optional (for local development):
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 5432)
- `DB_DIALECT` - Set to `postgres`

## Step 3: Deploy to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Method 2: Using GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel will automatically detect your Node.js project
5. Click **Deploy**

## Step 4: Run Database Migrations

After deployment, you need to run your Sequelize migrations. You have several options:

### Option A: Using Vercel Build Command (Recommended)

1. Update your `package.json` to include a build script that runs migrations:
   ```json
   {
     "scripts": {
       "build": "npx sequelize db:migrate && echo 'Migrations completed'",
       "start": "node server.js"
     }
   }
   ```

2. Vercel will automatically run the build command before deployment

### Option B: Using Vercel CLI (One-time)

After deployment, run migrations using Vercel CLI:

```bash
vercel env pull .env.local
npx sequelize db:migrate --env production
```

### Option C: Using Vercel Functions (API Endpoint)

Create an API endpoint to run migrations (for admin use only):

```javascript
// api/migrate.js
import { sequelize } from '../src/models/index.js';

export default async function handler(req, res) {
  // Add authentication/authorization here
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false }); // or use migrations
    res.status(200).json({ message: 'Migrations completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Step 5: Verify Deployment

1. Check your deployment logs in Vercel dashboard
2. Test your API endpoints
3. Verify database connection in your application logs

## Troubleshooting

### Connection Issues

- **SSL Required**: Vercel Postgres requires SSL connections. The config is already set up for this.
- **Connection String Format**: Make sure your `POSTGRES_URL` is in the format: `postgresql://user:password@host:port/database`
- **Environment Variables**: Ensure all environment variables are set in Vercel dashboard

### Migration Issues

- **Build Timeout**: If migrations take too long, consider running them via API endpoint instead
- **Migration Files**: Ensure all migration files are committed to your repository
- **Sequelize CLI**: Make sure `sequelize-cli` is in your dependencies

### Common Errors

1. **"Cannot find module 'pg'"**: Make sure `pg` is in your `package.json` dependencies
2. **"Connection refused"**: Check your database connection string and network settings
3. **"SSL required"**: Ensure `dialectOptions.ssl` is configured (already done in config.js)

## Additional Notes

- Vercel serverless functions have a 10-second timeout for Hobby plan, 60 seconds for Pro
- For long-running operations, consider using background jobs or separate services
- Database connections are pooled automatically by Sequelize
- Make sure to set `NODE_ENV=production` in Vercel environment variables

## Support

For more information:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)

