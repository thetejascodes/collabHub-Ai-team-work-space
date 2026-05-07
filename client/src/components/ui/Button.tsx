import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  fullWidth?: boolean
  icon?: ReactNode
}

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  icon,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant} ${fullWidth ? 'btn-block' : ''} ${className}`.trim()}
      {...props}
    >
      {icon ? <span className="btn-icon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}
