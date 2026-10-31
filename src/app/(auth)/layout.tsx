import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import CoreProvider from '@/components/core-provider';
import { userRoles, UserRoleValue } from '@/models/user-role';
import { UserProvider } from '@/contexts/user-contexts';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!userSession || userSession.user.role === userRoles.USER) {
    redirect('/login');
  }

  const user = {
    id: userSession.user.id,
    name: userSession.user.name || 'Usuário',
    role: userSession.user.role as UserRoleValue,
    email: userSession.user.email,
  };

  return (
    <UserProvider user={user}>
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto px-10 py-20">
          <CoreProvider>{children}</CoreProvider>
        </div>
        <Footer />
      </div>
    </UserProvider>
  );
}
