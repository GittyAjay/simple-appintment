/**
 * Firestore CRUD operations for users, customers, and appointments
 * All data is scoped by userId for multi-tenant support
 */
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// Timeout wrapper - show error instead of infinite loading when Firestore hangs
const TIMEOUT_MS = 30000 // 30 sec - Firestore create can be slow on first write
function withTimeout(promise, msg = 'Request timed out') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(
        `${msg} Deploy Firestore rules: run "firebase login" then "firebase deploy --only firestore:rules" in your project folder.`
      )), TIMEOUT_MS)
    )
  ])
}

// Users (custom auth - stored in Firestore)
export async function getUserByEmail(email) {
  const q = query(
    collection(db, 'users'),
    where('email', '==', email.toLowerCase().trim())
  )
  console.log('[Firestore] getUserByEmail: querying users for', email)
  try {
    const snap = await withTimeout(getDocs(q), 'Firestore query timed out')
    console.log('[Firestore] getUserByEmail: got', snap.size, 'results')
    if (snap.empty) return null
    const d = snap.docs[0]
    return { id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() }
  } catch (err) {
    console.error('[Firestore] getUserByEmail failed:', err.code, err.message, err)
    throw err
  }
}

export async function createUser({ email, passwordHash, salt, name, businessName }) {
  console.log('[Firestore] createUser: adding doc to users')
  try {
    const ref = await withTimeout(addDoc(collection(db, 'users'), {
      email: email.toLowerCase().trim(),
      passwordHash,
      salt,
      name: name || '',
      businessName: businessName || '',
      createdAt: serverTimestamp(),
    }), 'Firestore create timed out')
    console.log('[Firestore] createUser: doc created with id', ref.id)
    return ref.id
  } catch (err) {
    console.error('[Firestore] createUser failed:', err.code, err.message, err)
    throw err
  }
}

// Customers
export async function addCustomer(userId, { name, phone }) {
  const ref = await addDoc(collection(db, 'customers'), {
    userId,
    name: name.trim(),
    phone: phone.trim(),
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getCustomers(userId) {
  const q = query(collection(db, 'customers'), where('userId', '==', userId))
  const snap = await getDocs(q)
  const list = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() }))
  list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  return list
}

export async function getCustomer(customerId) {
  const snap = await getDoc(doc(db, 'customers', customerId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// Appointments
export async function addAppointment(userId, { customerId, customerName, phone, date, time, notes, status }) {
  const ref = await addDoc(collection(db, 'appointments'), {
    userId,
    customerId: customerId || null,
    customerName: customerName?.trim() || '',
    phone: phone?.trim() || '',
    date,
    time,
    notes: notes?.trim() || '',
    status: status || 'scheduled',
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getAppointment(appointmentId) {
  const snap = await getDoc(doc(db, 'appointments', appointmentId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function getAppointments(userId, filter = 'all', dateStr = null) {
  const q = query(collection(db, 'appointments'), where('userId', '==', userId))
  const snap = await getDocs(q)
  let list = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() }))
  list.sort((a, b) => {
    const d = (a.date || '').localeCompare(b.date || '')
    return d !== 0 ? d : (a.time || '').localeCompare(b.time || '')
  })

  if (filter === 'date' && dateStr) {
    list = list.filter(a => a.date === dateStr)
  } else if (filter === 'today') {
    const today = new Date().toISOString().slice(0, 10)
    list = list.filter(a => a.date === today)
  } else if (filter === 'upcoming') {
    const today = new Date().toISOString().slice(0, 10)
    list = list.filter(a => a.date >= today)
  }
  return list
}

/** Get appointments for a single date. */
export async function getAppointmentsForDate(userId, dateStr) {
  return getAppointments(userId, 'date', dateStr)
}

export async function updateAppointment(appointmentId, updates) {
  await updateDoc(doc(db, 'appointments', appointmentId), updates)
}

export async function deleteAppointment(appointmentId) {
  await deleteDoc(doc(db, 'appointments', appointmentId))
}

// Invoices / Bills (GST compliant)
export async function getNextInvoiceNumber(userId) {
  const q = query(
    collection(db, 'invoices'),
    where('userId', '==', userId)
  )
  const snap = await getDocs(q)
  const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '') // YYYYMM
  const prefix = `INV-${yearMonth}-`
  let maxNum = 0
  snap.docs.forEach(d => {
    const num = d.data().invoiceNumber
    if (typeof num === 'string' && num.startsWith(prefix)) {
      const n = parseInt(num.slice(prefix.length), 10)
      if (!isNaN(n) && n > maxNum) maxNum = n
    }
  })
  return `${prefix}${String(maxNum + 1).padStart(3, '0')}`
}

export async function createInvoice(userId, data) {
  const invoiceNumber = await getNextInvoiceNumber(userId)
  const { invoiceNumber: _discard, ...rest } = data
  const clean = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined)
  )
  const ref = await addDoc(collection(db, 'invoices'), {
    userId,
    invoiceNumber,
    ...clean,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getInvoices(userId) {
  const q = query(collection(db, 'invoices'), where('userId', '==', userId))
  const snap = await getDocs(q)
  const list = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() }))
  list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  return list
}

export async function getInvoice(invoiceId) {
  const snap = await getDoc(doc(db, 'invoices', invoiceId))
  return snap.exists() ? { id: snap.id, ...snap.data(), createdAt: snap.data().createdAt?.toDate?.() } : null
}
