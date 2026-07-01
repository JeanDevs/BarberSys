/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export interface ToastData {
  id: number
  title: string
  description?: string
}

type PushToast = (t: Omit<ToastData, 'id'>) => void

const ToastContext = createContext<PushToast>(() => {})

export function useToast(): PushToast {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const counter = useRef(0)

  const push = useCallback<PushToast>((t) => {
    const id = ++counter.current
    setToasts((prev) => [...prev.slice(-3), { ...t, id }])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5000)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="fade-in-up pointer-events-auto rounded-xl border border-white/[0.1] bg-zinc-900/95 px-4 py-3 shadow-2xl backdrop-blur"
          >
            <p className="text-sm font-semibold text-zinc-100">{t.title}</p>
            {t.description && <p className="mt-0.5 text-xs text-zinc-400">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
