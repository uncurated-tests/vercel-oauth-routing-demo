import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'
import { listProjects } from '@/lib/vercel-api'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const teamId = request.nextUrl.searchParams.get('teamId') || undefined

  try {
    const projects = await listProjects(accessToken, teamId)
    return Response.json({ projects })
  } catch (error) {
    console.error('Failed to list projects:', error)
    return Response.json(
      { error: 'Failed to list projects' },
      { status: 500 },
    )
  }
}
