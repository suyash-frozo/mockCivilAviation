import { NextRequest, NextResponse } from 'next/server'
import { prisma, initializeSections } from '@/lib/db'

// GET - Fetch questions (with optional section filter)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sectionId = searchParams.get('sectionId')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where = sectionId ? { sectionId } : {}

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          section: {
            select: {
              name: true,
              sectionId: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.question.count({ where }),
    ])

    return NextResponse.json({
      questions,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

// POST - Create a new question
export async function POST(request: NextRequest) {
  try {
    await initializeSections()

    const body = await request.json()
    const {
      sectionId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
      difficulty,
      source,
    } = body

    // Validate required fields
    if (!sectionId || !questionText || !optionA || !optionB || !optionC || !correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate correct answer
    if (!['A', 'B', 'C', 'D'].includes(correctAnswer.toUpperCase())) {
      return NextResponse.json(
        { error: 'Correct answer must be A, B, C, or D' },
        { status: 400 }
      )
    }

    // Check if section exists
    const section = await prisma.section.findUnique({
      where: { sectionId },
    })

    if (!section) {
      return NextResponse.json(
        { error: `Section not found: ${sectionId}` },
        { status: 404 }
      )
    }

    const question = await prisma.question.create({
      data: {
        sectionId,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD: optionD || null,
        correctAnswer: correctAnswer.toUpperCase(),
        explanation: explanation || null,
        difficulty: difficulty || 'medium',
        source: source || 'manual',
      },
      include: {
        section: {
          select: {
            name: true,
            sectionId: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, question }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create question' },
      { status: 500 }
    )
  }
}

