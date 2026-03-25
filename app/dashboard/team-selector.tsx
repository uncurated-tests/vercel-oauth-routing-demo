'use client'

interface Team {
  id: string
  slug: string
  name: string | null
}

export function TeamSelector({
  teams,
  onSelect,
}: {
  teams: Team[]
  onSelect: (team: Team) => void
}) {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        Select your team
      </h2>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden max-h-[max(50vh,400px)] overflow-y-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelect(team)}
              className="flex items-center w-full min-h-[49px] px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left"
            >
              <div className="flex-shrink-0 w-[30px] h-[30px] rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                {(team.name || team.slug).charAt(0)}
              </div>
              <span className="mx-3 truncate text-sm font-medium text-gray-900 dark:text-white">
                {team.name || team.slug}
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
      </div>
    </div>
  )
}
