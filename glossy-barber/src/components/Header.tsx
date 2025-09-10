'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">{t('app_name')}</h1>
      <div className="flex items-center gap-2">
        {loading ? (
          <div>{t('loading')}</div>
        ) : user ? (
          <>
            {user && user.email && <p>{user.email}</p>}
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
  );
}
