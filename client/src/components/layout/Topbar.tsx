import type { ReactNode } from 'react'

export const Topbar = ({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: ReactNode
}) => {
  return (
    <section className="topbar">
      <div className="topbar-copy">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>{title}</h1>
        </div>
        <p>{description}</p>
      </div>
      {actions ? <div className="topbar-actions">{actions}</div> : null}
    </section>
  )
}
