import { NextResponse } from 'next/server'
import { prisma, initializeSections } from '@/lib/db'

export async function GET() {
  try {
    await initializeSections()
    
    const sections = await prisma.section.findMany({
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: {
        sectionId: 'asc',
      },
    })

    return NextResponse.json({ sections })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sections' },
      { status: 500 }
    )
  }
}

