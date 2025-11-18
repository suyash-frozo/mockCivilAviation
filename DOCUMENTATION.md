# Civil Aviation Mock Exam Website - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Setup & Installation](#setup--installation)
5. [Project Structure](#project-structure)
6. [Admin Console](#admin-console)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [PDF Processing](#pdf-processing)
10. [Development Guide](#development-guide)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This is a comprehensive web application for Civil Aviation Mock Exam preparation. It includes:

- **Public Website**: Marketing site for the mock exam app
- **Admin Console**: Separate interface for managing questions and uploading PDFs
- **Question Management System**: Upload, classify, and manage exam questions
- **Database**: SQLite database storing questions, sections, and exam sessions

### Exam Sections Covered

1. **Air Law** - Regulations, rules, and legal aspects
2. **Meteorology** - Weather patterns and atmospheric conditions
3. **Principles of Flight** - Aerodynamics and flight mechanics
4. **Aircraft General** - Aircraft systems and structures
5. **Human Performance & Limitations** - Human factors and physiology
6. **Operational Procedures** - Standard operating procedures
7. **Navigation** - Navigation systems and flight planning
8. **Communication** - Radio procedures and phraseology

---

## ✨ Features

### Public Website
- ✅ SEO-optimized homepage
- ✅ Section information display
- ✅ Professional aviation-themed design
- ✅ Mobile-responsive layout
- ✅ Fast loading times

### Admin Console
- ✅ Password-protected admin interface
- ✅ PDF upload and automatic question extraction
- ✅ Manual question addition
- ✅ Question management (view, edit, delete)
- ✅ Section-wise question filtering
- ✅ Statistics dashboard
- ✅ Question classification by section

### Question Management
- ✅ Automatic PDF parsing
- ✅ Intelligent section classification
- ✅ Multiple choice question support (A, B, C, D)
- ✅ Explanation support
- ✅ Difficulty levels
- ✅ Source tracking

---

## 🛠 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **PDF Processing**: pdf-parse
- **File Upload**: Next.js API Routes with FormData

### Key Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "@prisma/client": "^6.19.0",
  "prisma": "^6.19.0",
  "pdf-parse": "^1.1.1",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0"
}
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18.17.0 or higher (recommended: 22.x)
- npm or yarn
- Git

### Step 1: Clone/Download Project

```bash
cd /path/to/CivilAviationMockExam-Website
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin Console Password (optional, defaults to "admin123")
NEXT_PUBLIC_ADMIN_PASSWORD="your-secure-password"
```

### Step 4: Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database and tables
npm run db:push
```

The database will be automatically initialized with default sections when you first access the admin console.

### Step 5: Run Development Server

```bash
# Make sure you're using Node.js 18+
source ~/.nvm/nvm.sh  # If using nvm
nvm use 22.17.1       # Or your Node version

npm run dev
```

### Step 6: Access the Application

- **Public Website**: http://localhost:3000
- **Admin Console**: http://localhost:3000/admin
  - Default password: `admin123`

---

## 📁 Project Structure

```
CivilAviationMockExam-Website/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Admin console page
│   ├── api/
│   │   ├── questions/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts      # Question CRUD operations
│   │   │   └── route.ts          # Questions list & create
│   │   ├── sections/
│   │   │   └── route.ts          # Sections API
│   │   └── upload-pdf/
│   │       └── route.ts          # PDF upload handler
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx    # Main admin dashboard
│   │   ├── PDFUpload.tsx         # PDF upload component
│   │   ├── QuestionForm.tsx      # Add question form
│   │   ├── QuestionManager.tsx   # Question management
│   │   └── StatsPanel.tsx        # Statistics display
│   ├── Header.tsx                # Website header
│   ├── Hero.tsx                  # Hero section
│   ├── Sections.tsx             # Sections display
│   ├── Features.tsx             # Features section
│   ├── PPLInfo.tsx              # PPL information
│   └── Footer.tsx               # Footer
├── lib/
│   ├── db.ts                    # Prisma client & DB utilities
│   ├── pdf-parser.ts            # PDF parsing & classification
│   └── init-db.ts               # Database initialization
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── dev.db                  # SQLite database file
├── public/                      # Static assets
├── .env                         # Environment variables
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
└── package.json                 # Dependencies
```

---

## 🔐 Admin Console

### Access

Navigate to: `http://localhost:3000/admin`

### Login

- Default password: `admin123`
- Change password by setting `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env`

### Features

#### 1. Upload PDF Tab

**Purpose**: Upload PDF files containing mock exam questions

**How to Use**:
1. Click "Select PDF File"
2. Choose a PDF file from your computer
3. Click "Upload and Process PDF"
4. Wait for processing (extraction, classification, storage)
5. Review results and statistics

**What Happens**:
- PDF text is extracted
- Questions are parsed (numbered questions with A/B/C/D options)
- Each question is classified into a section using keyword matching
- Questions are saved to database
- Source filename is recorded

**Tips**:
- PDFs work best with clear formatting:
  - Numbered questions (1., 2., etc.)
  - Option markers (A), B), C), D))
  - Answer keys (Answer: A, Correct: B)
