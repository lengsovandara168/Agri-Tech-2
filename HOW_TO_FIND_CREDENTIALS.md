# 🔍 How to Find Your Supabase Credentials - Step by Step

## 📍 Step 1: Open Your Supabase Project

1. Go to https://app.supabase.com
2. Sign in with your account
3. Click on your project (or create a new one if you don't have one yet)

---

## 🔗 Step 2: Get DATABASE_URL and DIRECT_URL

### Navigate to Database Settings:
1. In the left sidebar, click **"Settings"** (⚙️ icon at bottom)
2. Click **"Database"**
3. Scroll down to the **"Connection string"** section

### Get the URLs:

#### For DATABASE_URL (Connection Pooling):
1. In the "Connection string" section, find **"Connection pooling"**
2. Make sure **"Use connection pooling"** is enabled
3. Select **"Session mode"** from the dropdown
4. Select **"URI"** format (not the individual fields)
5. You'll see something like:
   ```
   postgresql://postgres.abcdefghijk:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. **Click the "Copy" button** or manually copy this entire URL
7. Replace `[YOUR-PASSWORD]` with your actual database password

#### For DIRECT_URL:
1. In the same "Connection string" section
2. Look for **"Direct connection"** or just change the port from `6543` to `5432`
3. Copy the URL, it should look like:
   ```
   postgresql://postgres.abcdefghijk:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

### 🔑 Where is my database password?

**If you don't know your database password:**
1. Scroll up on the Database settings page
2. Find **"Database password"** section
3. Click **"Reset Database Password"**
4. **Copy and save the new password immediately!** (You won't see it again)
5. Now replace `[YOUR-PASSWORD]` in both URLs with this password

**Example with real password:**
```
# If your password is: MySecure123Pass
DATABASE_URL=postgresql://postgres.abcdefghijk:MySecure123Pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.abcdefghijk:MySecure123Pass@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**⚠️ Password has special characters?** URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `&` → `%26`

Example: `Pass@123#` becomes `Pass%40123%23`

---

## 🔑 Step 3: Get GEMINI_API_KEY

You already have this one! ✅
```
GEMINI_API_KEY=AIzaSyBxWVfZj7chKTTzEmfTVLZkq8CNd4-DgHw
```

This is your Google Gemini API key for the AI chatbot.

---

## 🔐 Step 4: Get SUPABASE_SERVICE_ROLE_KEY

You also already have this! ✅
```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_9LtmOwMIx3Zo3Qnc6dA24A_mDYD0pCS
```

But if you need to find it again or get other keys:

1. In Supabase sidebar, click **"Settings"** (⚙️)
2. Click **"API"**
3. Scroll to **"Project API keys"** section
4. You'll see:
   - **anon / public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...` or `sb_secret_...`)

Copy the **service_role** key.

### Also get these while you're here (optional but useful):

**NEXT_PUBLIC_SUPABASE_URL:**
- At the top of the API page, you'll see **"Project URL"**
- Copy it (e.g., `https://abcdefghijk.supabase.co`)

**NEXT_PUBLIC_SUPABASE_ANON_KEY:**
- Copy the **anon / public** key from the "Project API keys" section

---

## 📝 Step 5: Complete Environment Variables

After gathering all the info, your complete environment variables should look like:

```env
# Supabase Database URLs
DATABASE_URL=postgresql://postgres.abcdefghijk:YourPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.abcdefghijk:YourPassword123@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Gemini AI
GEMINI_API_KEY=AIzaSyBxWVfZj7chKTTzEmfTVLZkq8CNd4-DgHw

# Supabase API Keys
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_9LtmOwMIx3Zo3Qnc6dA24A_mDYD0pCS

# File uploads
UPLOAD_FOLDER=/tmp/uploads

# App URL (update after deployment)
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

---

## 🚀 Step 6: Add to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable one by one:
   - Variable name: `DATABASE_URL`
   - Value: `postgresql://postgres...` (paste your full URL)
   - Environments: Check ✅ **Production**, **Preview**, **Development**
   - Click **Save**
5. Repeat for all variables

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project (run in your project directory)
vercel link

# Add environment variables
vercel env add DATABASE_URL production
# Paste your database URL when prompted
# Repeat for preview and development

vercel env add DIRECT_URL production
# etc...
```

---

## ✅ Step 7: Verify Everything

### Test Locally First:

1. Update your local `.env` file with the real values
2. Run: `npm run db:test`
3. You should see:
   ```
   ✅ Connected to Supabase!
   ✅ pgvector extension is enabled!
   ```

### Enable pgvector Extension:

**Don't forget this step!**
1. In Supabase: **Database** → **Extensions**
2. Search for "vector"
3. Click **Enable** on **pgvector**

### Push to Vercel:

```bash
git add .
git commit -m "Add Supabase connection"
git push origin main
```

Vercel will automatically redeploy with your new environment variables!

---

## 🆘 Quick Reference Card

| Variable | Where to Find |
|----------|---------------|
| `DATABASE_URL` | Settings → Database → Connection string → Connection pooling (Session, URI, port 6543) |
| `DIRECT_URL` | Same as above but port 5432 |
| `GEMINI_API_KEY` | You already have: `AIzaSyBxWVfZj7chKTTzEmfTVLZkq8CNd4-DgHw` |
| `SUPABASE_SERVICE_ROLE_KEY` | You already have: `sb_secret_9LtmOwMIx3Zo3Qnc6dA24A_mDYD0pCS` |
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon public key |

---

## 🎯 Real Example (With Fake Data)

Here's what it looks like with example data:

```env
DATABASE_URL=postgresql://postgres.xyzabc123:MyP@ssw0rd@aws-0-us-east-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.xyzabc123:MyP@ssw0rd@aws-0-us-east-1.pooler.supabase.com:5432/postgres
GEMINI_API_KEY=AIzaSyBxWVfZj7chKTTzEmfTVLZkq8CNd4-DgHw
SUPABASE_SERVICE_ROLE_KEY=sb_secret_9LtmOwMIx3Zo3Qnc6dA24A_mDYD0pCS
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Now you're ready to deploy! 🚀
