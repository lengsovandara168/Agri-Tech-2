# Quick Start Guide - Authentication Testing

## Prerequisites
✅ Database configured (Supabase PostgreSQL)
✅ Environment variables set in `.env`
✅ Dependencies installed (`npm install`)

## Step 1: Push Database Schema
```bash
npm run db:push
```

## Step 2: Start Development Server
```bash
npm run dev
```

## Step 3: Test Authentication Flow

### Create First User
1. Open browser: `http://localhost:3000`
2. You'll be redirected to `/login`
3. Click "Sign Up" tab
4. Fill in the form:
   - **Email**: test@example.com
   - **Username**: testuser
   - **Password**: test123
   - **Confirm Password**: test123
5. Click "Sign Up"
6. **Check your terminal/console** for the OTP code
7. Enter the 6-digit OTP code
8. You'll be redirected to the main chat page ✨

### Login with Existing User
1. Go to `/login`
2. Click "Login" tab
3. Enter:
   - **Username**: testuser
   - **Password**: test123
4. Click "Login"
5. Access granted! 🎉

### Test Logout
1. Click the user icon in the top-right corner
2. Click "Log out"
3. You'll be redirected to `/login`

## Development Notes

### OTP Code Location
Since email is not configured yet, OTP codes are printed to the **terminal** where you ran `npm run dev`.

Look for output like:
```
📧 OTP for test@example.com: 123456
Note: Email sending is not configured. Check console for OTP.
```

### Testing Different Scenarios

**Invalid Login:**
```
Username: wronguser
Password: wrongpass
Result: "Invalid username or password"
```

**Duplicate Username:**
```
Try signing up with username "testuser" again
Result: "Username already taken"
```

**Duplicate Email:**
```
Try signing up with email "test@example.com" again
Result: "Email already registered"
```

**Password Mismatch:**
```
Password: test123
Confirm Password: test456
Result: "Passwords do not match"
```

**Weak Password:**
```
Password: 123
Result: "Password must be at least 6 characters"
```

**Invalid OTP:**
```
Enter wrong code: 000000
Result: "Invalid OTP. Please check and try again."
```

**Expired OTP:**
```
Wait 10+ minutes after signup
Result: "OTP has expired. Please request a new one."
```

## Protected Routes

Try accessing these URLs directly:

| URL | Unauthenticated | Authenticated |
|-----|----------------|---------------|
| `/` | ➡️ Redirects to `/login` | ✅ Shows chat page |
| `/login` | ✅ Shows login form | ➡️ Redirects to `/` |
| `/verify-otp` | ✅ Shows OTP form | ✅ Shows OTP form |

## Database Inspection

Check created users in your database:

```sql
SELECT id, username, email, "createdAt" FROM "User";
```

Or use Prisma Studio:
```bash
npx prisma studio
```

## Common Issues

### Issue: Build fails with Prisma error
**Solution:** Stop the dev server first, then run:
```bash
npm run db:push
npm run dev
```

### Issue: Can't see OTP code
**Solution:** Check the terminal where `npm run dev` is running

### Issue: Middleware not working
**Solution:** Restart the dev server:
```bash
# Press Ctrl+C to stop
npm run dev
```

### Issue: Cookies not being set
**Solution:** 
- Check browser DevTools → Application → Cookies
- Make sure you're using `localhost` (not `127.0.0.1`)
- Clear all cookies and try again

## Next Steps

Once authentication is working:

1. ✅ Test chat functionality with authenticated user
2. ✅ Create multiple users to test user isolation
3. ✅ Test logout and re-login
4. 🚀 Deploy to Vercel
5. 📧 Configure production email service (SendGrid/AWS SES)

## File Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx          # Login/Signup UI
│   ├── verify-otp/
│   │   └── page.tsx          # OTP verification UI
│   └── api/
│       └── auth/
│           ├── login/
│           │   └── route.ts  # Login endpoint
│           ├── logout/
│           │   └── route.ts  # Logout endpoint
│           ├── send-otp/
│           │   └── route.ts  # OTP generation
│           └── verify-otp/
│               └── route.ts  # OTP verification
├── lib/
│   └── auth.ts               # Auth utilities
└── middleware.ts             # Route protection
```

## Support

If you encounter issues:
1. Check `AUTH_SYSTEM.md` for detailed documentation
2. Review error messages in browser console
3. Check terminal output for backend errors
4. Inspect Network tab in DevTools for API responses
