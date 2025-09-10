
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
import { useTranslation } from 'react-i18next';

export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const formSchema = z.object({
    username: z.string().min(3, t('username_min_length_error')),
    email: z.string().email(t('invalid_email_error')),
    password: z.string().min(6, t('password_min_length_error')),
    confirmPassword: z.string(),
    barbershopSize: z.string(),
    plan: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('passwords_do_not_match_error'),
    path: ['confirmPassword'],
  });

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
          <CardTitle className="text-2xl">{t('create_account_title')}</CardTitle>
          <CardDescription>
            {t('create_account_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input id="username" type="text" placeholder={t('username_placeholder')} {...form.register('username')} />
              {form.formState.errors.username && <p className="text-red-500 text-xs">{form.formState.errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Input id="email" type="email" placeholder={t('email_placeholder')} {...form.register('email')} />
              {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Input id="password" type="password" placeholder={t('password_placeholder')} {...form.register('password')} />
              {form.formState.errors.password && <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Input id="confirm-password" type="password" placeholder={t('confirm_password_placeholder')} {...form.register('confirmPassword')} />
              {form.formState.errors.confirmPassword && <p className="text-red-500 text-xs">{form.formState.errors.confirmPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Select onValueChange={(value) => form.setValue('barbershopSize', value)} defaultValue={form.getValues('barbershopSize')}>
                <SelectTrigger>
                  <SelectValue placeholder={t('barbershop_size_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">{t('small_barbershop_size')}</SelectItem>
                  <SelectItem value="medium">{t('medium_barbershop_size')}</SelectItem>
                  <SelectItem value="large">{t('large_barbershop_size')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select onValueChange={(value) => form.setValue('plan', value)} defaultValue={form.getValues('plan')}>
                <SelectTrigger>
                  <SelectValue placeholder={t('plan_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">{t('local_plan')}</SelectItem>
                  <SelectItem value="cloud">{t('cloud_plan')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              {t('create_account_with_email_button')}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('or_continue_with')}
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            {t('create_account_with_google_button')}
          </Button>
          <div className="mt-4 text-center text-sm">
            {t('already_have_account_question')}{" "}
            <Link href="/login" className="underline">
              {t('login_title')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
