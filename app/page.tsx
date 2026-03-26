import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (accessToken) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 text-xs font-medium text-gray-600 dark:text-gray-400 mb-8">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 76 65"
              fill="currentColor"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            Sign in with Vercel Demo
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Create routing rules
            <br />
            <span className="text-gray-400 dark:text-gray-500">
              on behalf of your users
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-lg mx-auto mb-10">
            Use OAuth to authenticate Vercel users, then create project-level
            routing rules through the API. No code changes or redeployment
            required.
          </p>

          <a
            href="/api/auth/authorize"
            className="inline-flex items-center justify-center gap-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm shadow-sm"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 76 65"
              fill="currentColor"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            Try the demo
          </a>
        </div>

        {/* Flow diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-16">
          {[
            {
              step: '1',
              title: 'Authenticate',
              desc: 'User signs in with their Vercel account via OAuth',
            },
            {
              step: '2',
              title: 'Select project',
              desc: 'Pick the team and project to configure',
            },
            {
              step: '3',
              title: 'Create rule',
              desc: 'Define the rewrite source and destination',
            },
            {
              step: '4',
              title: 'Publish',
              desc: 'Route goes live instantly on Vercel\'s CDN',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-5"
            >
              <div className="w-7 h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center mb-3">
                {item.step}
              </div>
              <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Use cases */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-8 mb-16">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
            Built for platforms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Documentation',
                desc: 'Serve hosted docs (Mintlify, Fern, ReadMe) through your customer\'s domain.',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                ),
              },
              {
                title: 'API proxying',
                desc: 'Route API traffic through your customer\'s Vercel domain to your backend.',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                  />
                ),
              },
              {
                title: 'White-label',
                desc: 'Serve your platform\'s UI from your customer\'s domain seamlessly.',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                  />
                ),
              },
            ].map((item) => (
              <div key={item.title}>
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  {item.icon}
                </svg>
                <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical details */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-600 space-y-1 pb-8">
          <p>
            Uses{' '}
            <a
              href="https://vercel.com/docs/sign-in-with-vercel"
              className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-400"
            >
              Sign in with Vercel
            </a>
            {' '}OAuth with PKCE +{' '}
            <a
              href="https://vercel.com/docs/rest-api/project-routes/add-a-routing-rule"
              className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-400"
            >
              Project Routes API
            </a>
            {' '}+{' '}
            <a
              href="https://vercel.com/docs/rest-api/sdk/project-routes/add-a-routing-rule"
              className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-400"
            >
              Vercel SDK
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
