# Vercel Deployment Guide for Report Hub

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/download) installed (optional but recommended)
3. MongoDB Atlas database or any accessible MongoDB instance

## Environment Variables Setup

Before deploying, you need to configure the following environment variables in your Vercel project settings:

### Required Environment Variables

Go to your Vercel project dashboard → Settings → Environment Variables and add:

#### Server Variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

NODE_ENV=production

# Client URL (will be your Vercel domain)
CLIENT_URL=https://your-project-name.vercel.app

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Client Variables:
```
VITE_API_URL=https://your-project-name.vercel.app/api
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended for First-Time)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables**
   - In the import screen, add all environment variables listed above
   - Make sure to add them for "Production" environment

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Preview**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

5. **Set Environment Variables via CLI**
   ```bash
   vercel env add MONGODB_URI production
   vercel env add JWT_SECRET production
   vercel env add CLIENT_URL production
   vercel env add VITE_API_URL production
   # Add all other variables
   ```

## Post-Deployment Steps

1. **Update Client URL**
   - After first deployment, update the `CLIENT_URL` environment variable with your actual Vercel URL
   - Redeploy if necessary

2. **Update MongoDB IP Whitelist**
   - If using MongoDB Atlas, whitelist Vercel's IP addresses or allow access from anywhere (0.0.0.0/0)
   - Go to MongoDB Atlas → Network Access → Add IP Address

3. **Test Your Application**
   - Visit your Vercel URL
   - Test authentication
   - Test API endpoints: `https://your-url.vercel.app/api/health`

4. **Custom Domain (Optional)**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed
   - Update `CLIENT_URL` environment variable

## Important Notes

### Serverless Function Limitations

Vercel serverless functions have the following limits:
- **Execution timeout**: 10 seconds (Hobby), 60 seconds (Pro)
- **Payload size**: 4.5 MB
- **Memory**: 1024 MB (Hobby), 3008 MB (Pro)

If you need longer execution times or more resources, consider:
- Upgrading to Vercel Pro
- Using Vercel Edge Functions for faster response times
- Moving intensive tasks to background jobs

### Database Connections

Since Vercel uses serverless functions, database connections are created per request. To optimize:

1. **Use Connection Pooling** - Already configured in your MongoDB setup
2. **Consider MongoDB Atlas** - Optimized for serverless
3. **Monitor Connection Count** - Watch for connection limit issues

## Troubleshooting

### Build Failures

If the build fails:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json` (not devDependencies for production deps)
3. Verify Node.js version compatibility

### API Not Working

1. Check that environment variables are set correctly
2. Verify CORS settings include your Vercel domain
3. Check MongoDB connection and IP whitelist
4. Review function logs in Vercel dashboard

### CORS Errors

Update your server CORS configuration to include your Vercel domain:
```javascript
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    'https://your-project-name.vercel.app'
  ],
  credentials: true,
};
```

## Monitoring and Logs

- **Function Logs**: Vercel Dashboard → Your Project → Logs
- **Analytics**: Available in Pro plan
- **Performance**: Monitor via Vercel Analytics

## Continuous Deployment

Once connected to Git:
- Pushes to `main` branch → Production deployment
- Pushes to other branches → Preview deployments
- Pull requests → Automatic preview deployments

## Security Checklist

- [ ] All sensitive data in environment variables (not in code)
- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB connection string uses authentication
- [ ] CORS configured with specific origins
- [ ] Rate limiting enabled
- [ ] Helmet security headers configured
- [ ] Environment variables set to "Encrypted" in Vercel

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Community Forum](https://github.com/vercel/vercel/discussions)

## Rollback

If you need to rollback to a previous deployment:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Find the working deployment
3. Click on it → Click "Promote to Production"
