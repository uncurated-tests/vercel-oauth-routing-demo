import { Vercel } from '@vercel/sdk'

export function createClient(accessToken: string) {
  return new Vercel({ bearerToken: accessToken })
}

export async function listTeams(accessToken: string) {
  const vercel = createClient(accessToken)
  const result = await vercel.teams.getTeams({ limit: 50 })
  return result.teams
}

export async function listProjects(
  accessToken: string,
  teamId?: string,
) {
  const vercel = createClient(accessToken)
  const result = await vercel.projects.getProjects({
    limit: '50',
    teamId,
  })
  if ('projects' in result) {
    return result.projects
  }
  return result
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
