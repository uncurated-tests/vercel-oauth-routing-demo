import { Suspense } from 'react'
import { DashboardContent } from './dashboard-content'

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
