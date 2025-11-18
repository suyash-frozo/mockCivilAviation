# Admin Console Guide

## Overview

The Admin Console is a separate interface for managing questions and uploading PDFs. It's accessible at `/admin` and is password-protected.

## Access

1. Navigate to: `http://localhost:3000/admin`
2. Default password: `admin123`
3. To change password, set `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env` file

## Features

### 1. Upload PDF
- Upload PDF files containing mock exam questions
- System automatically:
  - Extracts text from PDF
  - Parses questions and options
  - Classifies questions by section using keyword matching
  - Stores questions in database

**How it works:**
- PDFs are parsed to extract question text
- Questions are identified by patterns (numbered questions, A/B/C/D options)
- Each question is classified into one of 8 sections based on keywords
- Questions are saved with their correct answers (if detected)

### 2. Add Question
Manually add questions section by section:
- Select section (Air Law, Meteorology, etc.)
- Enter question text
- Add options (A, B, C, D)
- Mark correct answer
- Add explanation (optional)
- Set difficulty level

### 3. Manage Questions
- View all questions by section
- Edit existing questions
- Delete questions
- Filter by section
- See question statistics

## API Endpoints

### Upload PDF
```
POST /api/upload-pdf
Content-Type: multipart/form-data
Body: { file: File }
```

### Get Questions
```
GET /api/questions?sectionId=air_law&limit=100&offset=0
```

### Create Question
```
POST /api/questions
Content-Type: application/json
Body: {
  sectionId: string,
  questionText: string,
  optionA: string,
  optionB: string,
  optionC: string,
  optionD?: string,
  correctAnswer: 'A' | 'B' | 'C' | 'D',
  explanation?: string,
  difficulty?: 'easy' | 'medium' | 'hard',
  source?: string
}
```

### Update Question
```
PUT /api/questions/[id]
Content-Type: application/json
Body: { ...question fields }
```

### Delete Question
```
DELETE /api/questions/[id]
```

### Get Sections
```
GET /api/sections
```

## Database Structure

### Sections
- `air_law` - Air Law
- `meteorology` - Meteorology
- `principles_of_flight` - Principles of Flight
- `aircraft_general` - Aircraft General
- `human_performance` - Human Performance & Limitations
- `operational_procedures` - Operational Procedures
- `navigation` - Navigation
- `communication` - Communication

### Question Classification

The system uses keyword matching to classify questions:
- **Air Law**: ICAO, EASA, regulation, airspace, ATC, etc.
- **Meteorology**: weather, cloud, wind, temperature, pressure, etc.
- **Principles of Flight**: lift, drag, thrust, aerodynamics, stall, etc.
- **Aircraft General**: engine, propeller, fuel, electrical, systems, etc.
- **Human Performance**: human, physiology, hypoxia, fatigue, etc.
- **Operational Procedures**: procedure, checklist, emergency, SOP, etc.
- **Navigation**: VOR, NDB, GPS, chart, waypoint, heading, etc.
- **Communication**: radio, frequency, phraseology, ATC, etc.

## Tips for PDF Upload

1. **PDF Format**: Works best with PDFs that have:
   - Numbered questions (1., 2., etc.)
   - Clear option markers (A), B), C), D))
   - Answer keys (Answer: A, Correct: B, etc.)

2. **Manual Review**: After uploading, review questions in "Manage Questions" tab
   - Check section classification
   - Verify correct answers
   - Edit if needed

3. **Bulk Upload**: You can upload multiple PDFs one at a time
   - Each PDF is processed independently
   - Questions are tagged with source filename

## Security Note

The current implementation uses a simple password check. For production:
- Implement proper authentication (NextAuth.js, Auth0, etc.)
- Add role-based access control
- Use environment variables for sensitive data
- Add rate limiting for API routes

