
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginWithEmail } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email(t('invalid_email_error')),
    password: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { user, error } = await loginWithEmail(values.email, values.password);
    if (user) {
      router.push('/dashboard'); // Redirect to dashboard after login
    } else {
      console.error(error);
      // Handle error (e.g., show a toast message)
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('login_title')}</CardTitle>
          <CardDescription>
            {t('login_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input id="email" type="email" placeholder={t('email_placeholder')} {...form.register('email')} />
              {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Input id="password" type="password" placeholder={t('password_placeholder')} {...form.register('password')} />
              {form.formState.errors.password && <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              {t('login_with_email_button')}
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
            {t('login_with_google_button')}
          </Button>
          <div className="mt-4 text-center text-sm">
            {t('no_account_question')}{" "}
            <Link href="/signup" className="underline">
              {t('create_account_link')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
