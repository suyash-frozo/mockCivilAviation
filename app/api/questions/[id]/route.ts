import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch single question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        section: {
          select: {
            name: true,
            sectionId: true,
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ question })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch question' },
      { status: 500 }
    )
  }
}

// PUT - Update question
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    } = body

    // Validate correct answer if provided
    if (correctAnswer && !['A', 'B', 'C', 'D'].includes(correctAnswer.toUpperCase())) {
      return NextResponse.json(
        { error: 'Correct answer must be A, B, C, or D' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (sectionId) updateData.sectionId = sectionId
    if (questionText) updateData.questionText = questionText
    if (optionA) updateData.optionA = optionA
    if (optionB) updateData.optionB = optionB
    if (optionC) updateData.optionC = optionC
    if (optionD !== undefined) updateData.optionD = optionD
    if (correctAnswer) updateData.correctAnswer = correctAnswer.toUpperCase()
    if (explanation !== undefined) updateData.explanation = explanation
    if (difficulty) updateData.difficulty = difficulty

    const question = await prisma.question.update({
      where: { id: params.id },
      data: updateData,
      include: {
        section: {
          select: {
            name: true,
            sectionId: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, question })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update question' },
      { status: 500 }
    )
  }
}

// DELETE - Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.question.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Question deleted' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete question' },
      { status: 500 }
    )
  }
}

