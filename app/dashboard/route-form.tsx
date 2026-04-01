'use client'

type Status = 'idle' | 'creating' | 'publishing' | 'success' | 'error'

export function RouteForm({
  name,
  setName,
  sourcePath,
  setSourcePath,
  destination,
  setDestination,
  status,
  error,
  onSubmit,
}: {
  name: string
  setName: (v: string) => void
  sourcePath: string
  setSourcePath: (v: string) => void
  destination: string
  setDestination: (v: string) => void
  status: Status
  error: string
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Rule name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Demo Proxy"
          required
          className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Source path</label>
        <input
          type="text"
          value={sourcePath}
          onChange={(e) => setSourcePath(e.target.value)}
          placeholder="/demo/:path*"
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
          placeholder="https://your-backend.example.com/demo/:path*"
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

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-5 py-4">
        <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
          This will create a rewrite rule on your Vercel project and publish
          it to the CDN immediately. The rule can be edited or removed from
          your project&apos;s{' '}
          <strong className="text-gray-600 dark:text-gray-400">
            CDN &rarr; Routing
          </strong>{' '}
          settings.
        </p>
      </div>
    </form>
  )
}
