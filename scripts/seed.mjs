// Seed script - calls the /api/seed endpoint to populate the database
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function seed() {
  try {
    console.log('Seeding database...')
    const res = await fetch(`${BASE_URL}/api/seed`, { method: 'POST' })
    const data = await res.json()
    if (res.ok) {
      console.log('Seeded successfully:', data)
    } else {
      console.error('Seed failed:', data.error)
    }
  } catch (error) {
    console.error('Error seeding:', error.message)
  }
}

seed()
