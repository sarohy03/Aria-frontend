import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

const ERROR_MESSAGES = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed.',
  'auth/popup-blocked-by-browser': 'Popup was blocked. Allow popups for this site and try again.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/account-exists-with-different-credential':
    'This email already has an account. Sign in with your password first, then we will link Google.',
  'google-account-exists': 'This email is registered with Google. Use Continue with Google.',
  'google-only-hint':
    'Could not sign in with password. If this email uses Google, click Continue with Google instead.',
}

export function getAuthErrorMessage(error) {
  if (error?.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code]
  }
  if (error?.message) {
    return error.message
  }
  return 'Something went wrong. Please try again.'
}

export async function signUpWithEmail({ name, email, password }) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name })
    return credential.user
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email)
        if (methods.includes('google.com')) {
          const err = new Error(ERROR_MESSAGES['google-account-exists'])
          err.code = 'google-account-exists'
          throw err
        }
      } catch {
        // fetchSignInMethodsForEmail may be restricted; fall through
      }
    }
    throw error
  }
}

export async function signInWithEmail(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  } catch (error) {
    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email)
        if (methods.includes('google.com') && !methods.includes('password')) {
          const err = new Error(ERROR_MESSAGES['google-only-hint'])
          err.code = 'google-only-hint'
          throw err
        }
      } catch (inner) {
        if (inner.code === 'google-only-hint') throw inner
      }
    }
    throw error
  }
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return { user: result.user, linkRequired: false }
  } catch (error) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      const pendingCredential = GoogleAuthProvider.credentialFromError(error)
      const email = error.customData?.email ?? ''
      return {
        user: null,
        linkRequired: true,
        email,
        pendingCredential,
      }
    }
    if (error.code === 'auth/popup-closed-by-user') {
      return { user: null, cancelled: true }
    }
    throw error
  }
}

export async function linkGoogleToAccount(user, pendingCredential) {
  const result = await linkWithCredential(user, pendingCredential)
  return result.user
}

export function signOutUser() {
  return signOut(auth)
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback)
}
