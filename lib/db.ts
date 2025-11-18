import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Initialize default sections
export async function initializeSections() {
  const sections = [
    {
      sectionId: 'air_law',
      name: 'Air Law',
      description: 'Regulations, rules, and legal aspects of aviation',
      icon: '⚖️',
    },
    {
      sectionId: 'meteorology',
      name: 'Meteorology',
      description: 'Weather patterns, atmospheric conditions, and forecasting',
      icon: '🌤️',
    },
    {
      sectionId: 'principles_of_flight',
      name: 'Principles of Flight',
      description: 'Aerodynamics, flight mechanics, and aircraft performance',
      icon: '✈️',
    },
    {
      sectionId: 'aircraft_general',
      name: 'Aircraft General',
      description: 'Aircraft systems, structures, and general knowledge',
      icon: '🔧',
    },
    {
      sectionId: 'human_performance',
      name: 'Human Performance & Limitations',
      description: 'Human factors, physiology, and psychological aspects',
      icon: '🧠',
    },
    {
      sectionId: 'operational_procedures',
      name: 'Operational Procedures',
      description: 'Standard operating procedures and best practices',
      icon: '📋',
    },
    {
      sectionId: 'navigation',
      name: 'Navigation',
      description: 'Navigation systems, charts, and flight planning',
      icon: '🧭',
    },
    {
      sectionId: 'communication',
      name: 'Communication',
      description: 'Radio procedures, phraseology, and communication protocols',
      icon: '📻',
    },
  ]

  for (const section of sections) {
    await prisma.section.upsert({
      where: { sectionId: section.sectionId },
      update: section,
      create: section,
    })
  }
}

