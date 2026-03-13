import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (accessToken) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-8 h-8 text-gray-900 dark:text-white"
            viewBox="0 0 76 65"
            fill="currentColor"
          >
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Connect your Vercel project
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          Sign in with your Vercel account to create a routing rule that serves
          content through your domain. No code changes or redeployment required.
        </p>

        <a
          href="/api/auth/authorize"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 76 65"
            fill="currentColor"
          >
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          Sign in with Vercel
        </a>

        <div className="mt-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-6 py-5 text-left">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
            How it works
          </h2>
          <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center justify-center">
                1
              </span>
              Sign in with your Vercel account
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center justify-center">
                2
              </span>
              Select a project
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center justify-center">
                3
              </span>
              Configure and create a routing rule
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center justify-center">
                4
              </span>
              The rule is published instantly to Vercel's CDN
            </li>
          </ol>
        </div>
      </div>
    </main>
  )
}
