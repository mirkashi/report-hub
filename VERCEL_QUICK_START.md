# ⚡ Vercel Deployment - Quick Reference

## 📋 Files Created for Vercel

✅ `vercel.json` - Main Vercel configuration
✅ `.vercelignore` - Files to exclude from deployment
✅ `client/.env.production` - Production environment variables template
✅ `client/.env.development` - Development environment variables
✅ `server/.env.example` - Server environment template
✅ `DEPLOYMENT_CHECKLIST.md` - Quick deployment steps
✅ `VERCEL_DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide

## 🚀 Deploy in 3 Steps

### 1️⃣ Prepare Your Repository
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2️⃣ Connect to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your Git repository
- Vercel will auto-detect settings from `vercel.json`

### 3️⃣ Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

**Copy and paste these (update values):**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-super-secret-random-string-here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
VITE_API_URL=https://your-app.vercel.app/api
```

**Click Deploy!** 🎉

## 🔑 Generate Secure JWT Secret

Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`

## ✅ Post-Deployment Checklist

After your first deployment:

- [ ] Note your Vercel URL (e.g., `my-app.vercel.app`)
- [ ] Update `CLIENT_URL` environment variable with actual URL
- [ ] Update `VITE_API_URL` environment variable with actual URL
- [ ] Add Vercel IP to MongoDB Atlas whitelist (or use `0.0.0.0/0`)
- [ ] Test: Visit `https://your-app.vercel.app/api/health`
- [ ] Test: Register and login
- [ ] Redeploy if you changed environment variables

## 🔄 Automatic Deployments

Once connected to Git:
- **Push to `main`** → Production deployment
- **Push to any branch** → Preview deployment
- **Pull requests** → Auto preview URL

## 📚 Need More Help?

- **Quick Start**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Full Guide**: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- **Vercel Docs**: https://vercel.com/docs

## 🆘 Common Issues

**Issue: Build Failed**
→ Check Vercel build logs, verify all deps in package.json

**Issue: API not working**
→ Verify environment variables, check MongoDB connection

**Issue: CORS errors**
→ Ensure `CLIENT_URL` matches your Vercel domain

**Issue: 404 on routes**
→ Check `vercel.json` routing configuration

---

**You're all set!** 🚀 Your app is ready for Vercel deployment.
