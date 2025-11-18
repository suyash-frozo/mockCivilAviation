import { NextRequest, NextResponse } from 'next/server'
import { prisma, initializeSections } from '@/lib/db'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Use pdfjs-dist directly to avoid pdf-parse issues
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js')
    
    // Disable worker for server-side
    if (pdfjs.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = ''
    }
    
    // Convert Buffer to Uint8Array as required by pdfjs-dist
    const uint8Array = new Uint8Array(buffer)
    
    const loadingTask = pdfjs.getDocument({ 
      data: uint8Array,
      useSystemFonts: true,
    })
    const pdf = await loadingTask.promise
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }
    
    return fullText
  } catch (error: any) {
    throw new Error(`Failed to parse PDF: ${error.message || error}`)
  }
}

// Import parsing functions
import { parseQuestionsFromText, classifyQuestion } from '@/lib/pdf-parser'

export async function POST(request: NextRequest) {
  try {
    console.log('PDF upload request received')
    
    // Initialize sections if not exists
    try {
      await initializeSections()
      console.log('Sections initialized')
    } catch (initError: any) {
      console.error('Error initializing sections:', initError)
      return NextResponse.json(
        { error: `Database initialization failed: ${initError.message}` },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    console.log(`Processing file: ${file.name}, size: ${file.size} bytes`)

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text from PDF
    let text: string
    try {
      text = await extractTextFromPDF(buffer)
      console.log(`Extracted ${text.length} characters from PDF: ${file.name}`)
    } catch (pdfError: any) {
      console.error('PDF extraction error:', pdfError)
      return NextResponse.json(
        { error: `Failed to extract text from PDF: ${pdfError.message}` },
        { status: 500 }
      )
    }
    
    // Parse questions
    let extractedQuestions
    try {
      extractedQuestions = parseQuestionsFromText(text, file.name)
      console.log(`Parsed ${extractedQuestions.length} questions from PDF`)
    } catch (parseError: any) {
      console.error('Question parsing error:', parseError)
      return NextResponse.json(
        { error: `Failed to parse questions: ${parseError.message}` },
        { status: 500 }
      )
    }

    // Classify and save questions
    const savedQuestions = []
    const errors = []

    for (const q of extractedQuestions) {
      try {
        // Classify question if section not provided
        const sectionId = q.section || classifyQuestion(q.questionText, q.options)

        // Validate we have at least 2 options (changed from 3 to be more flexible)
        if (q.options.length < 2) {
          errors.push(`Question skipped: Insufficient options - "${q.questionText.substring(0, 50)}..."`)
          continue
        }

        // Get or create section
        const section = await prisma.section.findUnique({
          where: { sectionId },
        })

        if (!section) {
          errors.push(`Section not found: ${sectionId}`)
          continue
        }

        // Save question
        const question = await prisma.question.create({
          data: {
            sectionId,
            questionText: q.questionText,
            optionA: q.options[0] || '',
            optionB: q.options[1] || '',
            optionC: q.options[2] || '',
            optionD: q.options[3] || null,
            correctAnswer: q.correctAnswer || 'A',
            explanation: q.explanation || null,
            source: file.name,
            difficulty: 'medium',
          },
        })

        savedQuestions.push(question)
      } catch (error: any) {
        errors.push(`Error saving question: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${extractedQuestions.length} questions`,
      saved: savedQuestions.length,
      errors: errors.length,
      details: {
        savedQuestions: savedQuestions.length,
        errors: errors.slice(0, 10), // Return first 10 errors
      },
    })
  } catch (error: any) {
    console.error('PDF upload error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process PDF',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

