# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in:
   - **Project Name**: `my-chatbot` (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., `us-east-1`)
5. Click "Create new project" and wait ~2 minutes

## Step 2: Get Your Database Credentials

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Select **Connection pooling** (recommended for serverless)
4. Copy the **Connection string** (it looks like):
   ```
   postgresql://postgres.PROJECT_REF:[YOUR-PASSWORD]@aws-0-REGION.pooler.supabase.com:6543/postgres
   ```
5. Also copy the **Direct connection** string for migrations:
   ```
   postgresql://postgres.PROJECT_REF:[YOUR-PASSWORD]@aws-0-REGION.pooler.supabase.com:5432/postgres
   ```

## Step 3: Update Your .env File

Replace the placeholders in `.env`:

```env
# Replace these with your actual Supabase credentials
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres"

# Your Gemini API Key
GEMINI_API_KEY="AIzaSyBxWVfZj7chKTTzEmfTVLZkq8CNd4-DgHw"
```

**Important**: Replace `YOUR_PROJECT_REF`, `YOUR_PASSWORD`, and `YOUR_REGION` with your actual values!

## Step 4: Enable pgvector Extension

1. In Supabase dashboard, go to **Database** → **Extensions**
2. Search for `vector`
3. Enable the **pgvector** extension
4. Click "Enable" and confirm

## Step 5: Run Database Migrations

In your project terminal, run:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name init_supabase

# Or if you want to push without creating migration files
npx prisma db push
```

## Step 6: Verify Connection

Test the database connection:

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` where you can view your database tables.

## Step 7: Start Your App

```bash
npm run dev
```

## Troubleshooting

### Error: "Can't reach database server"
- Check your DATABASE_URL is correct
- Verify your password has no special characters that need URL encoding
- Make sure your IP is not blocked (Supabase allows all IPs by default)

### Error: "pgvector extension not found"
- Go to Supabase Dashboard → Database → Extensions
- Enable the `vector` extension

### Error: "relation does not exist"
- Run migrations: `npx prisma migrate dev`
- Or reset: `npx prisma migrate reset` (WARNING: deletes all data)

### Password URL Encoding
If your password has special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `&` → `%26`
- `+` → `%2B`
- Space → `%20`

Example:
```
Password: my#pass@123
Encoded:  my%23pass%40123
```

## Features Enabled

✅ PostgreSQL database (instead of SQLite)
✅ pgvector for semantic search with embeddings
✅ Connection pooling for serverless edge functions
✅ Automatic backups and scaling
✅ Free tier: 500 MB database, 1 GB file storage

## Next Steps

After setup, you can:
1. Register a new user at `/signup` or create via Prisma Studio
2. Login and start chatting
3. Your messages will be stored with embeddings for semantic search
4. Use Supabase Dashboard to monitor queries, logs, and performance
