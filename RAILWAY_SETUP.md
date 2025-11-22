# Railway Deployment Guide

## Prerequisites
- GitHub account
- Railway account (sign up at railway.app)
- This project pushed to a GitHub repository

## Step 1: Prepare Your GitHub Repository

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Ready for Railway deployment"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `mockCivilAviation`
5. Railway will automatically detect Next.js and start deployment

## Step 3: Add PostgreSQL Database

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically:
   - Create a PostgreSQL database
   - Add `DATABASE_URL` environment variable to your app
   - Link the database to your service

## Step 4: Configure Environment Variables

In your Railway project settings, add these environment variables:

```env
DATABASE_URL=(automatically set by Railway when you add PostgreSQL)
NEXT_PUBLIC_APP_URL=https://your-app-name.up.railway.app
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password-here
NODE_ENV=production
```

**Important:** 
- Replace `NEXT_PUBLIC_ADMIN_PASSWORD` with a secure password
- The app URL will be provided by Railway after first deployment

## Step 5: Initialize Database

After deployment, you need to initialize the database with default sections:

### Option A: Via Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run database initialization
railway run npm run db:init
```

### Option B: Via API Call
After deployment, visit your admin console:
1. Go to `https://your-app-name.up.railway.app/admin`
2. The database will auto-initialize when you first load the admin page
3. Login with your password
4. Start uploading questions!

## Step 6: Verify Deployment

1. Visit your app URL: `https://your-app-name.up.railway.app`
2. Check the homepage loads correctly
3. Visit `/admin` and login
4. Test uploading a PDF or adding a question manually

## Step 7: Update Your Repository (Future Changes)

Any time you push to GitHub, Railway will automatically redeploy:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## Troubleshooting

### Build Failed
- Check Railway logs for specific errors
- Ensure all dependencies are in package.json
- Verify DATABASE_URL is set

### Database Connection Error
- Ensure PostgreSQL service is running in Railway
- Check DATABASE_URL format: `postgresql://user:pass@host:port/db`
- Verify migrations ran successfully

### "No questions available"
- Run `railway run npm run db:init` to initialize sections
- Or visit `/admin` to trigger auto-initialization
- Upload questions via admin console

### Admin console not working
- Check NEXT_PUBLIC_ADMIN_PASSWORD is set
- Ensure you're using the correct password
- Check browser console for errors

## Cost

Railway offers:
- **Free Tier**: $5 credit/month (enough for development)
- **Pro**: $20/month for production apps

PostgreSQL database is included in your plan.

## Custom Domain (Optional)

1. In Railway project settings, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your custom domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_APP_URL` environment variable

## Security Recommendations

1. **Change default admin password** via `NEXT_PUBLIC_ADMIN_PASSWORD`
2. **Enable Railway authentication** for additional security
3. **Add rate limiting** to API routes (future enhancement)
4. **Implement proper auth** (NextAuth.js) for production

## Database Backups

Railway Pro includes automatic backups. To manually backup:

1. Go to PostgreSQL service in Railway
2. Click **"Data"** → **"Backup"**
3. Download backup file

Or use Railway CLI:
```bash
railway db backup
```

## Monitoring

Railway provides:
- Real-time logs
- Resource usage metrics
- Deployment history
- Crash notifications

Access via project dashboard.

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Issues: GitHub repository issues

---

**Your app will be live at:**
`https://your-project-name.up.railway.app`

🎉 **Ready to deploy!**

