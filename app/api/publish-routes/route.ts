import { cookies } from 'next/headers'
import { publishRoutingRules } from '@/lib/vercel-api'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { projectId, teamId } = body

    if (!projectId) {
      return Response.json(
        { error: 'Missing projectId' },
        { status: 400 },
      )
    }

    await publishRoutingRules(accessToken, projectId, teamId)
    return Response.json({ success: true })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to publish routing rules'
    console.error('Failed to publish routing rules:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
