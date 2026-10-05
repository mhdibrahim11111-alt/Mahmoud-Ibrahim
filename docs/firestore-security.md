# Firestore Security Architecture & Setup Guide

## 1. Security Model Overview

- **Zero Direct Client Access (Deny-All-by-Default):**
  The browser application does **not** connect directly to Cloud Firestore. `firestore.rules` enforces `allow read, write: if false;` across all collections without any public exception or catch-all bypass.
- **Server-Authoritative Data Layer:**
  All database operations are mediated exclusively by the Express backend (`server.ts`) using the **Firebase Admin SDK** (`firebase-admin/firestore`).
- **Google Cloud IAM Authorization:**
  Admin SDK requests bypass Firestore security rules entirely; they are authorized at the cloud infrastructure layer through Google Cloud IAM using Application Default Credentials (ADC) or the deployment's service account identity.
- **Session-Based Client Authentication:**
  Clients communicate solely via `/api/*` endpoints. Operations on student progress, drafts, snippets, notes, teacher management, and admin functions require an authenticated, cryptographically signed session token (`requireSession`, `requireStaff`).

---

## 2. Administrator Credential Protection

- **No Plaintext Secrets in Firestore:**
  Administrator codes are **never** stored in plaintext in Cloud Firestore.
- **Environment-Based Configuration:**
  Primary administrator credentials must be configured on the server via the `ADMIN_CODES` environment variable (comma-separated list of high-entropy codes, minimum 6 characters).
- **Hashed Dynamic Rotation:**
  Any administrator code rotated or created at runtime is stored in-memory for the active process. When persisted to Firestore (`system_config/admin_settings`), only a one-way HMAC-SHA256 hash salted with `SESSION_SECRET` is saved (`hashedAdminCodes`). The server's `initCodesStorage()` automatically sanitizes and removes any legacy plaintext `dynamicCodes` fields from Firestore.
- **No Credential Leakage to Clients:**
  The server replaces actual admin codes with the generic identifier `'MASTER'` in client responses (`/api/auth/verify`, `/api/auth/session`). Admin codes are also filtered out from student code lists (`getStoredCodes`).

---

## 3. Required Google Cloud & Firebase Configuration (Manual Steps)

Before deploying the deny-by-default rules to production, ensure your server identity has the necessary IAM permissions to access Firestore:

### Step 3.1: Identify the Runtime Identity
- **Project ID:** `logical-delight-5vr20`
- **Firestore Database ID:** `ai-studio-mahmoudibrahim-f38dbd15-ea18-4a67-962f-bcba77618734`
- **Cloud Run / App Engine Service Account:**
  Find the service account under which your backend runs (e.g., `PROJECT_NUMBER-compute@developer.gserviceaccount.com` or custom service account).

### Step 3.2: Grant the Datastore User Role
Run the following Google Cloud CLI command:
```bash
gcloud projects add-iam-policy-binding logical-delight-5vr20 \
  --member="serviceAccount:<YOUR_SERVICE_ACCOUNT_EMAIL>" \
  --role="roles/datastore.user"
```
*(Alternatively, in the Google Cloud Console under IAM & Admin, add the `Cloud Datastore User` role (`roles/datastore.user`) to the service account).*

### Step 3.3: Set Environment Secrets on the Server
Configure these environment variables in your deployment environment (e.g. Cloud Run Environment Variables or Secret Manager):
- `ADMIN_CODES`: Your private master administrator code(s), e.g., `ZAKI-ADMIN-2026,CHIEF-MASTER-9912`
- `SESSION_SECRET`: A secure, random string with at least 32 characters (e.g. generated via `openssl rand -hex 32`)
- `PORT`: `3000`
- `NODE_ENV`: `production`

### Step 3.4: Deploy Firestore Rules Manually
Once server IAM is confirmed, deploy the new deny-by-default rules from your workstation using the Firebase CLI:
```bash
firebase deploy --only firestore:rules --project logical-delight-5vr20
```

---

## 4. Google AI Studio Managed Runtime: Limitations & Alternatives

### Limitation
In Google AI Studio's managed preview/developer runtime (Starter Tier), the container runs under a Google-managed cross-project identity that might not have IAM permissions on your personal project (`logical-delight-5vr20`), causing `PERMISSION_DENIED` errors on Admin SDK calls.

### Non-Negotiable Rule
**Do NOT reopen Firestore security rules with `allow read, write: if true;` to bypass this.** Reopening the rules exposes student records, drafts, and system configurations to the public internet.

### Secure Alternative Architecture (Firebase Auth with UID-Scoped Rules)
If your deployment runtime cannot be granted IAM permissions to use the Firebase Admin SDK:
1. Enable **Firebase Authentication** (e.g. Anonymous Sign-in or Email/Password) in the Firebase Console.
2. Update the client application to initialize the Firebase Web SDK and authenticate the user upon opening the app (`signInAnonymously(auth)`).
3. Restructure Firestore collections so documents are owned by `request.auth.uid`:
   ```rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read and write their own student records
       match /student_data/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       // Global default deny
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
4. Access codes and administrative operations should remain on an external backend or Firebase Cloud Functions with controlled admin privilege.

---

## 5. Verification Guide

To verify the security fix:

1. **Verify Direct Client Block (Negative Test):**
   Attempt an unauthenticated direct HTTP request to the Firestore REST API for any document:
   ```bash
   curl "https://firestore.googleapis.com/v1/projects/logical-delight-5vr20/databases/ai-studio-mahmoudibrahim-f38dbd15-ea18-4a67-962f-bcba77618734/documents/system_config/admin_settings"
   ```
   **Expected Result:** `403 Forbidden` / `PERMISSION_DENIED` (Direct browser / client access is denied).

2. **Verify Server-Side Authenticated Operations (Positive Test):**
   - Call `POST /api/auth/verify` with a valid master code (`ADMIN_CODES`) or student code.
   - Confirm a session token is issued, and verify that the client can fetch and update progress via `POST /api/progress`.
   - Confirm that `/api/admin/codes` returns code listings only when a valid master or teacher session token is supplied.
   - Confirm that the response from `/api/auth/verify` masks the master code as `'MASTER'`.

> **Note on Deployment Status:**
> Changing `firestore.rules` in this repository prepares the rules locally. The rules are **not** deployed automatically to live cloud infrastructure; they must be deployed by an authorized developer using `firebase deploy --only firestore:rules`.
