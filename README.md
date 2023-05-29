# UrlShortener

## Purpose
This is a super-simple URL shortener application, using `nx`'s `@nrwl/next` plugin, as well as Firebase for database access. It's merely an exercise!

## Running the app
First, pull the repo. Note the `nx` version used in this repo currently requires Node 16+ to run the application, so coordinate using your preferred method; I use `nvm`, for example, to set Node to LTS for the running process.

Next, You'll need to setup Firebase with an application and `urls` database collection, and get the configuration keys, etc. from Firebase console. 

The document data structure is as follows:

```ts
interface IDoc {
  // set by Firebase
  id: string;
  shortUrl: string;
  longUrl: string;
  // type during Firestore setup is `timestamp`
  created: timestamp;
  // type during Firestore setup is `timestamp`
  updated: timestamp;
}
```

The configuration key-value pairs are closely aligned with the following environment variables, and should be stored in `apps/url-shortener/.env`. I've also included two other variables, as noted.

```bash
# Firebase
NEXT_PUBLIC_FIRESTORE_API_KEY=...
NEXT_PUBLIC_FIRESTORE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIRESTORE_DATABASE_URL=...
NEXT_PUBLIC_FIRESTORE_PROJECT_ID=...
NEXT_PUBLIC_FIRESTORE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIRESTORE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIRESTORE_APP_ID=...
NEXT_PUBLIC_FIRESTORE_MEASUREMENT_ID=...
# When `true`, allows logging Firebase data
NEXT_PUBLIC_FIREBASE_DEBUG=false

# Required on all environments to construct URLs
NEXT_PUBLIC_BASE_URL=http://localhost:5305
```
Next, install the dependencies. I'm using `yarn`, but `npm` should suffice (I started with `npm` but ran into some resolution issues with `nx`).

Afterward, simply startup the application with `yarn start`. It'll launch on `http://localhost:5305`. 

## Demo
A demo of the `hURLy` site can be found <a href="https://hurly.io/" target="_blank">here</a>.

## TODOs
- [ ] Implement `lint-staged` and `husky` to call `nx`-provided linting and formatting functionality during pre-commit hook
- [ ] Implement Google Analytics
- [ ] Flesh out better styling for the user-facing index page (it's pretty bare)
- [ ] Change `NEXT_PUBLIC`-prefaced environment variables, where necessary, to omit such prefix and, in the case of the Firebase variables, they only run on the server