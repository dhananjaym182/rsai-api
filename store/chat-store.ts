import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatSession, ChatMessage } from '@/types'
import { STORAGE_KEYS } from '@/lib/storage-keys'

interface ChatState {
  sessions: Record<string, ChatSession>
  activeSessionId: string | null
  createSession: (model?: string, providerId?: string) => string
  deleteSession: (sessionId: string) => void
  setActiveSession: (sessionId: string) => void
  addMessage: (sessionId: string, message: ChatMessage) => void
  updateMessage: (sessionId: string, messageId: string, content: string) => void
  deleteMessage: (sessionId: string, messageId: string) => void
  getSession: (sessionId: string) => ChatSession | undefined
  getActiveSession: () => ChatSession | undefined
  updateSessionTitle: (sessionId: string, title: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: {},
      activeSessionId: null,

      createSession: (model, providerId) => {
        const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
        const session: ChatSession = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model,
          providerId,
        }
        set((state) => ({
          sessions: { ...state.sessions, [id]: session },
          activeSessionId: id,
        }))
        return id
      },

      deleteSession: (sessionId) =>
        set((state) => {
          const { [sessionId]: removed, ...rest } = state.sessions
          void removed
          return {
            sessions: rest,
            activeSessionId:
              state.activeSessionId === sessionId ? null : state.activeSessionId,
          }
        }),

      setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

      addMessage: (sessionId, message) =>
        set((state) => {
          const session = state.sessions[sessionId]
          if (!session) return state

          const updatedSession = {
            ...session,
            messages: [...session.messages, message],
            updatedAt: Date.now(),
            title:
              session.messages.length === 0 && message.role === 'user'
                ? message.content.slice(0, 50)
                : session.title,
          }

          return {
            sessions: { ...state.sessions, [sessionId]: updatedSession },
          }
        }),

      updateMessage: (sessionId, messageId, content) =>
        set((state) => {
          const session = state.sessions[sessionId]
          if (!session) return state

          const updatedMessages = session.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg
          )

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: updatedMessages,
                updatedAt: Date.now(),
              },
            },
          }
        }),

      deleteMessage: (sessionId, messageId) =>
        set((state) => {
          const session = state.sessions[sessionId]
          if (!session) return state

          const updatedMessages = session.messages.filter((msg) => msg.id !== messageId)

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: updatedMessages,
                updatedAt: Date.now(),
              },
            },
          }
        }),

      getSession: (sessionId) => get().sessions[sessionId],

      getActiveSession: () => {
        const { activeSessionId, sessions } = get()
        return activeSessionId ? sessions[activeSessionId] : undefined
      },

      updateSessionTitle: (sessionId, title) =>
        set((state) => {
          const session = state.sessions[sessionId]
          if (!session) return state

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: { ...session, title },
            },
          }
        }),
    }),
    {
      name: STORAGE_KEYS.CHAT_SESSIONS,
    }
  )
)
