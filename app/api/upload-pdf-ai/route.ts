import { NextRequest, NextResponse } from 'next/server'
import { extractQuestionsWithAI } from '@/lib/ai-pdf-extractor'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Extract text from PDF using pdfjs-dist
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js')
    
    if (pdfjs.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = ''
    }
    
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

export async function POST(request: NextRequest) {
  try {
    console.log('AI PDF upload request received')
    
    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          details: 'Please set OPENAI_API_KEY environment variable'
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    console.log(`Processing file with AI: ${file.name}, size: ${file.size} bytes`)

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

    // Check if text is too long (OpenAI has token limits)
    const estimatedTokens = text.length / 4 // Rough estimate
    if (estimatedTokens > 100000) {
      return NextResponse.json(
        { 
          error: 'PDF too large',
          details: 'The PDF contains too much text. Please split it into smaller files (under 25 pages).'
        },
        { status: 400 }
      )
    }
    
    // Extract questions using AI
    let extractedQuestions
    try {
      extractedQuestions = await extractQuestionsWithAI(text, openaiApiKey)
      console.log(`AI extracted ${extractedQuestions.length} questions from PDF`)
    } catch (aiError: any) {
      console.error('AI extraction error:', aiError)
      return NextResponse.json(
        { error: `AI extraction failed: ${aiError.message}` },
        { status: 500 }
      )
    }

    // Return extracted questions for review (don't save yet)
    return NextResponse.json({
      success: true,
      message: `Extracted ${extractedQuestions.length} questions for review`,
      questions: extractedQuestions,
      source: file.name,
    })
  } catch (error: any) {
    console.error('AI PDF upload error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process PDF with AI',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

