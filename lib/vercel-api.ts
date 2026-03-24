import { Vercel } from '@vercel/sdk'

const VERCEL_API = 'https://api.vercel.com'

function createClient(accessToken: string) {
  return new Vercel({ bearerToken: accessToken })
}

export async function listTeams(accessToken: string) {
  const res = await fetch(`${VERCEL_API}/v2/teams?limit=50`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(`Failed to list teams: ${res.status} ${JSON.stringify(error)}`)
  }

  const data = await res.json()
  return data.teams
}

export async function listProjects(
  accessToken: string,
  teamId?: string,
) {
  const params = new URLSearchParams({ limit: '50' })
  if (teamId) params.set('teamId', teamId)

  const res = await fetch(`${VERCEL_API}/v9/projects?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(`Failed to list projects: ${res.status} ${JSON.stringify(error)}`)
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
    src: string
    srcSyntax: string
    dest: string
  },
) {
  const vercel = createClient(accessToken)
  return await vercel.projectRoutes.addRoute({
    projectId,
    teamId,
    requestBody: {
      route: {
        name: rule.name,
        srcSyntax: rule.srcSyntax as 'path-to-regexp' | 'equals' | 'regex',
        route: {
          src: rule.src,
          dest: rule.dest,
        },
      },
    },
  })
}

export async function publishRoutingRules(
  accessToken: string,
  projectId: string,
  teamId?: string,
) {
  const vercel = createClient(accessToken)

  // Get the staging version ID first
  const versions = await vercel.projectRoutes.getRouteVersions({
    projectId,
    teamId,
  })

  const stagingVersion = versions.versions?.find((v) => v.isStaging)
  if (!stagingVersion) {
    throw new Error('No staging version found to publish')
  }

  return await vercel.projectRoutes.updateRouteVersions({
    projectId,
    teamId,
    requestBody: {
      id: stagingVersion.id,
      action: 'promote',
    },
  })
}
