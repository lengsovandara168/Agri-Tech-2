# 🔑 Get Your Supabase Database Connection String

You provided the **service role secret key**, but you also need the **database connection string**. Here's how to get it:

## Step 1: Go to Supabase Database Settings

1. Open your Supabase project dashboard
2. Navigate to: **Settings** → **Database**
3. Scroll down to the **"Connection string"** section

## Step 2: Get the Connection String

You'll see different connection modes. Choose **"URI"** format:

### For Connection Pooling (Recommended):
Select **"Session" mode** and copy the URI. It looks like:
```
postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### For Direct Connection (needed for migrations):
Copy the direct connection string (usually port 5432):
```
postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

## Step 3: Find Your Database Password

If you don't have your database password:
1. In Supabase Dashboard, go to **Settings** → **Database**
2. Click **"Reset Database Password"**
3. Save the new password securely!

## Step 4: Update Your .env File

Replace the placeholders in your `.env`:

```env
# Replace YOUR_PROJECT_REF, YOUR-PASSWORD, and YOUR_REGION with actual values
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxx:your_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxxxxxxxxx:your_password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Supabase API Keys (you already have these)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="sb_secret_9LtmOwMIx3Zo3Qnc6dA24A_mDYD0pCS"

# Gemini (already set)
GEMINI_API_KEY="AIzaSyBxWVfZj7chKTTzEmfTVLZkq8CNd4-DgHw"
```

## Step 5: Get Project Reference

Your project reference is in the Supabase URL. For example:
- If your project URL is `https://abcdefghijkl.supabase.co`
- Your PROJECT_REF is: `abcdefghijkl`

## Example (with fake data):

```env
DATABASE_URL="postgresql://postgres.abcdefghijkl:MySecurePassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.abcdefghijkl:MySecurePassword123@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://abcdefghijkl.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="sb_secret_9LtmOwMIx3Zo3Qnc6dA24A_mDYD0pCS"

GEMINI_API_KEY="AIzaSyBxWVfZj7chKTTzEmfTVLZkq8CNd4-DgHw"
```

## Important Notes

⚠️ **Password with Special Characters?**
If your password contains `@`, `#`, `$`, etc., you must URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- etc.

Example: 
- Password: `Pass@123#`
- Encoded: `Pass%40123%23`

## Step 6: Enable pgvector Extension

1. In Supabase Dashboard: **Database** → **Extensions**
2. Search for **"vector"**
3. Click **Enable** for the pgvector extension

## Step 7: Test Connection

```bash
# Install dependencies
npm install

# Test connection
npm run db:test
```

Expected output:
```
✅ Connected to Supabase!
✅ pgvector extension is enabled!
```

## Step 8: Run Migrations

```bash
# Push schema to Supabase
npm run db:push

# Or create a migration
npm run db:migrate
```

## Step 9: Start Your App

```bash
npm run dev
```

---

## Need Help?

If you see errors, share:
1. The error message
2. Your DATABASE_URL format (hide password!)
3. Whether pgvector is enabled in Supabase

I'll help you fix it! 🚀
