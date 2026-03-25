'use client'

interface Project {
  id: string
  name: string
}

export function ProjectSelector({
  projects,
  teamName,
  loading,
  onSelect,
  onBack,
}: {
  projects: Project[]
  teamName: string
  loading: boolean
  onSelect: (project: Project) => void
  onBack: () => void
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-3"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {teamName}
      </button>

      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        Select a project
      </h2>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden max-h-[max(50vh,400px)] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No projects found
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onSelect(project)}
                className="flex items-center w-full min-h-[49px] px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-[30px] h-[30px] rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  {project.name.charAt(0)}
                </div>
                <span className="mx-3 truncate text-sm font-medium text-gray-900 dark:text-white">
                  {project.name}
                </span>
                <svg
                  className="ml-auto flex-shrink-0 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