- Review questions after upload in "Manage Questions" tab
- You can upload multiple PDFs

#### 2. Add Question Tab

**Purpose**: Manually add questions section by section

**How to Use**:
1. Select a section from dropdown
2. Enter question text
3. Fill in options (A, B, C required; D optional)
4. Select correct answer (A, B, C, or D)
5. Add explanation (optional)
6. Set difficulty level (easy, medium, hard)
7. Click "Add Question"

**Use Cases**:
- Adding questions not in PDFs
- Correcting misclassified questions
- Adding custom questions

#### 3. Manage Questions Tab

**Purpose**: View, edit, and delete questions

**Features**:
- Filter by section
- View all question details
- Edit questions inline
- Delete questions with confirmation
- See question statistics per section

**How to Edit**:
1. Click "Edit" on any question
2. Modify fields inline
3. Click "Save" to update
4. Click "Cancel" to discard changes

**How to Delete**:
1. Click "Delete" on a question
2. Confirm deletion
3. Question is permanently removed

---

## 📡 API Documentation

### Base URL

All API routes are prefixed with `/api`

### Authentication

Currently, admin routes are protected by password. For production, implement proper authentication.

### Endpoints

#### 1. Get Sections

```http
GET /api/sections
```

**Response**:
```json
{
  "sections": [
    {
      "id": "clx...",
      "sectionId": "air_law",
      "name": "Air Law",
      "description": "Regulations, rules, and legal aspects",
      "icon": "⚖️",
      "_count": {
        "questions": 45
      }
    }
  ]
}
```

#### 2. Get Questions

```http
GET /api/questions?sectionId=air_law&limit=100&offset=0
```

**Query Parameters**:
- `sectionId` (optional): Filter by section
- `limit` (optional, default: 100): Number of questions
- `offset` (optional, default: 0): Pagination offset

**Response**:
```json
{
  "questions": [
    {
      "id": "clx...",
      "sectionId": "air_law",
      "questionText": "What is ICAO?",
      "optionA": "International Civil Aviation Organization",
      "optionB": "International Commercial Aviation Organization",
      "optionC": "International Civil Air Organization",
      "optionD": null,
      "correctAnswer": "A",
      "explanation": "ICAO stands for...",
      "difficulty": "medium",
      "source": "manual",
      "section": {
        "name": "Air Law",
        "sectionId": "air_law"
      }
    }
  ],
  "total": 45,
  "limit": 100,
  "offset": 0
}
```

#### 3. Create Question

```http
POST /api/questions
Content-Type: application/json
```

