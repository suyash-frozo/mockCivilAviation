import { prisma, initializeSections } from './db'

async function main() {
  console.log('Initializing database...')
  await initializeSections()
  console.log('Database initialized successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

