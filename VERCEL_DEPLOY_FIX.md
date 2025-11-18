# Vercel Deployment Fix Guide

## ✅ What I Fixed

1. **Added `postinstall` script** - Generates Prisma Client automatically
2. **Updated `build` script** - Runs `prisma generate` before Next.js build
3. **Removed `node` package** - This was causing conflicts (it's not needed)
4. **Added Node.js version requirement** - Specifies compatible Node version
5. **Updated `vercel.json`** - Proper build configuration

## 🚀 Deploy to Vercel Now

### Step 1: Set Environment Variables in Vercel

Go to your Vercel project dashboard → **Settings** → **Environment Variables**

Add these variables for **Production**, **Preview**, and **Development**:

```
DATABASE_URL=your-supabase-database-url
DIRECT_URL=your-supabase-direct-url
GEMINI_API_KEY=AIzaSyBxWVfZj7chKTTzEmfTVLZkq8CNd4-DgHw
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
UPLOAD_FOLDER=/tmp/uploads
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=sb_secret_9LtmOwMIx3Zo3Qnc6dA24A_mDYD0pCS
```

**Important:** 
- Use your actual Supabase DATABASE_URL (the one from Settings → Database)
- For `UPLOAD_FOLDER`, use `/tmp/uploads` on Vercel (serverless functions have limited filesystem)

### Step 2: Push Your Changes

```bash
git add .
git commit -m "Fix Vercel deployment with Prisma"
git push origin main
```

Vercel will automatically redeploy!

### Step 3: Run Database Migrations (First Deploy Only)

After the first successful deploy, run migrations against Supabase:

```bash
# On your local machine with .env configured:
npm run db:push
```

Or use Vercel CLI:
```bash
vercel env pull .env.local
npx prisma db push
```

## 🔧 Alternative: Deploy Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## ⚠️ Important Notes for Vercel

### File Uploads Won't Work on Serverless
Vercel uses serverless functions which have ephemeral filesystems. For image uploads, you need to:

**Option 1: Use Supabase Storage (Recommended)**
```typescript
// Update get-response route to use Supabase Storage
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Upload image
const { data, error } = await supabase.storage
  .from('chat-images')
  .upload(`${userId}/${timestamp}.jpg`, imageBuffer);
```

**Option 2: Use Vercel Blob**
```bash
npm install @vercel/blob
```

**Option 3: Use Cloudinary or AWS S3**

### Database Connection Pooling
Make sure your Supabase DATABASE_URL uses connection pooling (port 6543):
```
postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## 🧪 Test Your Deployment

After deployment succeeds:
1. Visit your Vercel URL
2. Check the Functions logs in Vercel dashboard
3. Test user registration and login
4. Test chat functionality

## 🆘 Still Having Issues?

### Error: "libatomic.so.1 not found"
- ✅ Fixed by updating package.json

### Error: "Prisma Client not generated"
- ✅ Fixed by adding postinstall script

### Error: "Can't reach database"
- Check DATABASE_URL in Vercel environment variables
- Verify Supabase allows connections from Vercel IPs (should be enabled by default)

### Deployment succeeds but app crashes
- Check Vercel Function Logs for errors
- Verify all environment variables are set
- Make sure DIRECT_URL is only used for migrations, not at runtime

## 📝 Summary of Changes

- `package.json`: Added postinstall, updated build script, specified Node version
- `vercel.json`: Configured build commands
- Ready for Vercel deployment with Prisma + Supabase

Push to GitHub and Vercel will automatically redeploy! 🚀
