'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { TeamSelector } from './team-selector'
import { ProjectSelector } from './project-selector'
import { SelectedDisplay } from './selected-display'
import { RouteForm } from './route-form'

interface Team {
  id: string
  slug: string
  name: string | null
}

interface Project {
  id: string
  name: string
}

type Step = 'select-team' | 'select-project' | 'form'
type Status = 'idle' | 'creating' | 'publishing' | 'success' | 'error'

export function DashboardContent() {
  const searchParams = useSearchParams()

  // Step state
  const [step, setStep] = useState<Step>('select-team')

  // Data
  const [teams, setTeams] = useState<Team[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(false)

  // Selection
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Form
  const [name, setName] = useState(searchParams.get('name') || 'Docs Proxy')
  const [sourcePath, setSourcePath] = useState(
    searchParams.get('src') || '/docs/:path*',
  )
  const [destination, setDestination] = useState(
    searchParams.get('dest') || 'https://example.com',
  )
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  // Load teams on mount
  useEffect(() => {
    fetch('/api/teams')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/'
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.error) {
          setError(data.error)
          return
        }
        if (data?.teams) {
          setTeams(data.teams)
        }
      })
      .catch((err) => setError(err.message || 'Failed to load teams'))
      .finally(() => setLoadingTeams(false))
  }, [])

  // Load projects when a team is selected
  const loadProjects = useCallback((teamId: string) => {
    setLoadingProjects(true)
    setProjects([])

    fetch(`/api/projects?teamId=${teamId}`)
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/'
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.projects) {
          setProjects(data.projects)
        }
      })
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoadingProjects(false))
  }, [])

  function handleTeamSelect(team: Team) {
    setSelectedTeam(team)
    setSelectedProject(null)
    setStep('select-project')
    loadProjects(team.id)
  }

  function handleProjectSelect(project: Project) {
    setSelectedProject(project)
    setStep('form')
  }

  function handleChange() {
    setSelectedTeam(null)
    setSelectedProject(null)
    setStep('select-team')
    setError('')
    setStatus('idle')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedProject || !selectedTeam) return

    setStatus('creating')
    setError('')

    try {
      const createRes = await fetch('/api/create-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject.id,
          teamId: selectedTeam.id,
          name,
          src: sourcePath,
          srcSyntax: 'path-to-regexp',
          dest: destination,
        }),
      })

      if (!createRes.ok) {
        const data = await createRes.json()
        throw new Error(data.error || 'Failed to create routing rule')
      }

      setStatus('publishing')

      const publishRes = await fetch('/api/publish-routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject.id,
          teamId: selectedTeam.id,
        }),
      })

      if (!publishRes.ok) {
        const data = await publishRes.json()
        throw new Error(data.error || 'Failed to publish routing rules')
      }

      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStatus('error')
    }
  }

  async function handleSignOut() {
    await fetch('/api/auth/signout', { method: 'POST' })
    window.location.href = '/'
  }

  // Loading state
  if (loadingTeams) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </main>
    )
  }

  // Success state
  if (status === 'success') {
    const teamSlug = selectedTeam?.slug || selectedTeam?.name || ''

    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-7 h-7 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3">
            Route created and published
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">
            The routing rule <strong>{name}</strong> has been created on{' '}
            <strong>{selectedProject?.name}</strong> and is now live on
            Vercel&apos;s CDN.
          </p>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-5 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Source
                </span>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
                  {sourcePath}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Destination
                </span>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono max-w-[200px] truncate">
                  {destination}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Action
                </span>
                <span className="text-sm">Rewrite</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={`https://vercel.com/${teamSlug}/${selectedProject?.name}/cdn/routing`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
            >
              View in Dashboard
            </a>
            <button
              onClick={() => {
                setStatus('idle')
                setStep('select-team')
                setSelectedTeam(null)
                setSelectedProject(null)
                setName(searchParams.get('name') || 'Docs Proxy')
                setSourcePath(searchParams.get('src') || '/docs/:path*')
                setDestination(searchParams.get('dest') || 'https://example.com')
              }}
              className="inline-flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
            >
              Create Another
            </button>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mt-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Main flow: step-based selection + form
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Create a routing rule</h1>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Sign out
          </button>
        </div>

        {step === 'select-team' && (
          <TeamSelector teams={teams} onSelect={handleTeamSelect} />
        )}

        {step === 'select-project' && selectedTeam && (
          <ProjectSelector
            projects={projects}
            teamName={selectedTeam.name || selectedTeam.slug}
            loading={loadingProjects}
            onSelect={handleProjectSelect}
            onBack={() => {
              setSelectedTeam(null)
              setStep('select-team')
            }}
          />
        )}

        {step === 'form' && selectedTeam && selectedProject && (
          <>
            <SelectedDisplay
              teamName={selectedTeam.name || selectedTeam.slug}
              projectName={selectedProject.name}
              onChange={handleChange}
            />
            <RouteForm
              name={name}
              setName={setName}
              sourcePath={sourcePath}
              setSourcePath={setSourcePath}
              destination={destination}
              setDestination={setDestination}
              status={status}
              error={error}
              onSubmit={handleSubmit}
            />
          </>
        )}

        {error && step !== 'form' && (
          <div className="mt-4 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-4 py-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </main>
  )
}
