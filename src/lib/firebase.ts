import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  getDocFromServer,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { NPDProject, CMSConfig, ECORecord, STAGE_GATES } from '../types/dashboard';
import { INITIAL_NPD_PROJECTS } from '../data/mockProjects';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with Database ID (Mandatory per skill)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Error Handling conforming to FirestoreErrorInfo standard
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'projects', 'connection_probe'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client appears offline; falling back to local cache.');
    }
    return false;
  }
}

// Collections
const PROJECTS_COLLECTION = 'projects';
const CMS_COLLECTION = 'cms_configs';
const ECOS_COLLECTION = 'ecos';

// Default CMS Configuration
export const DEFAULT_CMS_CONFIG: CMSConfig = {
  id: 'global_npd_config',
  stageGates: STAGE_GATES,
  riskFormula: 'standard',
  autoHealthRules: true,
  criticalSpendThresholdPct: 95,
  overdueToleranceDays: 7,
  strictGatingEnforced: true,
  updatedAt: new Date().toISOString()
};

// Real-time project subscription
export function subscribeToProjects(
  onProjects: (projects: NPDProject[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const colRef = collection(db, PROJECTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: NPDProject[] = [];
      snapshot.forEach((d) => {
        if (d.id !== 'connection_probe') {
          items.push(d.data() as NPDProject);
        }
      });
      // Sort by code or gate by default
      items.sort((a, b) => a.code.localeCompare(b.code));
      onProjects(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, PROJECTS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

// Save or Update a Project
export async function saveProjectToFirestore(project: NPDProject): Promise<void> {
  const path = `${PROJECTS_COLLECTION}/${project.id}`;
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, project.id);
    await setDoc(docRef, {
      ...project,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Delete a Project
export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  const path = `${PROJECTS_COLLECTION}/${projectId}`;
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// Subscribe to CMS Config
export function subscribeToCMSConfig(
  onConfig: (config: CMSConfig) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const docRef = doc(db, CMS_COLLECTION, DEFAULT_CMS_CONFIG.id);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onConfig(snapshot.data() as CMSConfig);
      } else {
        // Seed default config
        saveCMSConfigToFirestore(DEFAULT_CMS_CONFIG);
        onConfig(DEFAULT_CMS_CONFIG);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `${CMS_COLLECTION}/${DEFAULT_CMS_CONFIG.id}`);
      if (onError) onError(error);
    }
  );
}

// Save CMS Config
export async function saveCMSConfigToFirestore(config: CMSConfig): Promise<void> {
  const path = `${CMS_COLLECTION}/${config.id}`;
  try {
    const docRef = doc(db, CMS_COLLECTION, config.id);
    await setDoc(docRef, {
      ...config,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Subscribe to ECOs
export function subscribeToECOs(
  onECOs: (ecos: ECORecord[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const colRef = collection(db, ECOS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: ECORecord[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as ECORecord);
      });
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      onECOs(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, ECOS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

// Save ECO
export async function saveECOToFirestore(eco: ECORecord): Promise<void> {
  const path = `${ECOS_COLLECTION}/${eco.id}`;
  try {
    const docRef = doc(db, ECOS_COLLECTION, eco.id);
    await setDoc(docRef, eco, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Seed initial dataset if database is newly initialized
export async function seedInitialProjectsIfEmpty(): Promise<boolean> {
  try {
    const colRef = collection(db, PROJECTS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty || (snap.size === 1 && snap.docs[0].id === 'connection_probe')) {
      for (const p of INITIAL_NPD_PROJECTS) {
        await saveProjectToFirestore(p);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to seed projects:', error);
    return false;
  }
}
