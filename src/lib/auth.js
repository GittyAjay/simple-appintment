/**
 * Password hashing using Web Crypto API (PBKDF2)
 * No extra dependencies - secure one-way hashing
 */
const ITERATIONS = 100000
const KEY_LENGTH = 256
const SALT_LENGTH = 16

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export async function hashPassword(password) {
  if (!crypto.subtle) {
    throw new Error('crypto.subtle not available (use HTTPS or localhost)')
  }
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    KEY_LENGTH
  )
  console.log('[Auth] hashPassword: done')
  return {
    hash: arrayBufferToBase64(hashBuffer),
    salt: arrayBufferToBase64(salt)
  }
}

export async function verifyPassword(password, hash, salt) {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64ToArrayBuffer(salt),
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    KEY_LENGTH
  )
  return arrayBufferToBase64(hashBuffer) === hash
}
