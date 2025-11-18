import bcrypt from 'bcryptjs';

// In-memory OTP storage (for development - use Redis in production)
const otpStore = new Map<
  string,
  {
    otp: string;
    username: string;
    email: string;
    passwordHash: string;
    expiresAt: number;
  }
>();

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP with user data
 */
export function storeOTP(
  email: string,
  otp: string,
  userData: {
    username: string;
    email: string;
    passwordHash: string;
  }
): void {
  // OTP expires in 10 minutes
  const expiresAt = Date.now() + 10 * 60 * 1000;

  otpStore.set(email, {
    otp,
    ...userData,
    expiresAt,
  });

  // Clean up expired OTPs
  setTimeout(() => {
    otpStore.delete(email);
  }, 10 * 60 * 1000);
}

/**
 * Verify OTP and return user data if valid
 */
export function verifyOTP(
  email: string,
  otp: string
): {
  valid: boolean;
  error?: string;
  data?: {
    username: string;
    email: string;
    passwordHash: string;
  };
} {
  const stored = otpStore.get(email);

  if (!stored) {
    return {
      valid: false,
      error: 'OTP not found or expired. Please request a new one.',
    };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return {
      valid: false,
      error: 'OTP has expired. Please request a new one.',
    };
  }

  if (stored.otp !== otp) {
    return {
      valid: false,
      error: 'Invalid OTP. Please check and try again.',
    };
  }

  // OTP is valid, return user data and clean up
  const userData = {
    username: stored.username,
    email: stored.email,
    passwordHash: stored.passwordHash,
  };

  otpStore.delete(email);

  return {
    valid: true,
    data: userData,
  };
}

/**
 * Send OTP via email (mock implementation - integrate with real email service)
 */
export async function sendOTPEmail(
  email: string,
  otp: string
): Promise<boolean> {
  // TODO: Integrate with real email service (SendGrid, AWS SES, Nodemailer, etc.)
  console.log(`📧 OTP for ${email}: ${otp}`);
  console.log('Note: Email sending is not configured. Check console for OTP.');

  // In production, replace this with actual email sending logic:
  /*
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`,
  });
  */

  return true;
}
