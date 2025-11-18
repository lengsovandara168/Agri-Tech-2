# Authentication System

This project includes a complete authentication system with the following features:

## Features

- ✅ **Login/Signup**: User registration with email verification
- ✅ **OTP Verification**: 6-digit OTP codes for email verification
- ✅ **Session Management**: Cookie-based authentication (httpOnly cookies)
- ✅ **Protected Routes**: Middleware automatically redirects unauthenticated users
- ✅ **Logout**: Secure session termination
- ✅ **Password Security**: bcrypt hashing with salt

## Pages

### 1. Login Page (`/login`)
- Toggle between login and signup forms
- Login with username and password
- Signup with email, username, and password
- Client-side validation (password length, email format)
- Error handling with user-friendly messages

### 2. OTP Verification Page (`/verify-otp`)
- Email verification with 6-digit OTP
- OTP resend functionality
- 10-minute expiration timer
- Auto-redirect after successful verification

### 3. Protected Main Page (`/`)
- Requires authentication
- Auto-redirects to `/login` if not authenticated
- Logout button in header

## API Routes

### Authentication Endpoints

#### `POST /api/auth/login`
Login with username and password.

**Request:**
```json
{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "userId": 1
}
```

#### `POST /api/auth/send-otp`
Send OTP to email for registration.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please check your inbox."
}
```

#### `POST /api/auth/verify-otp`
Verify OTP and complete registration.

**Request:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "userId": 1
}
```

#### `POST /api/auth/logout`
Clear authentication session.

**Response:**
```json
{
  "success": true
}
```

## Security Features

### 1. Password Hashing
- Uses bcrypt with 10 salt rounds
- Passwords never stored in plain text

### 2. HTTP-Only Cookies
- Session tokens stored in httpOnly cookies
- Cannot be accessed by JavaScript (XSS protection)
- Automatically sent with every request

### 3. OTP Security
- 6-digit random codes
- 10-minute expiration
- Stored in-memory (development) or Redis (production)
- Automatic cleanup after verification or expiration

### 4. Input Validation
- Email format validation
- Password strength requirements (min 6 characters)
- Username/email uniqueness checks

## Middleware Protection

The `middleware.ts` file automatically:
- Redirects unauthenticated users to `/login`
- Prevents authenticated users from accessing `/login` or `/verify-otp`
- Allows public access to static assets and API routes

## Development vs Production

### Development (Current Setup)
- OTP codes printed to console
- In-memory OTP storage
- No email service required

### Production Setup (TODO)

1. **Email Service Integration**
   Update `src/lib/auth.ts` to use a real email service:
   ```typescript
   // Option 1: Nodemailer with Gmail
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASSWORD,
     },
   });

   // Option 2: SendGrid
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

   // Option 3: AWS SES
   const ses = new AWS.SES({ region: process.env.AWS_REGION });
   ```

2. **Redis for OTP Storage**
   Replace in-memory Map with Redis:
   ```typescript
   import { Redis } from '@upstash/redis';
   const redis = new Redis({
     url: process.env.UPSTASH_REDIS_URL,
     token: process.env.UPSTASH_REDIS_TOKEN,
   });
   ```

3. **Environment Variables**
   Add to `.env`:
   ```
   # Email Service (choose one)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   # OR
   SENDGRID_API_KEY=your-sendgrid-key
   # OR
   AWS_SES_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret

   # Redis (production OTP storage)
   UPSTASH_REDIS_URL=your-redis-url
   UPSTASH_REDIS_TOKEN=your-redis-token
   ```

4. **Vercel Environment Variables**
   Add all environment variables in Vercel dashboard:
   - `DATABASE_URL` (Supabase connection string)
   - `DIRECT_URL` (Supabase direct connection)
   - `GEMINI_API_KEY`
   - Email service credentials
   - Redis credentials (if using)

## Testing the Authentication Flow

### 1. First Time User (Signup)
1. Go to `/login`
2. Click "Sign Up" tab
3. Enter email, username, password
4. Click "Sign Up"
5. Check console for OTP code (in development)
6. Enter OTP on verification page
7. Redirected to main chat page

### 2. Returning User (Login)
1. Go to `/login`
2. Enter username and password
3. Click "Login"
4. Redirected to main chat page

### 3. Logout
1. Click user icon in header
2. Click "Log out"
3. Redirected to `/login`

## Database Schema

The authentication system uses the following User model:

```prisma
model User {
  id           Int       @id @default(autoincrement())
  username     String    @unique
  email        String    @unique
  passwordHash String
  createdAt    DateTime  @default(now())
  chats        Chat[]
}
```

## Troubleshooting

### Issue: "OTP not found or expired"
- OTPs expire after 10 minutes
- Request a new OTP using the "Resend" button

### Issue: "Email already registered"
- Use a different email address
- Or login with existing credentials

### Issue: "Username already taken"
- Choose a different username

### Issue: Redirected to `/login` immediately
- Check that cookies are enabled in your browser
- Clear browser cookies and try again
- Check that the `userId` cookie is being set (DevTools → Application → Cookies)

## Next Steps

- [ ] Integrate production email service (SendGrid/AWS SES/Nodemailer)
- [ ] Add Redis for OTP storage in production
- [ ] Implement "Forgot Password" functionality
- [ ] Add rate limiting to prevent brute force attacks
- [ ] Add CAPTCHA for signup/login forms
- [ ] Implement refresh tokens for longer sessions
- [ ] Add 2FA (Two-Factor Authentication) option
- [ ] Create user profile page
- [ ] Add email verification reminders
- [ ] Implement account deletion