**Request Body**:
```json
{
  "sectionId": "air_law",
  "questionText": "What is ICAO?",
  "optionA": "International Civil Aviation Organization",
  "optionB": "International Commercial Aviation Organization",
  "optionC": "International Civil Air Organization",
  "optionD": "International Commercial Air Organization",
  "correctAnswer": "A",
  "explanation": "ICAO stands for International Civil Aviation Organization",
  "difficulty": "medium",
  "source": "manual"
}
```

**Response**:
```json
{
  "success": true,
  "question": { ... }
}
```

#### 4. Get Single Question

```http
GET /api/questions/[id]
```

**Response**:
```json
{
  "question": { ... }
}
```

#### 5. Update Question

```http
PUT /api/questions/[id]
Content-Type: application/json
```

**Request Body**: (all fields optional)
```json
{
  "questionText": "Updated question",
  "optionA": "Updated option A",
  "correctAnswer": "B"
}
```

**Response**:
```json
{
  "success": true,
  "question": { ... }
}
```

#### 6. Delete Question

```http
DELETE /api/questions/[id]
```

**Response**:
```json
{
  "success": true,
  "message": "Question deleted"
}
```

#### 7. Upload PDF

```http
POST /api/upload-pdf
Content-Type: multipart/form-data
```

**Request**: FormData with `file` field containing PDF

**Response**:
```json
{
  "success": true,
  "message": "Processed 25 questions",
  "saved": 23,
  "errors": 2,
  "details": {
    "savedQuestions": 23,
    "errors": ["Question skipped: Insufficient options..."]
  }
}
```

---

## 🗄 Database Schema

### Section Model

```prisma
model Section {
  id          String        @id @default(cuid())
  sectionId   String        @unique
  name        String
  description String?
  icon        String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  questions   Question[]
  examSessions ExamSession[]
}
```

**Fields**:
- `sectionId`: Unique identifier (air_law, meteorology, etc.)
- `name`: Display name
- `description`: Section description
- `icon`: Emoji icon

### Question Model

```prisma
model Question {
  id            String       @id @default(cuid())
  sectionId     String
  section       Section      @relation(...)
  questionText  String
  optionA       String
  optionB       String
  optionC       String
  optionD       String?
  correctAnswer String       // A, B, C, or D
  explanation   String?
  difficulty    String?      @default("medium")
  source        String?     // PDF filename or "manual"
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  examAnswers   ExamAnswer[]
}
```

**Fields**:
- `questionText`: The question
- `optionA/B/C/D`: Answer options (D is optional)
- `correctAnswer`: A, B, C, or D
- `explanation`: Why the answer is correct
- `difficulty`: easy, medium, or hard
- `source`: Where the question came from

### ExamSession Model

```prisma
model ExamSession {
  id            String      @id @default(cuid())
  sectionId     String
  section       Section     @relation(...)
  score         Int         @default(0)
  totalQuestions Int
  correctAnswers Int        @default(0)
  completed     Boolean     @default(false)
  createdAt     DateTime    @default(now())
  answers       ExamAnswer[]
}
```

### ExamAnswer Model

```prisma
model ExamAnswer {
  id            String      @id @default(cuid())
  sessionId     String
  session       ExamSession @relation(...)
  questionId    String
  question      Question    @relation(...)
  selectedAnswer String
  isCorrect     Boolean     @default(false)
  createdAt     DateTime    @default(now())
}
```

---

## 📄 PDF Processing

### How It Works

1. **Text Extraction**: PDF is parsed to extract all text
2. **Question Parsing**: Text is analyzed to find:
   - Numbered questions (1., 2., etc.)
   - Options marked with A), B), C), D)
   - Answer keys (Answer: A, Correct: B)
   - Explanations (if present)
3. **Classification**: Each question is classified into a section using keyword matching
4. **Storage**: Questions are saved to database with metadata

### Classification Algorithm

The system uses keyword matching to classify questions:

