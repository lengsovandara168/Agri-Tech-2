# 🔧 Database Connection Fix

## Error: "Tenant or user not found" or "Failed to send OTP" or "Can't reach database server"

Your database connection is failing! This is causing the "Failed to send OTP" error because the app can't check if the user already exists in the database.

## 🚨 IMMEDIATE ACTION REQUIRED

### Problem Diagnosed:
```
❌ Can't reach database server at aws-0-ap-southeast-1.pooler.supabase.com:6543
```

This means your Supabase project is either:
1. **PAUSED** (most likely)
2. Connection credentials are wrong
3. Network/firewall blocking connection

## SOLUTION: Unpause Your Supabase Project

## SOLUTION: Unpause Your Supabase Project

### Step 1: Check Project Status

1. **Go to Supabase Dashboard:**
   ```
   https://app.supabase.com/projects
   ```

2. **Find your project:** `vcfbhjzvucfruskclrid`

3. **Look for status:**
   - If it shows "PAUSED" or "INACTIVE" → Click "Restore" or "Unpause"
   - If it shows "ACTIVE" → Continue to next steps

### Step 2: Get Fresh Connection Strings

After unpausing (or if already active):

1. **Go to Database Settings:**
   ```
   https://app.supabase.com/project/vcfbhjzvucfruskclrid/settings/database
   ```

2. **Scroll to "Connection string" section**

3. **Copy BOTH connection strings:**

   **For DATABASE_URL** (Transaction mode - with pgbouncer):
   - Click on "URI" tab
   - Copy the string that looks like:
     ```
     postgresql://postgres.vcfbhjzvucfruskclrid:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   
   **For DIRECT_URL** (Session mode - without pgbouncer):
   - Click on "URI" tab under "Direct connection"
   - Copy the string that looks like:
     ```
     postgresql://postgres.vcfbhjzvucfruskclrid:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
     ```

4. **Replace `[YOUR-PASSWORD]` with your actual password**
   - If you don't know your password, click "Reset Database Password"
   - **IMPORTANT:** Save the new password securely!

### Step 3: Update .env File

Open `f:\ACT_SMART\NEW_PROJECT\my-project\.env` and update:

```env
# Replace these lines with your fresh connection strings
DATABASE_URL="postgresql://postgres.vcfbhjzvucfruskclrid:YOUR_ACTUAL_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vcfbhjzvucfruskclrid:YOUR_ACTUAL_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

**Example with password "MySecurePass123":**
```env
DATABASE_URL="postgresql://postgres.vcfbhjzvucfruskclrid:MySecurePass123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vcfbhjzvucfruskclrid:MySecurePass123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

1. **Go to Supabase SQL Editor:**
   ```
   https://app.supabase.com/project/vcfbhjzvucfruskclrid/sql
   ```

2. **Run this SQL command:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

3. **Verify it's enabled:**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```

## Step 2: Verify Database Password

1. Go to Supabase Dashboard: https://app.supabase.com/project/vcfbhjzvucfruskclrid/settings/database

2. Click "Reset Database Password" if needed

3. Update `.env` file with the new password:
   ```
   DATABASE_URL="postgresql://postgres.vcfbhjzvucfruskclrid:[NEW-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.vcfbhjzvucfruskclrid:[NEW-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
   ```

## Step 3: Push Database Schema

After enabling pgvector and verifying password:

```bash
npm run db:push
```

You should see:
```
✔ Generated Prisma Client
Your database is now in sync with your Prisma schema.
```

## Step 4: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Testing the Fix

1. Go to `http://localhost:3000/login`
2. Click "Sign Up" tab
3. Fill in the form:
   - Email: test@example.com
   - Username: testuser
   - Password: test123456
   - Confirm Password: test123456
4. Click "Sign Up"
5. Check terminal for OTP code

If you see:
```
📧 OTP for test@example.com: 123456
```

**✅ Success!** The connection is working.

## Alternative: Check Connection Directly

Test the connection with Prisma Studio:

```bash
npx prisma studio
```

If Prisma Studio opens successfully, your connection is working.

## Common Issues

### Issue: "Port 3000 in use"
**Solution:**
```bash
# Kill the process on port 3000
npx kill-port 3000
npm run dev
```

