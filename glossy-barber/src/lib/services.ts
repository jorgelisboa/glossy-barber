
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const servicesCollection = collection(db, 'services');

// Create
export const createService = async (userId, serviceData) => {
  try {
    const docRef = await addDoc(servicesCollection, {
      userId,
      ...serviceData,
    });
    return { id: docRef.id };
  } catch (error) {
    return { error };
  }
};

// Read
export const getServices = async (userId) => {
  try {
    const q = query(servicesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });
    return { services };
  } catch (error) {
    return { error };
  }
};

// Update
export const updateService = async (serviceId, serviceData) => {
  try {
    const serviceDoc = doc(db, 'services', serviceId);
    await updateDoc(serviceDoc, serviceData);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Delete
export const deleteService = async (serviceId) => {
  try {
    const serviceDoc = doc(db, 'services', serviceId);
    await deleteDoc(serviceDoc);
    return { success: true };
  } catch (error) {
    return { error };
  }
};
