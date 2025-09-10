
'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarDays, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAppointments, createAppointment } from '@/lib/appointments';
import { getServices } from '@/lib/services';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const appointmentFormSchema = z.object({
  serviceId: z.string().min(1, 'Selecione um serviço'),
  date: z.string().min(1, 'Selecione uma data'),
  time: z.string().min(1, 'Selecione um horário'),
  clientName: z.string().min(1, 'Nome do cliente é obrigatório'),
  clientPhone: z.string().min(1, 'Telefone do cliente é obrigatório'),
});

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [dailyAppointmentsCount, setDailyAppointmentsCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const handleAddService = () => {
    // Here you would handle the logic to add the service
    console.log({
      serviceName,
      servicePrice,
      serviceTime,
      paymentMethod,
    });
    // Close the dialog after submission
    setIsServiceDialogOpen(false);
    // Optionally reset form fields
    setServiceName("");
    setServicePrice("");
    setServiceTime("");
    setPaymentMethod(null);
  };

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

      if (service) {
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
        <h1 className="text-3xl font-bold">Dashboard da Barbearia</h1>
        <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Serviço</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Serviço</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo serviço.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceName" className="text-right">
                  Nome
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
                  Preço
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
                  Tempo (min)
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
                  Método de Pagamento
                </Label>
                <Select onValueChange={(value) => setPaymentMethod(value)} value={paymentMethod || ""}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="none">Nenhum (Opcional)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddService}>Salvar Serviço</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Informação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento do Dia</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {dailyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Baseado nos agendamentos do dia</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Baseado nos agendamentos do mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyAppointmentsCount}</div>
            <p className="text-xs text-muted-foreground">Agendamentos confirmados para hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Agendamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Próximos Agendamentos</h2>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
            ) : (
              appointments
                .sort((a, b) => a.dateTime.seconds - b.dateTime.seconds) // Sort by nearest time
                .map(appt => (
                  <Card key={appt.id}>
                    <CardContent className="p-4">
                      <p className="font-semibold">{appt.clientName}</p>
                      <p className="text-sm text-muted-foreground">{new Date(appt.dateTime.seconds * 1000).toLocaleString()}</p>
                      {/* You might want to display service name here as well */}
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Adicionar Novo Agendamento</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>+ Adicionar Agendamento</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Agendamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmitAppointment)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="serviceId">Serviço</label>
                  <Select onValueChange={(value) => form.setValue('serviceId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
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
                  <label htmlFor="date">Data</label>
                  <Input id="date" type="date" {...form.register('date')} />
                  {form.formState.errors.date && <p className="text-red-500 text-xs">{form.formState.errors.date.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="time">Hora</label>
                  <Input id="time" type="time" {...form.register('time')} />
                  {form.formState.errors.time && <p className="text-red-500 text-xs">{form.formState.errors.time.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="clientName">Nome do Cliente</label>
                  <Input id="clientName" type="text" placeholder="Nome do Cliente" {...form.register('clientName')} />
                  {form.formState.errors.clientName && <p className="text-red-500 text-xs">{form.formState.errors.clientName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="clientPhone">Telefone do Cliente</label>
                  <Input id="clientPhone" type="tel" placeholder="(XX) XXXXX-XXXX" {...form.register('clientPhone')} />
                  {form.formState.errors.clientPhone && <p className="text-red-500 text-xs">{form.formState.errors.clientPhone.message}</p>}
                </div>
                <Button type="submit" className="w-full">Agendar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
