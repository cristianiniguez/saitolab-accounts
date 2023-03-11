import { User } from 'firebase/auth';
import { collection, CollectionReference, query, where } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

const usePreferences = (user: User | null) => {
  const firestore = useFirestore();
  const preferencesRef = collection(firestore, 'preferences') as CollectionReference<Preferences>;
  const { data, error, status } = useFirestoreCollectionData(
    query(preferencesRef, where('userId', '==', user?.uid)),
    { idField: 'id' },
  );
  return { data: data?.[0], error, status };
};

export default usePreferences;
