import { NextRequest, NextResponse } from 'next/server'
import { prisma, initializeSections } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    await initializeSections()

    const body = await request.json()
    const { questions, source } = body

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions provided' },
        { status: 400 }
      )
    }

    const savedQuestions = []
    const errors = []

    for (const q of questions) {
      try {
        // Validate required fields
        if (
          !q.sectionId ||
          !q.questionText ||
          !q.optionA ||
          !q.optionB ||
          !q.optionC ||
          !q.correctAnswer
        ) {
          errors.push(`Question skipped: Missing required fields - "${q.questionText?.substring(0, 50)}..."`)
          continue
        }

        // Check if section exists
        const section = await prisma.section.findUnique({
          where: { sectionId: q.sectionId },
        })

        if (!section) {
          errors.push(`Section not found: ${q.sectionId}`)
          continue
        }

        // Save question
        const question = await prisma.question.create({
          data: {
            sectionId: q.sectionId,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD || null,
            correctAnswer: q.correctAnswer.toUpperCase(),
            explanation: q.explanation || null,
            source: source || 'AI extraction',
            difficulty: q.difficulty || 'medium',
          },
        })

        savedQuestions.push(question)
      } catch (error: any) {
        errors.push(`Error saving question: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Saved ${savedQuestions.length} questions`,
      saved: savedQuestions.length,
      errors: errors.length,
      details: {
        savedQuestions: savedQuestions.length,
        errors: errors.slice(0, 10),
      },
    })
  } catch (error: any) {
    console.error('Bulk question save error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save questions' },
      { status: 500 }
    )
  }
}

