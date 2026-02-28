import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProviderConfig, ProviderStatus } from '@/types'
import { STORAGE_KEYS } from '@/lib/storage-keys'

interface ProvidersState {
  providers: Record<string, ProviderConfig>
  saveProvider: (config: ProviderConfig) => void
  removeProvider: (providerId: string) => void
  setStatus: (providerId: string, status: ProviderStatus) => void
  setEnabledModels: (providerId: string, models: string[]) => void
  updateTestResult: (
    providerId: string,
    result: { latency?: number; response?: string; error?: string | null }
  ) => void
  resetProvider: (providerId: string) => void
  getProvider: (providerId: string) => ProviderConfig | undefined
}

export const useProvidersStore = create<ProvidersState>()(
  persist(
    (set, get) => ({
      providers: {},

      saveProvider: (config) =>
        set((state) => ({
          providers: {
            ...state.providers,
            [config.providerId]: {
              ...config,
              lastTestedAt: new Date().toISOString(),
            },
          },
        })),

      removeProvider: (providerId) =>
        set((state) => {
          const { [providerId]: removed, ...rest } = state.providers
          void removed
          return { providers: rest }
        }),

      setStatus: (providerId, status) =>
        set((state) => ({
          providers: {
            ...state.providers,
            [providerId]: {
              ...state.providers[providerId],
              status,
            },
          },
        })),

      setEnabledModels: (providerId, models) =>
        set((state) => ({
          providers: {
            ...state.providers,
            [providerId]: {
              ...state.providers[providerId],
              enabledModels: models,
            },
          },
        })),

      updateTestResult: (providerId, result) =>
        set((state) => ({
          providers: {
            ...state.providers,
            [providerId]: {
              ...state.providers[providerId],
              lastTestLatency: result.latency,
              lastTestResponse: result.response,
              error: result.error,
              lastTestedAt: new Date().toISOString(),
              isConnected: !result.error,
              status: result.error ? 'ERROR' : 'CONNECTED',
            },
          },
        })),

      resetProvider: (providerId) =>
        set((state) => {
          const { [providerId]: removed, ...rest } = state.providers
          void removed
          return { providers: rest }
        }),

      getProvider: (providerId) => get().providers[providerId],
    }),
    {
      name: STORAGE_KEYS.PROVIDERS,
    }
  )
)
