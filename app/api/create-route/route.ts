import { cookies } from 'next/headers'
import { createRoutingRule } from '@/lib/vercel-api'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { projectId, teamId, name, path, syntax, actions } = body

    if (!projectId || !name || !path || !actions) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const rule = await createRoutingRule(accessToken, projectId, teamId, {
      name,
      path,
      syntax: syntax || 'path-to-regexp',
      actions,
    })

    return Response.json(rule)
  } catch (error) {
    console.error('Failed to create routing rule:', error)
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create routing rule',
      },
      { status: 500 },
    )
  }
}
