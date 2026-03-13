const VERCEL_API = 'https://api.vercel.com'

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

export async function listProjects(
  accessToken: string,
): Promise<VercelProject[]> {
  const res = await fetch(`${VERCEL_API}/v9/projects?limit=50`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    throw new Error(`Failed to list projects: ${res.status}`)
  }

  const data = await res.json()
  return data.projects
}

export async function createRoutingRule(
  accessToken: string,
  projectId: string,
  rule: {
    name: string
    path: string
    syntax: string
    actions: Array<{ type: string; dest: string }>
  },
): Promise<RoutingRule> {
  const res = await fetch(
    `${VERCEL_API}/v1/projects/${projectId}/routing-rules`,
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
): Promise<void> {
  const res = await fetch(
    `${VERCEL_API}/v1/projects/${projectId}/routing-rules/publish`,
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
