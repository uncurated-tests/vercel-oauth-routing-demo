'use client'

import { useEffect, useState } from 'react'

interface Project {
  id: string
  name: string
  framework: string | null
  updatedAt: number
}

type Status = 'idle' | 'creating' | 'publishing' | 'success' | 'error'

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [name, setName] = useState('Docs Proxy')
  const [sourcePath, setSourcePath] = useState('/docs/:path*')
  const [destination, setDestination] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/projects')
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
          if (data.projects.length > 0) {
            setSelectedProjectId(data.projects[0].id)
          }
        }
      })
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('creating')
    setError('')

    try {
      const createRes = await fetch('/api/create-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          name,
          path: sourcePath,
          syntax: 'path-to-regexp',
          actions: [{ type: 'rewrite', dest: destination }],
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
        body: JSON.stringify({ projectId: selectedProjectId }),
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

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading projects...
        </p>
      </main>
    )
  }

  if (status === 'success') {
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
            Vercel's CDN.
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
              href={`https://vercel.com/${selectedProject?.name}/cdn/routing`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
            >
              View in Dashboard
            </a>
            <button
              onClick={() => {
                setStatus('idle')
                setName('Docs Proxy')
                setSourcePath('/docs/:path*')
                setDestination('')
              }}
              className="inline-flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
            >
              Create Another
            </button>
          </div>
        </div>
      </main>
    )
  }

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rule name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Docs Proxy"
              required
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Source path
            </label>
            <input
              type="text"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              placeholder="/docs/:path*"
              required
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Uses{' '}
              <a
                href="https://vercel.com/docs/routing/project-routing-rules"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                path-to-regexp
              </a>{' '}
              syntax
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Destination URL
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="https://your-docs-site.mintlify.dev/docs/:path*"
              required
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              The external URL to rewrite requests to
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-4 py-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'creating' || status === 'publishing'}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'creating'
              ? 'Creating rule...'
              : status === 'publishing'
                ? 'Publishing...'
                : 'Create and Publish Route'}
          </button>
        </form>

        <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-5 py-4">
          <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
            This will create a rewrite rule on your Vercel project and publish
            it to the CDN immediately. The rule can be edited or removed from
            your project's{' '}
            <strong className="text-gray-600 dark:text-gray-400">
              CDN &rarr; Routing
            </strong>{' '}
            settings.
          </p>
        </div>
      </div>
    </main>
  )
}
