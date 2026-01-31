# Security Best Practices & Guidelines

## JWT Security

### Token Management
- **Access tokens** are short-lived (7 days by default)
- **Refresh tokens** are long-lived (30 days by default)
- Tokens are stored in HTTP-only cookies to prevent XSS attacks
- Always use HTTPS in production to prevent token interception

### Token Storage
```javascript
// Frontend should store tokens securely
// Option 1: In-memory (most secure, lost on refresh)
let accessToken = null;

// Option 2: Local storage (convenient but vulnerable to XSS)
localStorage.setItem('token', token); // Use with caution

// Option 3: HTTP-only cookies (recommended, handled by server)
// Server automatically sets cookies
```

## Password Security

### Password Requirements
- Minimum 6 characters (increase to 8-12 for production)
- Automatically hashed using bcrypt with salt rounds
- Never store passwords in plain text
- Never log passwords

### Password Hashing
```javascript
// Passwords are automatically hashed in User model
// Salt rounds: 10 (good balance between security and performance)
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
```

## API Security

### Rate Limiting
- Default: 100 requests per 15 minutes per IP
- Prevents brute force attacks
- Configurable in `.env` file

### Input Validation
- All inputs are validated using express-validator
- Prevents SQL/NoSQL injection
- Sanitizes inputs to remove malicious code

### Data Sanitization
```javascript
// Automatic sanitization against NoSQL injection
app.use(mongoSanitize());
```

## CORS Configuration

### Allowed Origins
```javascript
// Only allow requests from trusted origins
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
```

### Production Settings
- Set `CLIENT_URL` to your production frontend URL
- Never use `origin: '*'` in production
- Enable credentials for cookie-based auth

## Database Security

### MongoDB Best Practices
1. **Never expose MongoDB directly to the internet**
2. **Use authentication** for MongoDB
3. **Limit database user permissions**
4. **Enable MongoDB access control**

### Connection String Security
```env
# Local development
MONGODB_URI=mongodb://localhost:27017/report-hub

# Production with authentication
MONGODB_URI=mongodb://username:password@host:27017/report-hub?authSource=admin

# MongoDB Atlas (recommended for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/report-hub
```

## Environment Variables

### Never Commit .env Files
- Add `.env` to `.gitignore`
- Use `.env.example` as template
- Store production secrets in secure vault (e.g., AWS Secrets Manager)

### Strong Secrets
```bash
# Generate strong JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Helmet Security Headers

Helmet sets the following headers:
- `Content-Security-Policy`: Prevents XSS attacks
- `X-DNS-Prefetch-Control`: Controls DNS prefetching
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `Strict-Transport-Security`: Enforces HTTPS

## Error Handling

### Never Expose Sensitive Information
```javascript
// ❌ Bad - exposes stack trace in production
res.status(500).json({ error: err.stack });

// ✅ Good - generic error in production
res.status(500).json({ 
  error: process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Server Error' 
});
```

## Role-Based Access Control (RBAC)

### Permission Levels
1. **Public**: No authentication required
2. **Authenticated**: Any logged-in user
3. **Employee**: Employee role required
4. **Admin**: Admin role required

### Middleware Usage
```javascript
// Public route
router.post('/auth/login', login);

// Authenticated route
router.get('/auth/me', protect, getMe);

// Admin-only route
router.get('/users', protect, authorize('admin'), getUsers);
```

## Production Deployment Checklist

- [ ] Change all default secrets in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Use production MongoDB instance
- [ ] Configure firewall rules
- [ ] Set up logging and monitoring
- [ ] Implement backup strategy
- [ ] Review and test all security measures
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Use environment-specific configs
- [ ] Implement API versioning
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure auto-scaling
- [ ] Implement health checks
- [ ] Set up CI/CD pipeline

## Additional Security Measures

### SSL/TLS (HTTPS)
```javascript
// Use HTTPS in production
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

https.createServer(options, app).listen(443);
```

### Request Size Limits
```javascript
// Prevent large payload attacks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### Compression
```javascript
// Reduce response size
app.use(compression());
```

## Monitoring & Logging

### Log Security Events
- Failed login attempts
- Invalid token attempts
- Rate limit violations
- Database connection errors
- Unauthorized access attempts

### Use Morgan for HTTP Logging
```javascript
// Development
app.use(morgan('dev'));

// Production
app.use(morgan('combined'));
```

## Regular Security Updates

1. **Update dependencies regularly**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Monitor security advisories**
   - Subscribe to Node.js security mailing list
   - Check npm security advisories

3. **Perform security testing**
   - Penetration testing
   - Vulnerability scanning
   - Code reviews

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
