import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatParams, Theme } from '@/types'
import { STORAGE_KEYS } from '@/lib/storage-keys'
import { defaultParams } from '@/config/default-params'

interface SettingsState {
  activeModel: string | null
  activeProviderId: string | null
  params: ChatParams
  theme: Theme
  recentModels: Array<{ providerId: string; modelId: string }>
  setActiveModel: (providerId: string, modelId: string) => void
  updateParams: (params: Partial<ChatParams>) => void
  setTheme: (theme: Theme) => void
  addRecentModel: (providerId: string, modelId: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      activeModel: null,
      activeProviderId: null,
      params: defaultParams,
      theme: 'system',
      recentModels: [],

      setActiveModel: (providerId, modelId) =>
        set((state) => {
          const newRecent = [
            { providerId, modelId },
            ...state.recentModels.filter(
              (m) => !(m.providerId === providerId && m.modelId === modelId)
            ),
          ].slice(0, 5)

          return {
            activeModel: modelId,
            activeProviderId: providerId,
            recentModels: newRecent,
          }
        }),

      updateParams: (newParams) =>
        set((state) => ({
          params: { ...state.params, ...newParams },
        })),

      setTheme: (theme) => set({ theme }),

      addRecentModel: (providerId, modelId) =>
        set((state) => {
          const newRecent = [
            { providerId, modelId },
            ...state.recentModels.filter(
              (m) => !(m.providerId === providerId && m.modelId === modelId)
            ),
          ].slice(0, 5)

          return { recentModels: newRecent }
        }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
    }
  )
)
