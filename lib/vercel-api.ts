const VERCEL_API = 'https://api.vercel.com'

export interface VercelTeam {
  id: string
  slug: string
  name: string | null
}

export interface VercelProject {
  id: string
  name: string
  framework: string | null
  updatedAt: number
}

export interface RoutingRule {
  id: string
  name: string
  path: string
  syntax: string
  actions: Array<{ type: string; dest?: string }>
}

export async function listTeams(
  accessToken: string,
): Promise<VercelTeam[]> {
  const res = await fetch(`${VERCEL_API}/v2/teams?limit=50`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(
      `Failed to list teams: ${res.status} ${JSON.stringify(error)}`,
    )
  }

  const data = await res.json()
  return data.teams
}

export async function listProjects(
  accessToken: string,
  teamId?: string,
): Promise<VercelProject[]> {
  const params = new URLSearchParams({ limit: '50' })
  if (teamId) {
    params.set('teamId', teamId)
  }

  const res = await fetch(`${VERCEL_API}/v9/projects?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(
      `Failed to list projects: ${res.status} ${JSON.stringify(error)}`,
    )
  }

  const data = await res.json()
  return data.projects
}

export async function createRoutingRule(
  accessToken: string,
  projectId: string,
  teamId: string | undefined,
  rule: {
    name: string
    path: string
    syntax: string
    actions: Array<{ type: string; dest: string }>
  },
): Promise<RoutingRule> {
  const params = teamId ? `?teamId=${teamId}` : ''
  const res = await fetch(
    `${VERCEL_API}/v1/projects/${projectId}/routing-rules${params}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    },
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(
      `Failed to create routing rule: ${JSON.stringify(error)}`,
    )
  }

  return await res.json()
}

export async function publishRoutingRules(
  accessToken: string,
  projectId: string,
  teamId?: string,
): Promise<void> {
  const params = teamId ? `?teamId=${teamId}` : ''
  const res = await fetch(
    `${VERCEL_API}/v1/projects/${projectId}/routing-rules/publish${params}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(
      `Failed to publish routing rules: ${JSON.stringify(error)}`,
    )
  }
}
