import CryptoJS from 'crypto-js'
import { STORAGE_KEYS } from './storage-keys'

function getOrCreateSalt(): string {
  if (typeof window === 'undefined') return 'server-side-salt'
  
  let salt = localStorage.getItem(STORAGE_KEYS.ENCRYPTION_SALT)
  if (!salt) {
    salt = CryptoJS.lib.WordArray.random(128 / 8).toString()
    localStorage.setItem(STORAGE_KEYS.ENCRYPTION_SALT, salt)
  }
  return salt
}

export function encryptKey(plaintext: string): string {
  if (!plaintext) return ''
  const salt = getOrCreateSalt()
  return CryptoJS.AES.encrypt(plaintext, salt).toString()
}

export function decryptKey(ciphertext: string): string {
  if (!ciphertext) return ''
  try {
    const salt = getOrCreateSalt()
    const bytes = CryptoJS.AES.decrypt(ciphertext, salt)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}
