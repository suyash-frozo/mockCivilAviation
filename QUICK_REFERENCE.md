# Quick Reference Guide

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Create database
npm run db:push

# 4. Start dev server
npm run dev
```

**Access**:
- Website: http://localhost:3000
- Admin: http://localhost:3000/admin (password: `admin123`)

## 📋 Common Tasks

### Upload Questions from PDF
1. Go to `/admin`
2. Click "Upload PDF" tab
3. Select PDF file
4. Click "Upload and Process PDF"
5. Review in "Manage Questions" tab

### Add Question Manually
1. Go to `/admin`
2. Click "Add Question" tab
3. Select section
4. Fill form
5. Click "Add Question"

### Edit Question
1. Go to `/admin` → "Manage Questions"
2. Select section
3. Click "Edit" on question
4. Make changes
5. Click "Save"

### View Database
```bash
npm run db:studio
```

## 🔑 Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
```

## 📁 Key Files

- **Admin Console**: `app/admin/page.tsx`
- **API Routes**: `app/api/`
- **Database**: `lib/db.ts`
- **PDF Parser**: `lib/pdf-parser.ts`
- **Schema**: `prisma/schema.prisma`

## 🛠 Useful Commands

```bash
npm run dev          # Start development
npm run build        # Build for production
npm run db:generate  # Generate Prisma client
npm run db:push      # Update database schema
npm run db:studio    # Open database GUI
```

## 📞 Need Help?

See `DOCUMENTATION.md` for complete guide.

