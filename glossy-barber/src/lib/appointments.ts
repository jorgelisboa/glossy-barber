
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const appointmentsCollection = collection(db, 'appointments');

// Create
export const createAppointment = async (userId, appointmentData) => {
  try {
    const docRef = await addDoc(appointmentsCollection, {
      userId,
      ...appointmentData,
    });
    return { id: docRef.id };
  } catch (error) {
    return { error };
  }
};

// Read
export const getAppointments = async (userId) => {
  try {
    const q = query(appointmentsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    return { appointments };
  } catch (error) {
    return { error };
  }
};

// Update
export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const appointmentDoc = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentDoc, appointmentData);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Delete
export const deleteAppointment = async (appointmentId) => {
  try {
    const appointmentDoc = doc(db, 'appointments', appointmentId);
    await deleteDoc(appointmentDoc);
    return { success: true };
  } catch (error) {
    return { error };
  }
};
