'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Scissors, CalendarDays, DollarSign, Cloud, Laptop, BarChartBig } from "lucide-react";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* Cabeçalho */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">{t('app_name')}</h1>
        <div className="flex items-center gap-2">
          {loading ? (
            <div>{t('loading')}</div>
          ) : user ? (
            <>
              {/* Explicitly assert user as a non-null type */}
              {(user as { email: string }).email && <p>{(user as { email: string }).email}</p>}
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>{t('logout')}</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{t('sign_in')}</Button>
              </Link>
              <Link href="/signup">
                <Button>{t('create_free_account')}</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {/* Seção 1: Slogan (Hero) */}
        <section className="container mx-auto px-4 text-center py-20 sm:py-28">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            {t('slogan_title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('slogan_description')}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg">{t('start_for_free_button')}</Button>
            <Button size="lg" variant="outline">{t('view_features_button')}</Button>
          </div>
        </section>

        {/* Seção 2: O que o software faz (Funcionalidades) */}
        <section id="funcionalidades" className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold">
                {t('features_section_title')}
              </h3>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                {t('features_section_description')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <CalendarDays className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{t('smart_agenda_title')}</CardTitle>
                  <CardDescription>
                    {t('smart_agenda_description')}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Scissors className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{t('services_prices_title')}</CardTitle>
                  <CardDescription>
                    {t('services_prices_description')}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <BarChartBig className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{t('financial_balance_title')}</CardTitle>
                  <CardDescription>
                    {t('financial_balance_description')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção 3: Preços */}
        <section id="precos" className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold">
              {t('pricing_section_title')}
            </h3>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              {t('pricing_section_description')}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Plano Freemium - Local */}
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Laptop className="h-7 w-7" />
                  <CardTitle className="text-2xl">{t('local_plan_title')}</CardTitle>
                </div>
                <CardDescription>
                  {t('local_plan_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-4xl font-bold mb-4">{t('free_price')}</p>
                <ul className="space-y-3 mb-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span dangerouslySetInnerHTML={{ __html: t('appointments_limit') }} />
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span dangerouslySetInnerHTML={{ __html: t('services_limit') }} />
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{t('daily_weekly_report')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span dangerouslySetInnerHTML={{ __html: t('local_data_storage') }} />
                  </li>
                </ul>
                <Button className="w-full mt-auto" variant="outline">{t('start_for_free_plan_button')}</Button>
              </CardContent>
            </Card>

            {/* Plano Pago - Nuvem */}
            <Card className="border-primary flex flex-col relative">
              <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  {t('most_popular_badge')}
                </span>
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Cloud className="h-7 w-7 text-primary" />
                  <CardTitle className="text-2xl">{t('cloud_plan_title')}</CardTitle>
                </div>
                <CardDescription>
                  {t('cloud_plan_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-4xl font-bold mb-4">$6.00 <span className="text-lg font-normal text-muted-foreground">/month</span></p>
                <ul className="space-y-3 mb-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span dangerouslySetInnerHTML={{ __html: t('unlimited_appointments') }} />
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span dangerouslySetInnerHTML={{ __html: t('unlimited_services') }} />
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{t('advanced_financial_reports')}</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold text-primary">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{t('cloud_sync')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{t('multi_device_access')}</span>
                  </li>
                   <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{t('automatic_secure_backup')}</span>
                  </li>
                </ul>
                <Button className="w-full mt-auto">{t('subscribe_cloud_plan_button')}</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-muted">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>{t('footer_text', { year: new Date().getFullYear(), app_name: t('app_name') })}</p>
        </div>
      </footer>
    </div>
  );
}