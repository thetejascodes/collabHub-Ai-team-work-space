import type { InputHTMLAttributes } from 'react'

export const InputField = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={`input ${className}`.trim()} {...props} />
}
