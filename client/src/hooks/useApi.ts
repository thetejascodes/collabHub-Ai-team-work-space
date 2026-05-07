import { useState } from 'react'

export const useApi = <TArgs extends unknown[], TResult>(requestFn: (...args: TArgs) => Promise<TResult>) => {
  const [data, setData] = useState<TResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = async (...args: TArgs) => {
    setLoading(true)
    setError(null)

    try {
      const result = await requestFn(...args)
      setData(result)
      return result
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unexpected request error'
      setError(message)
      throw caught
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    error,
    loading,
    execute,
    setData,
  }
}
