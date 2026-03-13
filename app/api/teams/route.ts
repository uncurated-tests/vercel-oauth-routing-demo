import { cookies } from 'next/headers'
import { listTeams } from '@/lib/vercel-api'

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const teams = await listTeams(accessToken)
    return Response.json({ teams })
  } catch (error) {
    console.error('Failed to list teams:', error)
    return Response.json(
      { error: 'Failed to list teams' },
      { status: 500 },
    )
  }
}
