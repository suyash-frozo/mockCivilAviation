import { NextRequest, NextResponse } from 'next/server'
import { extractQuestionsWithAI } from '@/lib/ai-pdf-extractor'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Extract text from PDF using pdf-parse (better for Node.js)
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for pdf-parse (CommonJS module)
    const pdfParseModule = await import('pdf-parse')
    // Handle both default and named exports
    const pdfParse = (pdfParseModule as any).default || pdfParseModule
    
    const data = await pdfParse(buffer)
    
    if (!data.text || data.text.length === 0) {
      throw new Error('No text could be extracted from PDF. It may be image-based or encrypted.')
    }
    
    console.log(`Extracted ${data.text.length} characters from ${data.numpages} pages`)
    return data.text
  } catch (error: any) {
    console.error('PDF extraction detailed error:', error)
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

