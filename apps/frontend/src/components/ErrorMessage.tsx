interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className = "" }: ErrorMessageProps) {
  return (
    <div className={`rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-red-300">Error</h4>
          <p className="text-sm">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