### Issue: "Unable to acquire lock"
**Solution:**
```bash
# Delete the lock file
rm -rf .next/dev/lock
npm run dev
```

### Issue: Still getting "Tenant or user not found"
**Solution:**

1. **Check if your Supabase project is active:**
   - Go to: https://app.supabase.com/projects
   - Make sure project `vcfbhjzvucfruskclrid` is not paused

2. **Get fresh connection strings:**
   - Go to: https://app.supabase.com/project/vcfbhjzvucfruskclrid/settings/database
   - Scroll to "Connection string"
   - Copy the "URI" (for DATABASE_URL) and "Direct connection" (for DIRECT_URL)
   - **Important:** Replace `[YOUR-PASSWORD]` with your actual password

3. **Test connection with psql:**
   ```bash
   psql "postgresql://postgres.vcfbhjzvucfruskclrid:Agritechiscool@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
   ```
```

### Step 4: Enable pgvector Extension

1. **Go to Supabase SQL Editor:**
   ```
   https://app.supabase.com/project/vcfbhjzvucfruskclrid/sql
   ```

2. **Run this SQL command:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

3. **Verify it's enabled:**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```

### Step 5: Test Connection

```bash
node test-db-connection.js
```

You should see:
```
✅ Successfully connected to database
✅ Query successful
PostgreSQL version: PostgreSQL 15.x...
```

### Step 6: Push Database Schema

```bash
npm run db:push
```

Expected output:
```
✔ Generated Prisma Client
Your database is now in sync with your Prisma schema.
```

### Step 7: Restart Development Server

```bash
# Kill any existing processes
npx kill-port 3000
npx kill-port 3001

# Start fresh
npm run dev
```

### Step 8: Test Authentication

1. Go to `http://localhost:3000/login`
2. Click "Sign Up"
3. Fill in the form and submit
4. **Check terminal for OTP:**
   ```
   📧 OTP for test@example.com: 123456
   ```

✅ **If you see the OTP, authentication is working!**

---

## Why This Happens

Supabase pauses projects after 1 week of inactivity to save resources. You need to:
1. Unpause the project
2. Refresh connection strings (they may change after pausing)
3. Update your `.env` file

## Troubleshooting

### Still Can't Connect?

**Option 1: Check Project Status**
```
1. Go to: https://app.supabase.com/projects
2. Look for project: vcfbhjzvucfruskclrid
3. Status should be: ACTIVE (green)
```

**Option 2: Verify Password**
```
1. Go to: https://app.supabase.com/project/vcfbhjzvucfruskclrid/settings/database
2. Click: "Reset Database Password"
3. Copy new password
4. Update .env file
5. Test again: node test-db-connection.js
```

**Option 3: Check Network**
```bash
# Test if you can reach Supabase
ping aws-0-ap-southeast-1.pooler.supabase.com
```

### Alternative: Use Local PostgreSQL

If Supabase continues to have issues, you can use local PostgreSQL temporarily:

1. Install PostgreSQL locally
2. Update `.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/agribot"
   DIRECT_URL="postgresql://postgres:password@localhost:5432/agribot"
   ```
3. Run: `npm run db:push`

---

## Quick Fix Checklist

- [ ] Supabase project is ACTIVE (not paused)
- [ ] Fresh connection strings copied from dashboard
- [ ] Password updated in `.env` file (no `[YOUR-PASSWORD]` placeholder)
- [ ] pgvector extension enabled
- [ ] `node test-db-connection.js` shows success
- [ ] `npm run db:push` completes without errors
- [ ] Dev server running on port 3000 or 3001
- [ ] Login page accessible
- [ ] OTP appears in terminal when signing up

---

## Contact Supabase Support

If none of these work:
- Dashboard: https://app.supabase.com/support
- Discord: https://discord.supabase.com
- Docs: https://supabase.com/docs

## Important Files

- **Connection test:** `test-db-connection.js`
- **Environment:** `.env`
- **Schema:** `prisma/schema.prisma`
- **Auth system:** `AUTH_SYSTEM.md`
- **Quick start:** `QUICK_START_AUTH.md`

