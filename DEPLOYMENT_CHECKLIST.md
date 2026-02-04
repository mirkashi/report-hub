# Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] MongoDB database is set up (MongoDB Atlas recommended)
- [ ] All code is committed to Git repository
- [ ] Repository is pushed to GitHub/GitLab/Bitbucket
- [ ] `.env` file is NOT committed (it's in `.gitignore`)

## 🚀 Deploy to Vercel

### Step 1: Sign Up / Login to Vercel
Visit [vercel.com](https://vercel.com) and sign up or login

### Step 2: Import Your Repository
1. Click "Add New Project"
2. Import your Git repository
3. Vercel will detect the `vercel.json` configuration automatically

### Step 3: Configure Environment Variables

Add these in Vercel project settings → Environment Variables:

**Server Variables:**
```
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=generate_a_secure_random_string_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Client Variables:**
```
VITE_API_URL=https://your-app.vercel.app/api
```

💡 **Tip:** Generate a secure JWT_SECRET with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4: Deploy
Click "Deploy" and wait for the build to complete!

### Step 5: Post-Deployment
1. Note your Vercel URL (e.g., `your-app.vercel.app`)
2. Update `CLIENT_URL` environment variable with your actual URL
3. If using MongoDB Atlas, whitelist Vercel's IP (or use `0.0.0.0/0`)
4. Test your application

## 🔗 Important URLs

After deployment, your app will be available at:
- **Frontend:** `https://your-app.vercel.app`
- **API:** `https://your-app.vercel.app/api`
- **Health Check:** `https://your-app.vercel.app/api/health`

## 🔧 Common Issues

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure all dependencies are listed in `package.json`

**API not working?**
- Verify environment variables are set
- Check MongoDB connection string
- Ensure MongoDB Atlas IP whitelist includes Vercel

**CORS errors?**
- Update `CLIENT_URL` environment variable
- Redeploy after changing environment variables

## 📚 Full Documentation

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔄 Continuous Deployment

Once connected:
- Push to `main` branch → Auto-deploy to production
- Push to other branches → Preview deployments
- Pull requests → Automatic preview URLs

## 🎉 You're Done!

Your Report Hub application is now live on Vercel!