- **Air Law**: ICAO, EASA, regulation, airspace, ATC, clearance, etc.
- **Meteorology**: weather, cloud, wind, temperature, pressure, front, etc.
- **Principles of Flight**: lift, drag, thrust, aerodynamics, stall, etc.
- **Aircraft General**: engine, propeller, fuel, electrical, systems, etc.
- **Human Performance**: human, physiology, hypoxia, fatigue, etc.
- **Operational Procedures**: procedure, checklist, emergency, SOP, etc.
- **Navigation**: VOR, NDB, GPS, chart, waypoint, heading, etc.
- **Communication**: radio, frequency, phraseology, ATC, etc.

**Default**: If no keywords match, question is classified as "Air Law"

### PDF Format Recommendations

For best results, PDFs should have:
- ✅ Clear question numbering (1., 2., 3.)
- ✅ Option markers (A), B), C), D))
- ✅ Answer keys (Answer: A, Correct: B)
- ✅ Consistent formatting
- ✅ Text-based (not scanned images)

---

## 💻 Development Guide

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio (GUI)

# Build
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Adding New Sections

1. Update `lib/db.ts` - Add section to `initializeSections()` function
2. Update `components/Sections.tsx` - Add section to sections array
3. Run `npm run db:push` to update database

### Modifying Question Classification

Edit `lib/pdf-parser.ts` - Update `classifyQuestion()` function:
- Add keywords to `sectionKeywords` object
- Adjust scoring algorithm if needed

### Customizing Styles

- Edit `tailwind.config.js` for theme colors
- Modify component files for layout changes
- Update `app/globals.css` for global styles

### Database Migrations

For production, use Prisma migrations:

```bash
npx prisma migrate dev --name migration_name
```

---

## 🚢 Deployment

### Prerequisites

- Node.js 18+ on server
- Database (SQLite for development, PostgreSQL/MySQL for production)

### Environment Variables

Set these in your hosting platform:

```env
DATABASE_URL="file:./prisma/prod.db"  # Or PostgreSQL/MySQL URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_ADMIN_PASSWORD="secure-password"
```

### Deployment Options

#### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
npm install -g vercel
vercel
```

#### Other Platforms

- **Netlify**: Connect GitHub repo, set build command: `npm run build`
- **Railway**: Connect repo, set start command: `npm start`
- **AWS/Google Cloud**: Use Docker or serverless functions

### Database Considerations

**Development**: SQLite (file-based, easy setup)

**Production**: 
- PostgreSQL (recommended)
- MySQL
- SQLite (for small deployments)

To switch to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

3. Run migrations:
```bash
npx prisma migrate deploy
```

---

## 🔧 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"

**Solution**:
```bash
npm run db:generate
```

### Issue: "Database not initialized"

**Solution**: The database auto-initializes when you access `/api/sections`. Or manually:
```bash
npm run db:push
```

### Issue: "PDF upload fails"

**Check**:
- PDF is not corrupted
- PDF contains text (not just images)
- File size is reasonable (< 50MB)

### Issue: "Questions not classified correctly"

**Solution**:
- Review questions in admin console
- Manually edit section if needed
- Update keywords in `lib/pdf-parser.ts`

### Issue: "Node version error"

**Solution**: Use Node.js 18+:
```bash
nvm use 22.17.1  # Or your Node version
```

### Issue: "Port 3000 already in use"

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## 📝 Notes

- The admin console uses simple password authentication. For production, implement proper auth (NextAuth.js, Auth0, etc.)
- PDF parsing works best with well-formatted PDFs. Manual review is recommended
- Database is SQLite by default. Consider PostgreSQL for production
- All questions are stored locally. Consider backup strategy
- The system automatically classifies questions, but manual review is recommended

---

## 🆘 Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Check server logs
4. Review Prisma logs: `npx prisma studio`

---

## 📄 License

This project is for Civil Aviation Mock Exam application.

---

**Last Updated**: November 2024
**Version**: 1.0.0

