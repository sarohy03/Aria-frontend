# auth

Firebase authentication service — no UI, no React.

| File | Purpose |
|---|---|
| `authService.js` | Email/password signup & sign-in, Google sign-in, account linking, sign-out |

## Functions

| Function | Description |
|---|---|
| `signUpWithEmail({ name, email, password })` | Creates account and sets display name |
| `signInWithEmail(email, password)` | Email/password sign-in |
| `signInWithGoogle()` | Google popup sign-in; returns `linkRequired` if email/password account already exists |
| `linkGoogleToAccount(user, pendingCredential)` | Links Google to an existing email account after password sign-in |
| `linkGoogleToAccount(user, pendingCredential)` | Links Google to existing email account |
| `signOutUser()` | Signs out current user |
| `subscribeToAuth(callback)` | Auth state listener |
| `getAuthErrorMessage(error)` | User-friendly error messages |
