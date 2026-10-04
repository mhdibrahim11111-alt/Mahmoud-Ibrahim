# Firestore access and deployment setup

## Security model

- Browser code calls the Express API; it does not connect directly to Firestore.
- The server uses Firebase Admin SDK with Application Default Credentials (ADC).
- Firestore Security Rules deny every browser read and write. Admin SDK calls are authorized by Google Cloud IAM.
- Student and admin API routes continue to validate the signed app session before reading or changing records.

## Google AI Studio / Cloud Run deployment

The deployed server needs a runtime service identity with `roles/datastore.user` on the Firebase project. This grants read/write access to Firestore data. Do not create or commit a service-account JSON key; use the Cloud Run service identity and ADC when the deployment environment supports it.

AI Studio's Starter Tier manages the Cloud Run service for you. Verify that the deployed runtime identity can access the Firebase project and that the role can be granted without moving the project to a billed deployment tier. The server now fails startup when it cannot read the configured Firestore database, instead of silently serving a broken app.

Configure these server-side secrets in the deployment environment:

- `ADMIN_CODES`: comma-separated admin codes. There are no fallback admin codes in source code.
- `SESSION_SECRET`: a random secret with at least 32 characters.
- `GEMINI_API_KEY`: only if the smart-hint feature uses Gemini.

For local development, configure ADC with `gcloud auth application-default login`, or set `GOOGLE_APPLICATION_CREDENTIALS` to a private service-account key stored outside the repository. Grant the local identity `roles/datastore.user` on the Firebase project.

## Deploy the deny-by-default Firestore rules

After confirming the server deployment has the required IAM access, deploy the rules and index configuration:

```powershell
firebase deploy --only firestore --project logical-delight-5vr20
```

The project and database in `firebase-applet-config.json` must be the intended environment. These rules block direct Firestore SDK use from browsers; the Admin SDK server continues to work through IAM.

## Important limitation

If AI Studio Starter Tier does not let the managed Cloud Run identity receive the required IAM role on the Firebase project, this server-side access model cannot connect to Firestore from that deployment. Do not reopen public Firestore rules to work around it. Use a deployment environment where you control the service identity, or migrate student login and data access to Firebase Authentication with UID-scoped rules.
