
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signupWithEmail } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string().min(3, 'O nome de usuário deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  barbershopSize: z.string(),
  plan: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não correspondem',
  path: ['confirmPassword'],
});

export default function SignupPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      barbershopSize: 'small',
      plan: 'local',
    },
  });

  const onSubmit = async (values) => {
    const { user, error } = await signupWithEmail(values.email, values.password, values.username, values.barbershopSize, values.plan);
    if (user) {
      router.push('/dashboard'); // Redirect to dashboard after signup
    } else {
      console.error(error);
      // Handle error (e.g., show a toast message)
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Crie sua conta para gerenciar sua barbearia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input id="username" type="text" placeholder="Nome de usuário" {...form.register('username')} />
              {form.formState.errors.username && <p className="text-red-500 text-xs">{form.formState.errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Input id="email" type="email" placeholder="seu@email.com" {...form.register('email')} />
              {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Input id="password" type="password" placeholder="sua senha" {...form.register('password')} />
              {form.formState.errors.password && <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Input id="confirm-password" type="password" placeholder="confirme sua senha" {...form.register('confirmPassword')} />
              {form.formState.errors.confirmPassword && <p className="text-red-500 text-xs">{form.formState.errors.confirmPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Select onValueChange={(value) => form.setValue('barbershopSize', value)} defaultValue={form.getValues('barbershopSize')}>
                <SelectTrigger>
                  <SelectValue placeholder="Tamanho da barbearia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequena (1-2 pessoas)</SelectItem>
                  <SelectItem value="medium">Média (3-5 pessoas)</SelectItem>
                  <SelectItem value="large">Grande (6+ pessoas)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select onValueChange={(value) => form.setValue('plan', value)} defaultValue={form.getValues('plan')}>
                <SelectTrigger>
                  <SelectValue placeholder="Plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Plano Local (Grátis)</SelectItem>
                  <SelectItem value="cloud">Plano Nuvem (R$ 19,99/mês)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Criar Conta com Email
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Criar Conta com Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
