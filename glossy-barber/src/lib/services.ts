import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Service } from '@/types';

const servicesCollection = collection(db, 'services');

// Create
export const createService = async (userId: string, serviceData: Omit<Service, 'id' | 'userId'>) => {
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
export const getServices = async (userId: string) => {
  try {
    const q = query(servicesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const services: Service[] = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() } as Service);
    });
    return { services };
  } catch (error) {
    return { error };
  }
};

// Update
export const updateService = async (serviceId: string, serviceData: Partial<Omit<Service, 'id' | 'userId'>>) => {
  try {
    const serviceDoc = doc(db, 'services', serviceId);
    await updateDoc(serviceDoc, serviceData);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Delete
export const deleteService = async (serviceId: string) => {
  try {
    const serviceDoc = doc(db, 'services', serviceId);
    await deleteDoc(serviceDoc);
    return { success: true };
  } catch (error) {
    return { error };
  }
};