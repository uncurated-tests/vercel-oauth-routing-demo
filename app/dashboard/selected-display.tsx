'use client'

export function SelectedDisplay({
  teamName,
  projectName,
  onChange,
}: {
  teamName: string
  projectName: string
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-4 py-3 mb-6">
      <div className="flex items-center gap-2 text-sm min-w-0">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase">
          {teamName.charAt(0)}
        </div>
        <span className="text-gray-500 dark:text-gray-400 truncate">
          {teamName}
        </span>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <div className="flex-shrink-0 w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase">
          {projectName.charAt(0)}
        </div>
        <span className="font-medium text-gray-900 dark:text-white truncate">
          {projectName}
        </span>
      </div>
      <button
        onClick={onChange}
        className="flex-shrink-0 ml-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        Change
      </button>
    </div>
  )
}
