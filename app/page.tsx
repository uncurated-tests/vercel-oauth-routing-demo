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
            {' '}OAuth +{' '}
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
