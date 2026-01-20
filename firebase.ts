import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { environment } from './src/environmemts/environment';

const firebaseApp = initializeApp(environment.firebase);

export const realtimeDb = getDatabase(firebaseApp);
