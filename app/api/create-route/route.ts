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
    const { projectId, teamId, name, src, srcSyntax, dest } = body

    if (!projectId || !name || !src || !dest) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const result = await createRoutingRule(accessToken, projectId, teamId, {
      name,
      src,
      srcSyntax: srcSyntax || 'path-to-regexp',
      dest,
    })

    return Response.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create routing rule'
    console.error('Failed to create routing rule:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
