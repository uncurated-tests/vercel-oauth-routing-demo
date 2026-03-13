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
    const { projectId } = body

    if (!projectId) {
      return Response.json(
        { error: 'Missing projectId' },
        { status: 400 },
      )
    }

    await publishRoutingRules(accessToken, projectId)
    return Response.json({ success: true })
  } catch (error) {
    console.error('Failed to publish routing rules:', error)
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to publish routing rules',
      },
      { status: 500 },
    )
  }
}
