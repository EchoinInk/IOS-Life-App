interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => (
  <div className="flex items-center justify-center min-h-[200px] text-sm text-text-muted">
    {message}
  </div>
);

export default LoadingState;
