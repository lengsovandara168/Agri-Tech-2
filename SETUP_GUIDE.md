# Gemini AI Chatbot Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-gemini-api-key-here"
UPLOAD_FOLDER="./public/static/uploads"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Get your Gemini API key**: https://aistudio.google.com/app/apikey

### 3. Initialize Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📁 Project Structure

```
my-project/
├── prisma/
│   └── schema.prisma          # Database schema (User, Chat, Message)
├── public/
│   └── static/
│       └── uploads/           # Image uploads directory
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/     # POST /api/auth/login
│   │   │   │   ├── send-otp/  # POST /api/auth/send-otp
│   │   │   │   └── verify-otp/ # POST /api/auth/verify-otp
│   │   │   └── chat/
│   │   │       ├── chats/     # GET /api/chat/chats (list all)
│   │   │       ├── delete-all/ # DELETE /api/chat/delete-all
│   │   │       ├── get-response/ # POST /api/chat/get-response
│   │   │       ├── load/      # GET /api/chat/load/[chatId]
│   │   │       └── rename/    # PUT /api/chat/rename
│   │   ├── components/        # React components
│   │   └── style/             # Global styles
│   └── lib/
│       ├── auth.ts            # Authentication utilities
│       ├── config.ts          # App configuration
│       ├── db.ts              # Prisma client
│       └── gemini.ts          # Gemini AI integration
└── .env                       # Environment variables
```

---

## 🔧 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (Prisma ORM)
- **AI**: Google Gemini 1.5 Flash
- **Authentication**: bcrypt password hashing + OTP verification
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Radix UI primitives

---

## 🔐 Authentication Flow

### Registration (Sign Up)
1. **Send OTP**: `POST /api/auth/send-otp`
   ```json
   {
     "username": "john_doe",
     "email": "john@example.com",
     "password": "securepass123"
   }
   ```
   - Validates input
   - Checks for existing users
   - Generates 6-digit OTP
   - Stores OTP in memory (expires in 10 minutes)
   - Logs OTP to console (email sending not configured)

2. **Verify OTP**: `POST /api/auth/verify-otp`
   ```json
   {
     "email": "john@example.com",
     "otp": "123456"
   }
   ```
   - Verifies OTP
   - Creates user account
   - Sets `isVerified: true`

### Login
`POST /api/auth/login`
```json
{
  "username": "john_doe",
  "password": "securepass123"
}
```
- Verifies credentials
- Checks if user is verified
- Returns user data

---

## 💬 Chat API Endpoints

### Get All Chats
```http
GET /api/chat/chats?userId=1
```
Returns list of all chats for the user.

### Create/Continue Chat
```http
POST /api/chat/get-response
Content-Type: application/json

{
  "userId": 1,
  "chatId": null,  // null for new chat, or existing chat ID
  "query": "What are the best crops for winter?",
  "image": null,   // optional: base64 image data
  "mimeType": null // optional: "image/png" or "image/jpeg"
}
```

**Response:**
```json
{
  "success": true,
  "chatId": 1,
  "response": "AI response here..."
}
```

### Load Chat History
```http
GET /api/chat/load/1?userId=1
```

### Rename Chat
```http
PUT /api/chat/rename
Content-Type: application/json

{
  "chatId": 1,
  "userId": 1,
  "newTitle": "Winter Crop Guide"
}
```

### Delete Chat
```http
DELETE /api/chat/chats?chatId=1&userId=1
```

### Delete All Chats
```http
DELETE /api/chat/delete-all?userId=1
```

---

## 🤖 Gemini AI Integration

The chatbot uses Google's Gemini 1.5 Flash model with three query modes:

### 1. Text Only
```typescript
import { queryText } from '@/lib/gemini';
const response = await queryText("Explain photosynthesis");
```

### 2. Image Only
```typescript
import { queryImage } from '@/lib/gemini';
const response = await queryImage(base64Image, "image/jpeg");
```

### 3. Text + Image
```typescript
import { queryTextWithImage } from '@/lib/gemini';
const response = await queryTextWithImage(
  "What plant disease is this?",
  base64Image,
  "image/jpeg"
);
```

---

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  email        String   @unique
  passwordHash String
  isVerified   Boolean  @default(false)
  chats        Chat[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Chat Model
```prisma
model Chat {
  id        Int       @id @default(autoincrement())
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  title     String
  messages  Message[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Message Model
```prisma
model Message {
  id        Int      @id @default(autoincrement())
  chatId    Int
  chat      Chat     @relation(fields: [chatId], references: [id])
  sender    String   // "user" or "assistant"
  message   String
  imagePath String?
  timestamp DateTime @default(now())
}
```

---

## 🎨 Frontend Features

### ChatApp Component
- Multi-chat management
- Image upload with compression (max 1280px, 80% quality)
- Real-time message display
- Auto-scroll to latest message
- Session persistence

### ChatInput Component
- 🎤 Voice input (Speech-to-Text) for Khmer language
- 📷 Image attachment with preview
- Multi-line textarea with auto-resize
- Send on Enter, newline on Shift+Enter

### Sidebar Component
- Chat history list
- Rename/delete chat actions
- New chat button
- Collapsible design

---

## 🚧 Development Notes

### OTP Email Sending
Currently, OTPs are logged to the console. To enable email sending:

1. Install email package:
   ```bash
   npm install nodemailer
   npm install -D @types/nodemailer
   ```

2. Update `.env`:
   ```env
   EMAIL_SERVICE="gmail"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-app-password"
   ```

3. Uncomment email code in `src/lib/auth.ts` (line 113-132)

### Session Management
The current implementation returns user data on login. Consider adding:
- **NextAuth.js** for full session management
- **JWT tokens** for API authentication
- **HTTP-only cookies** for secure sessions

### Production Checklist
- [ ] Replace SQLite with PostgreSQL
- [ ] Set up Redis for OTP storage
- [ ] Configure email service (SendGrid, AWS SES, etc.)
- [ ] Add rate limiting
- [ ] Enable CORS for production domains
- [ ] Set up cloud storage (AWS S3, Cloudinary) for images
- [ ] Add input sanitization
- [ ] Implement CSRF protection
- [ ] Set up monitoring (Sentry, LogRocket)

---

## 📦 Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# View database in browser
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

---

## 🐛 Troubleshooting

### Error: GEMINI_API_KEY is not defined
**Solution**: Add your API key to `.env` file

### Error: Can't reach database server
**Solution**: Run `npx prisma generate` and `npx prisma migrate dev`

### OTP not working
**Solution**: Check console logs for OTP code (email sending is disabled by default)

### Images not uploading
**Solution**: Ensure `public/static/uploads/` directory exists and has write permissions

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Gemini AI API](https://ai.google.dev/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

---

## 🎯 Next Steps

1. **Get Gemini API Key**: Visit https://aistudio.google.com/app/apikey
2. **Configure `.env`**: Add your API key
3. **Start Development**: Run `npm run dev`
4. **Test Registration**: Create an account (check console for OTP)
5. **Test Chat**: Start chatting with the AI!

---

## 📄 License

MIT
