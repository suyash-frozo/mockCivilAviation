# Vercel Deployment Guide

## ✅ Why Vercel for Next.js?

Vercel is the **best choice** for Next.js applications because:
- **Native Next.js support** - Built by the same team
- **Zero-config deployment** - Works out of the box
- **Automatic API routes** - No configuration needed
- **Edge Functions** - Fast global performance
- **Built-in database options** - Vercel Postgres available
- **Free tier** - Generous free tier for personal projects

## ⚠️ Important: Database Migration Required

**SQLite will NOT work on Vercel** because Vercel uses serverless functions that are stateless. You need to migrate to a cloud database.

### Recommended Database Options:

1. **Vercel Postgres** (Recommended) - Native integration, free tier
2. **Supabase** - PostgreSQL, free tier, easy setup
3. **PlanetScale** - Serverless MySQL, free tier
4. **Neon** - Serverless Postgres, free tier

## Step 1: Set Up Cloud Database

### Option A: Vercel Postgres (Easiest - Recommended)

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Create a new Postgres database
4. Copy the connection string (it will be automatically added as `POSTGRES_URL`)
5. Update your `.env` file:
   ```
   DATABASE_URL="postgresql://..."
   ```
6. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
7. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Option B: Supabase (Alternative)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Get your database connection string
4. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
5. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

## Step 2: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time - will set up project)
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration (Easiest)

1. Go to https://vercel.com
2. Sign up/Login with your GitHub account
3. Click "Add New Project"
4. Import your `mockCivilAviation` repository
5. Vercel will auto-detect Next.js settings
6. Configure environment variables:
   - `DATABASE_URL` - Your database connection string
   - `NEXT_PUBLIC_ADMIN_PASSWORD` - Admin console password (optional)
7. Click "Deploy"

**That's it!** Vercel will:
- Automatically build your Next.js app
- Deploy API routes as serverless functions
- Set up automatic deployments on every git push
- Provide a production URL

### Method 3: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import from GitHub
4. Select your repository
5. Configure and deploy

## Step 3: Environment Variables

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add:
   - `DATABASE_URL` - Your database connection string
   - `NEXT_PUBLIC_ADMIN_PASSWORD` - Admin password (optional)

**Important**: After adding environment variables, redeploy your project.

## Step 4: Database Migration

After deployment, run migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Or use Vercel's built-in migration support
# Add to package.json:
"scripts": {
  "postdeploy": "prisma migrate deploy"
}
```

## Step 5: Initialize Database

1. Visit your deployed site: `https://your-app.vercel.app`
2. Go to `/admin` page
3. Sections will be auto-initialized on first API call
4. Or manually trigger: `https://your-app.vercel.app/api/sections`

## Vercel-Specific Features

### Automatic Deployments
- Every push to `main` branch = automatic production deployment
- Pull requests = preview deployments
- No configuration needed!

### Edge Functions
Your API routes automatically run on Vercel's Edge Network for fast global performance.

### Analytics
Vercel provides built-in analytics for your deployments.

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure Node.js version is compatible (Vercel auto-detects)
- Verify all dependencies are in `package.json`

### Database Connection Errors
- Verify `DATABASE_URL` is set in Vercel environment variables
- Check database allows connections from Vercel's IPs
- Ensure database credentials are correct
- For Vercel Postgres, connection is automatic

### API Routes Not Working
- Vercel handles Next.js API routes automatically
- No additional configuration needed
- Check function logs in Vercel dashboard

### Prisma Issues
- Ensure `prisma generate` runs in build (already in `postinstall`)
- Check Prisma client is generated correctly
- Verify database schema matches migrations

## Quick Deploy Checklist

- [ ] Set up cloud database (Vercel Postgres/Supabase)
- [ ] Update `prisma/schema.prisma` with `postgresql` provider
- [ ] Run `npx prisma migrate dev` locally
- [ ] Test database connection locally
- [ ] Push changes to GitHub
- [ ] Connect repository to Vercel
- [ ] Add environment variables in Vercel
- [ ] Deploy and test
- [ ] Run database migrations on production

## Migration from SQLite to PostgreSQL

If you have existing data in SQLite:

1. Export data from SQLite:
   ```bash
   # Create a migration script to export data
   ```

2. Update schema to PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev --name migrate_to_postgres
   ```

4. Import data (if needed):
   - Use Prisma Studio or custom scripts
   - Or manually add through admin console

## Cost

**Vercel Free Tier Includes:**
- Unlimited personal projects
- 100GB bandwidth/month
- Serverless function execution
- Automatic HTTPS
- Custom domains

**Database Costs:**
- Vercel Postgres: Free tier available
- Supabase: Free tier (500MB database)
- PlanetScale: Free tier available
- Neon: Free tier available

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/concepts/next.js
- Vercel Community: https://github.com/vercel/vercel/discussions

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure environment variables
3. Run database migrations
4. Test all features
5. Set up monitoring/analytics
6. Configure admin password

