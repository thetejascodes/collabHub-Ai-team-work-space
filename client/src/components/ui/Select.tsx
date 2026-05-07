import type { SelectHTMLAttributes } from 'react'

export const Select = ({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) => {
  return <select className={`select ${className}`.trim()} {...props} />
}
