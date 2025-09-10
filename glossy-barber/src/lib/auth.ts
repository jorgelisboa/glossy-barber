
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const signupWithEmail = async (email, password, username, barbershopSize, plan) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      username: username,
      barbershopSize: barbershopSize,
      plan: plan,
    });

    return { user };
  } catch (error) {
    return { error };
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { user };
  } catch (error) {
    return { error };
  }
};
