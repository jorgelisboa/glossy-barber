
'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarDays, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAppointments, createAppointment, deleteAppointment, updateAppointment, updateAppointmentStatus } from '@/lib/appointments';
import { getServices, createService, deleteService, updateService } from '@/lib/services';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Appointment, Service } from '@/types';

const getAppointmentFormSchema = (t: (key: string) => string) => z.object({
  serviceId: z.string().min(1, t('select_service_error')),
  date: z.string().min(1, t('select_date_error')),
  time: z.string().min(1, t('select_time_error')),
  clientName: z.string().min(1, t('client_name_error')),
  clientPhone: z.string().min(1, t('client_phone_error')),
});

import { useTranslation } from 'next-i18next';

const DashboardPage = () => {
  const { t } = useTranslation('common');
  const { user, loading } = useAuth();
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [dailyAppointmentsCount, setDailyAppointmentsCount] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isServiceEditDialogOpen, setIsServiceEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleCompleteService = async (service) => {
    if (!user) return;

    const appointmentData = {
      serviceId: service.id,
      dateTime: new Date(),
      clientName: "Cliente",
      clientPhone: "",
      status: 'completed',
    };

    const { error } = await createAppointment(user.uid, appointmentData);

    if (error) {
      console.error('Error completing service:', error);
    } else {
      fetchDashboardData();
    }
  };

  const onSubmitUpdateService = async () => {
    if (!user || !editingService) return;

    const serviceData = {
      name: serviceName,
      price: parseFloat(servicePrice),
      time: parseInt(serviceTime),
      paymentMethod: paymentMethod,
    };

    const { error } = await updateService(editingService.id, serviceData);

    if (error) {
      console.error('Error updating service:', error);
    } else {
      setIsServiceEditDialogOpen(false);
      setEditingService(null);
      // Reset form fields
      setServiceName("");
      setServicePrice("");
      setServiceTime("");
      setPaymentMethod(null);
      fetchDashboardData();
    }
  };

  const handleAddService = async () => {
    if (!user) return;

    const serviceData = {
      name: serviceName,
      price: parseFloat(servicePrice),
      time: parseInt(serviceTime),
      paymentMethod: paymentMethod,
    };

    const { error } = await createService(user.uid, serviceData);

    if (error) {
      console.error('Error creating service:', error);
      // Handle error
    } else {
      // Close the dialog after submission
      setIsServiceDialogOpen(false);
      // Optionally reset form fields
      setServiceName("");
      setServicePrice("");
      setServiceTime("");
      setPaymentMethod(null);
      fetchDashboardData(); // Refresh data
    }
  };

  const appointmentFormSchema = getAppointmentFormSchema(t);

  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      serviceId: '',
      date: '',
      time: '',
      clientName: '',
      clientPhone: '',
    },
  });

  const fetchDashboardData = async () => {
    if (!user) return;

    // Fetch appointments and services
    const { appointments: fetchedAppointments, error: apptError } = await getAppointments(user.uid);
    const { services: fetchedServices, error: serviceError } = await getServices(user.uid);

    if (apptError || serviceError) {
      console.error('Error fetching dashboard data:', apptError || serviceError);
      return;
    }

    setAppointments(fetchedAppointments);
    setServices(fetchedServices);

    // Calculate daily and monthly revenue, and daily appointments count
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let currentDailyRevenue = 0;
    let currentMonthlyRevenue = 0;
    let currentDailyAppointmentsCount = 0;

    fetchedAppointments.forEach(appt => {
      const apptDate = new Date(appt.dateTime.seconds * 1000); // Assuming dateTime is a Firestore Timestamp
      const service = fetchedServices.find(s => s.id === appt.serviceId);

      // Only count completed appointments towards revenue
      if (service && appt.status === 'completed') {
        if (apptDate >= startOfDay) {
          currentDailyRevenue += service.price;
          currentDailyAppointmentsCount++;
        }
        if (apptDate >= startOfMonth) {
          currentMonthlyRevenue += service.price;
        }
      }
    });

    setDailyRevenue(currentDailyRevenue);
    setMonthlyRevenue(currentMonthlyRevenue);
    setDailyAppointmentsCount(currentDailyAppointmentsCount);
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleOpenServiceEditDialog = (service: Service) => {
    setEditingService(service);
    setServiceName(service.name);
    setServicePrice(service.price.toString());
    setServiceTime(service.time.toString());
    setPaymentMethod(service.paymentMethod);
    setIsServiceEditDialogOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!user) return;
    const { error } = await deleteService(serviceId);
    if (error) {
      console.error('Error deleting service:', error);
    } else {
      fetchDashboardData(); // Refresh data
    }
  };

  const handleOpenEditDialog = (appointment) => {
    setEditingAppointment(appointment);
    const apptDate = new Date(appointment.dateTime.seconds * 1000);
    form.reset({
      serviceId: appointment.serviceId,
      date: apptDate.toISOString().split('T')[0],
      time: apptDate.toTimeString().split(' ')[0].substring(0, 5),
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!user) return;
    const { error } = await deleteAppointment(appointmentId);
    if (error) {
      console.error('Error deleting appointment:', error);
    } else {
      fetchDashboardData(); // Refresh data
    }
  };

  const handleMarkAsCompleted = async (appointmentId) => {
    if (!user) return;
    const { error } = await updateAppointmentStatus(appointmentId, 'completed');
    if (error) {
      console.error('Error marking appointment as completed:', error);
    } else {
      fetchDashboardData(); // Refresh data
    }
  };

  const onSubmitUpdateAppointment = async (values) => {
    if (!user || !editingAppointment) return;

    const [year, month, day] = values.date.split('-').map(Number);
    const [hours, minutes] = values.time.split(':').map(Number);
    const dateTime = new Date(year, month - 1, day, hours, minutes);

    const { error } = await updateAppointment(editingAppointment.id, {
      serviceId: values.serviceId,
      dateTime: dateTime,
      clientName: values.clientName,
      clientPhone: values.clientPhone,
    });

    if (error) {
      console.error('Error updating appointment:', error);
    } else {
      form.reset();
      setIsEditDialogOpen(false);
      setEditingAppointment(null);
      fetchDashboardData();
    }
  };

  const onSubmitAppointment = async (values) => {
    if (!user) return;

    const [year, month, day] = values.date.split('-').map(Number);
    const [hours, minutes] = values.time.split(':').map(Number);
    const dateTime = new Date(year, month - 1, day, hours, minutes);

    const { error } = await createAppointment(user.uid, {
      serviceId: values.serviceId,
      dateTime: dateTime,
      clientName: values.clientName,
      clientPhone: values.clientPhone,
    });

    if (error) {
      console.error('Error creating appointment:', error);
      // Handle error
    } else {
      form.reset();
      setIsDialogOpen(false);
      fetchDashboardData(); // Refresh data
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('barbershop_dashboard_title')}</h1>
        <Dialog open={isServiceDialogOpen || isServiceEditDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsServiceDialogOpen(false);
            setIsServiceEditDialogOpen(false);
            setEditingService(null);
            setServiceName("");
            setServicePrice("");
            setServiceTime("");
            setPaymentMethod(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsServiceDialogOpen(true)}>{t('add_service_button')}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingService ? t('edit_service_title') : t('add_new_service_title')}</DialogTitle>
              <DialogDescription>
                {t('fill_service_details')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceName" className="text-right">
                  {t('service_name')}
                </Label>
                <Input
                  id="serviceName"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="servicePrice" className="text-right">
                  {t('service_price')}
                </Label>
                <Input
                  id="servicePrice"
                  type="number"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceTime" className="text-right">
                  {t('service_time')}
                </Label>
                <Input
                  id="serviceTime"
                  type="number"
                  value={serviceTime}
                  onChange={(e) => setServiceTime(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentMethod" className="text-right">
                  {t('payment_method')}
                </Label>
                <Select onValueChange={(value) => setPaymentMethod(value)} value={paymentMethod || ""}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('select_method_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">{t('credit_card')}</SelectItem>
                    <SelectItem value="debit_card">{t('debit_card')}</SelectItem>
                    <SelectItem value="cash">{t('cash')}</SelectItem>
                    <SelectItem value="pix">{t('pix')}</SelectItem>
                    <SelectItem value="none">{t('none_optional')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={editingService ? onSubmitUpdateService : handleAddService}>{editingService ? t('save_changes_button') : t('save_service')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Informação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('daily_revenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {dailyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{t('based_on_daily_appointments')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('monthly_revenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{t('based_on_monthly_appointments')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('appointments_today')}</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyAppointmentsCount}</div>
            <p className="text-xs text-muted-foreground">{t('confirmed_appointments_today')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Agendamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('upcoming_appointments')}</h2>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-muted-foreground">{t('no_appointments_found')}</p>
            ) : (
              appointments
                .sort((a, b) => a.dateTime.seconds - b.dateTime.seconds) // Sort by nearest time
                .map(appt => (
                  <Card key={appt.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{appt.clientName}</p>
                        <p className="text-sm text-muted-foreground">{new Date(appt.dateTime.seconds * 1000).toLocaleString()} ({appt.status})</p>
                        {/* You might want to display service name here as well */}
                      </div>
                      <div className="flex gap-2">
                        {appt.status !== 'completed' && (
                          <Button variant="outline" size="sm" onClick={() => handleMarkAsCompleted(appt.id)}>{t('mark_as_completed_button')}</Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(appt)}>{t('edit_button')}</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteAppointment(appt.id)}>{t('delete_button')}</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">{t('add_new_appointment_title')}</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>+ {t('add_appointment_button')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('create_new_appointment_title')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmitAppointment)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="serviceId">{t('service')}</label>
                  <Select onValueChange={(value) => form.setValue('serviceId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_service_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - R$ {service.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.serviceId && <p className="text-red-500 text-xs">{form.formState.errors.serviceId.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="date">{t('date')}</label>
                  <Input
                    id="date"
                    type="date"
                    {...form.register('date')}
                    value={form.watch('date')}
                    onChange={(e) => form.setValue('date', e.target.value)}
                  />
                  {form.formState.errors.date && <p className="text-red-500 text-xs">{form.formState.errors.date.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="time">{t('time')}</label>
                  <Input
                    id="time"
                    type="time"
                    {...form.register('time')}
                    value={form.watch('time')}
                    onChange={(e) => form.setValue('time', e.target.value)}
                  />
                  {form.formState.errors.time && <p className="text-red-500 text-xs">{form.formState.errors.time.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="clientName">{t('client_name')}</label>
                  <Input id="clientName" type="text" placeholder={t('client_name_placeholder')} {...form.register('clientName')} />
                  {form.formState.errors.clientName && <p className="text-red-500 text-xs">{form.formState.errors.clientName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="clientPhone">{t('client_phone')}</label>
                  <Input id="clientPhone" type="tel" placeholder={t('client_phone_placeholder')} {...form.register('clientPhone')} />
                  {form.formState.errors.clientPhone && <p className="text-red-500 text-xs">{form.formState.errors.clientPhone.message}</p>}
                </div>
                <Button type="submit" className="w-full">{t('schedule_button')}</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('edit_appointment_title')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmitUpdateAppointment)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="serviceId">{t('service')}</label>
                  <Select onValueChange={(value) => form.setValue('serviceId', value)} defaultValue={editingAppointment?.serviceId}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_service_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - R$ {service.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.serviceId && <p className="text-red-500 text-xs">{form.formState.errors.serviceId.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="date">{t('date')}</label>
                  <Input
                    id="date"
                    type="date"
                    {...form.register('date')}
                    value={form.watch('date')}
                    onChange={(e) => form.setValue('date', e.target.value)}
                  />
                  {form.formState.errors.date && <p className="text-red-500 text-xs">{form.formState.errors.date.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="time">{t('time')}</label>
                  <Input
                    id="time"
                    type="time"
                    {...form.register('time')}
                    value={form.watch('time')}
                    onChange={(e) => form.setValue('time', e.target.value)}
                  />
                  {form.formState.errors.time && <p className="text-red-500 text-xs">{form.formState.errors.time.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="clientName">{t('client_name')}</label>
                  <Input id="clientName" type="text" placeholder={t('client_name_placeholder')} {...form.register('clientName')} />
                  {form.formState.errors.clientName && <p className="text-red-500 text-xs">{form.formState.errors.clientName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="clientPhone">{t('client_phone')}</label>
                  <Input id="clientPhone" type="tel" placeholder={t('client_phone_placeholder')} {...form.register('clientPhone')} />
                  {form.formState.errors.clientPhone && <p className="text-red-500 text-xs">{form.formState.errors.clientPhone.message}</p>}
                </div>
                <Button type="submit" className="w-full">{t('save_changes_button')}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Seção de Serviços */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('services_title')}</h2>
        <div className="space-y-4">
          {services.length === 0 ? (
            <p className="text-muted-foreground">{t('no_services_found')}</p>
          ) : (
            services.map(service => (
              <Card key={service.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-muted-foreground">R$ {service.price.toFixed(2)} - {service.time} min</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCompleteService(service)}>{t('complete_button')}</Button>
                    <Button variant="outline" size="sm" onClick={() => handleOpenServiceEditDialog(service)}>{t('edit_button')}</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>{t('delete_button')}</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
