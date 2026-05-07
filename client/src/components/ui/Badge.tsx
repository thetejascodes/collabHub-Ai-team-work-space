import type { ReactNode } from 'react'

export const Badge = ({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'success' | 'warning'
}) => {
  return <span className={`badge badge-${tone}`}>{children}</span>
}
