# Sukoon - Deployment Guide

Deploy your Sukoon mental wellness app to production.

## Pre-Deployment Checklist

### Backend
- [ ] Spring Boot backend is deployed and accessible
- [ ] CORS configured for production domain
- [ ] Database is backed up
- [ ] Environment variables set correctly
- [ ] Rate limiting implemented
- [ ] Error logging/monitoring in place
- [ ] SSL certificate installed (HTTPS)

### Frontend
- [ ] All dependencies installed
- [ ] API URL updated to production backend
- [ ] Environment variables configured
- [ ] Testing completed locally
- [ ] Performance optimized
- [ ] SEO metadata updated
- [ ] Analytics configured (optional)

---

## Option 1: Deploy to Vercel (Recommended)

Vercel is the creators of Next.js and easiest way to deploy.

### 1. Push Code to GitHub

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/sukoon.git
git branch -M main
git push -u origin main
```

### 2. Connect to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repo
4. Click **"Import"**
5. Configure project:
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

### 3. Set Environment Variables

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
   ```
3. Click **"Save"**

### 4. Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. ✅ App is live at `your-project.vercel.app`

### 5. Add Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (5-30 minutes)

---

## Option 2: Deploy to AWS

### Using AWS Amplify

1. **Connect GitHub**:
   - Go to AWS Amplify Console
   - Click "New app"
   - Select GitHub and authorize
   - Choose your repo

2. **Configure Build**:
   - Build command: `pnpm build`
   - Start command: `pnpm start`

3. **Set Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL`

4. **Deploy**:
   - Click "Deploy"
   - Wait for completion
   - App will be live

### Using EC2 + PM2

1. **Launch EC2 Instance**:
   ```bash
   # SSH into instance
   ssh -i key.pem ec2-user@instance-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install pnpm
   npm install -g pnpm
   ```

2. **Clone and Install**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sukoon.git
   cd sukoon
   pnpm install
   ```

3. **Build**:
   ```bash
   pnpm build
   ```

4. **Setup PM2**:
   ```bash
   npm install -g pm2
   
   # Create ecosystem config file
   cat > ecosystem.config.js << 'EOF'
   module.exports = {
     apps: [{
       name: 'sukoon',
       script: 'pnpm',
       args: 'start',
       instances: 'max',
       exec_mode: 'cluster'
     }]
   };
   EOF
   
   # Start app
   pm2 start ecosystem.config.js
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx** (as reverse proxy):
   ```bash
   sudo apt-get install -y nginx
   
   sudo tee /etc/nginx/sites-available/sukoon > /dev/null << 'EOF'
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   EOF
   
   sudo ln -s /etc/nginx/sites-available/sukoon /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL** (Let's Encrypt):
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Option 3: Deploy to Heroku (Deprecated)

Heroku no longer offers a free tier. Consider Vercel or AWS instead.

---

## Environment Variables Setup

### Production Environment Variables

Create `.env.production`:

```env
# API
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (error tracking, optional)
NEXT_PUBLIC_SENTRY_DSN=https://...

# Other configs
NODE_ENV=production
```

### For Vercel:

Set these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
```

---

## Production Optimizations

### 1. Build Optimization

```bash
# Build
pnpm build

# Check bundle size
npm install -g next-bundle-analyzer
```

### 2. Performance

In `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Compiler (stable in Next.js 16)
  reactCompiler: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Compression
  compress: true,

  // Generate static pages
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
```

### 3. Security Headers

In `next.config.mjs`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        }
      ],
    },
  ];
},
```

---

## Database Migration

### Backup Production Data

```bash
# PostgreSQL backup
pg_dump -h your-host -U username database > backup.sql

# Restore from backup
psql -h your-host -U username database < backup.sql
```

### Update API URL

Update `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  'https://api.your-domain.com/api';
```

---

## Monitoring & Logging

### Setup Error Tracking (Sentry)

1. **Install Sentry**:
   ```bash
   pnpm add @sentry/nextjs
   ```

2. **Configure**:
   - Sign up at [sentry.io](https://sentry.io)
   - Create project for React
   - Copy DSN

3. **Add to `.env`**:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://YOUR_DSN
   ```

4. **Initialize** in `app/layout.tsx`:
   ```typescript
   import * as Sentry from "@sentry/nextjs";
   
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
     integrations: [
       new Sentry.Replay({
         maskAllText: true,
         blockAllMedia: true,
       }),
     ],
     tracesSampleRate: 1.0,
     replaysSessionSampleRate: 0.1,
     replaysOnErrorSampleRate: 1.0,
   });
   ```

### Setup Analytics (Google Analytics)

1. **Get Tracking ID** from Google Analytics
2. **Install gtag**:
   ```bash
   pnpm add gtag.js @types/gtag.js
   ```

3. **Add to `app/layout.tsx`**:
   ```typescript
   useEffect(() => {
     window.gtag?.config('GA_MEASUREMENT_ID', {
       page_path: pathname,
     });
   }, [pathname]);
   ```

---

## Performance Testing

### Lighthouse

```bash
npm install -g lighthouse

