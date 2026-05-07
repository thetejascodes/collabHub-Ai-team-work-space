export const Spinner = ({ label = 'Loading...' }: { label?: string }) => {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  )
}
