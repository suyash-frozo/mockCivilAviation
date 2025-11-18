# Netlify Deployment Guide

## ⚠️ Important: Database Migration Required

**SQLite will NOT work on Netlify** because Netlify uses serverless functions that are stateless. You need to migrate to a cloud database.

### Recommended Database Options:

1. **Supabase (PostgreSQL)** - Free tier available, easy setup
2. **PlanetScale (MySQL)** - Serverless MySQL, free tier
3. **Neon (PostgreSQL)** - Serverless Postgres, free tier
4. **Railway (PostgreSQL)** - Easy deployment, free tier

## Step 1: Choose and Set Up Cloud Database

### Option A: Supabase (Recommended)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Get your database connection string (looks like: `postgresql://...`)
4. Update your `.env` file:
   ```
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   ```
5. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Option B: PlanetScale

1. Go to https://planetscale.com and create a free account
2. Create a new database
3. Get your connection string
4. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```
5. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

## Step 2: Update Environment Variables

1. In your Netlify dashboard, go to Site settings → Environment variables
2. Add:
   - `DATABASE_URL` - Your cloud database connection string
   - `NEXT_PUBLIC_ADMIN_PASSWORD` - Admin console password (optional)

## Step 3: Deploy to Netlify

### Method 1: Netlify CLI (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### Method 2: GitHub Integration

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select the `mockCivilAviation` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `22.17.1`
6. Add environment variables (from Step 2)
7. Click "Deploy site"

### Method 3: Drag & Drop

```bash
# Build the project
npm run build

# The build output will be in .next directory
# Then drag the entire project folder to Netlify Drop
```

## Step 4: Post-Deployment

1. **Run database migrations** (if using Supabase/PostgreSQL):
   ```bash
   npx prisma migrate deploy
   ```
   Or set up a build hook to run this automatically.

2. **Initialize sections** in your database:
   - Visit your deployed site's `/admin` page
   - The sections will be auto-initialized on first API call

## Troubleshooting

### Build Fails
- Check Node version matches (22.17.1)
- Ensure all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### Database Connection Errors
- Verify `DATABASE_URL` is set correctly in Netlify environment variables
- Ensure your database allows connections from Netlify's IPs
- Check database credentials are correct

### API Routes Not Working
- Ensure `@netlify/plugin-nextjs` is installed
- Check `netlify.toml` configuration
- Verify redirects are set up correctly

## Additional Notes

- **PDF Upload**: The PDF upload feature uses `pdfjs-dist` which may have limitations in serverless environments. Consider using a dedicated service for PDF processing if issues occur.

- **File Storage**: If you need to store uploaded files, consider using:
  - Netlify Blobs
  - AWS S3
  - Cloudinary
  - Supabase Storage

- **Performance**: Netlify Functions have execution time limits. For heavy PDF processing, consider:
  - Using background jobs
  - Processing PDFs client-side
  - Using a dedicated PDF processing service

## Quick Deploy Checklist

- [ ] Set up cloud database (Supabase/PlanetScale/Neon)
- [ ] Update `prisma/schema.prisma` with correct provider
- [ ] Run `npx prisma migrate dev` locally
- [ ] Test database connection locally
- [ ] Push changes to GitHub
- [ ] Connect repository to Netlify
- [ ] Add environment variables in Netlify
- [ ] Deploy and test

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check function logs in Netlify dashboard
3. Verify environment variables are set
4. Test database connection separately

