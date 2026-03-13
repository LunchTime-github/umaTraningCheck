import { useState, useCallback } from 'react'

export function useStore(key) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await window.electronAPI.store.get(key)
      setData(result || [])
      return result || []
    } finally {
      setLoading(false)
    }
  }, [key])

  const add = useCallback(async (item) => {
    const added = await window.electronAPI.store.add(key, item)
    setData(prev => [...prev, added])
    return added
  }, [key])

  const update = useCallback(async (id, updates) => {
    const updated = await window.electronAPI.store.update(key, id, updates)
    setData(prev => prev.map(d => d.id === id ? updated : d))
    return updated
  }, [key])

  const remove = useCallback(async (id) => {
    await window.electronAPI.store.delete(key, id)
    setData(prev => prev.filter(d => d.id !== id))
  }, [key])

  return { data, loading, load, add, update, remove, setData }
}
