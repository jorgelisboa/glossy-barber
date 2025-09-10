export interface Appointment {
  id: string;
  userId: string;
  status: string;
  serviceId: string;
  dateTime: {
    seconds: number;
    nanoseconds: number;
  };
  clientName: string;
  clientPhone: string;
}

export interface Service {
  id: string;
  userId: string;
  name: string;
  price: number;
  time: number;
  paymentMethod: string | null;
}
