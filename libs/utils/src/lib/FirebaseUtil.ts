import { initializeApp, getApps, getApp } from 'firebase/app';
import { setLogLevel, serverTimestamp, addDoc, collection, doc, getFirestore, where, increment, getDoc, updateDoc, query, getDocs, limit } from 'firebase/firestore';
import { nanoid } from 'nanoid';

export interface IDoc {
  // shortUrl is used as the `id` field
  id: string;
  shortUrl: string;
  longUrl: string;
  requests: number;
  created: string;
  updated?: string;
}

function getFirebaseApp() {
  if (!getApps().length) {
    return initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIRESTORE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIRESTORE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIRESTORE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIRESTORE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIRESTORE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIRESTORE_APP_ID,
    });
  }

  return getApp();
}

const db = getFirestore(getFirebaseApp());

if (process.env.NEXT_PUBLIC_FIREBASE_DEBUG === 'true') {
  setLogLevel('debug');
}

export const queryForShortUrl = async (fields: IDoc): Promise<string | null> => {
  const queries = [];
  const { shortUrl, longUrl } = fields;

  if ('string' === typeof shortUrl && shortUrl.length) {
    queries.push(where('shortUrl', '==', shortUrl));
  } else if ('string' === typeof longUrl && longUrl.length) {
    queries.push(where('longUrl', '==', longUrl));
  }

  queries.push(limit(1));

  const q = query(collection(db, 'urls'), ...queries);
  const documents = await getDocs(q);

  if (documents.size === 1) {
    const data: any = [];

    documents.forEach((d) => {
      data.push({ id: d.id, ...d.data() });
    });
  
    return data[0];
  }

  return null;
}

export const addToUrls = async (longUrl: string): Promise<IDoc> => {
  const collectionRef = collection(db, 'urls');
  
  const documentRef = await addDoc(collectionRef, {
    shortUrl: nanoid(8),
    longUrl,
    created: serverTimestamp(),
    updated: serverTimestamp(),
    requests: 1 // should we set to `0` or `1` off the bat?
  });

  const document = await getDoc(documentRef);

  return document.data() as IDoc;
}

export const incrementUrlRequest = async (id: string) => {
  const documentRef = doc(db, 'urls' + '/' + id);

  await updateDoc(documentRef, {
    requests: increment(1)
  });

  return true;
}

export default db;
