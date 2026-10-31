import { LoginTemplate } from '@/templates/login';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { userRoles } from '@/models/user-role';

export default async function LoginPage() {
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (userSession && userSession.user.role !== userRoles.USER) {
    redirect('/');
  }

  return <LoginTemplate />;
}