lighthouse https://your-domain.com --view
```

Target scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Load Testing

```bash
npm install -g artillery

# Create test file
cat > load-test.yml << 'EOF'
config:
  target: "https://your-domain.com"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Load test"
    flow:
      - get:
          url: "/"
EOF

artillery run load-test.yml
```

---

## SSL/HTTPS Setup

### For AWS EC2

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renewal (should be automatic)
sudo systemctl enable certbot.timer
```

### For Vercel

- Automatic SSL with Let's Encrypt
- Redirects HTTP to HTTPS automatically

---

## Post-Deployment

### Verify

1. ✅ App loads at your domain
2. ✅ All pages accessible
3. ✅ Can register/login
4. ✅ Chat functionality works
5. ✅ Notes feature works
6. ✅ No console errors
7. ✅ Mobile responsive
8. ✅ SSL certificate valid

### Monitor

1. Check error tracking (Sentry)
2. Monitor server logs
3. Check website uptime (pingdom.com)
4. Monitor API response times
5. Track user analytics

### Update DNS

If using custom domain:

```
CNAME: your-domain.com → your-vercel-project.vercel.app
```

Wait 24-48 hours for propagation.

---

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Click dropdown on previous deployment
3. Click "Redeploy"

### AWS
```bash
# Revert to previous commit
git revert HEAD
git push

# AWS will auto-redeploy
```

---

## Troubleshooting

### 502 Bad Gateway
- Backend is down or unreachable
- Check backend server status
- Verify API URL is correct

### CORS Error
- Backend not configured for your domain
- Add your domain to CORS whitelist
- Restart backend server

### SSL Certificate Error
- Wait 24 hours after domain setup
- Check certificate is valid
- Force refresh browser cache

### Slow Performance
- Check bundle size
- Enable compression
- Optimize images
- Use CDN for static assets

---

## Maintenance

### Regular Tasks

- [ ] Monitor error logs weekly
- [ ] Review analytics monthly
- [ ] Update dependencies monthly
- [ ] Backup database weekly
- [ ] Test disaster recovery quarterly

### Update Dependencies

```bash
# Check for updates
pnpm outdated

# Update
pnpm update

# Test
pnpm build
pnpm dev

# Deploy
git push
```

---

## Scaling

### Horizontal Scaling
- Use load balancer
- Run multiple instances
- Share database

### Vertical Scaling
- Increase instance size
- More CPU/RAM
- Better disk I/O

### Database Optimization
- Add indexes
- Archive old data
- Implement caching

---

## Security Hardening

- [ ] Enable 2FA for dashboard access
- [ ] Use environment variables for secrets
- [ ] Enable WAF (Web Application Firewall)
- [ ] Rate limit API endpoints
- [ ] Monitor for suspicious activity
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Backup critical data

---

## Cost Optimization

### Vercel
- Free tier included
- Pay-as-you-go for high traffic
- ~$20-50/month typical

### AWS
- Estimated: $30-100/month
- EC2 instance + RDS database
- Can reduce costs with Reserved Instances

### Backups
- Use S3 for database backups (~$1-5/month)

---

## Support

For deployment issues:
- Check provider documentation
- Review server logs
- Verify environment variables
- Check DNS configuration
- Test API connectivity

---

**Deployment Complete! 🚀**

Your Sukoon app is now live and ready to support users' mental wellness journey.

