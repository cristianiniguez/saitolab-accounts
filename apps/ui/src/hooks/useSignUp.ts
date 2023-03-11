import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useAuth, useFirestore } from 'reactfire';
import { CURRENCIES } from '@/constants';

const useSignUp = () => {
  const auth = useAuth();
  const firestore = useFirestore();
  const preferencesCollectionRef = collection(firestore, 'preferences');

  return async (email: string, password: string, firstName: string, lastName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    const displayName = `${firstName} ${lastName}`;
    await updateProfile(user, { displayName });

    await addDoc(preferencesCollectionRef, { currency: CURRENCIES.USD, userId: user.uid });
    return user;
  };
};

export default useSignUp;
