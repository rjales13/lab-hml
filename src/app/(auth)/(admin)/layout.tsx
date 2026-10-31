import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!userSession || userSession.user.role !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}
