import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import { buttonVariants } from '@/components/ui/button';
import { UserAuthForm } from '@/components/user-auth-form';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function Login() {
  return (
    <section className="flex h-screen items-center justify-center p-4">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8',
        )}>
        <>
          <ChevronLeft className="mr-2 size-4" />
          Back
        </>
      </Link>
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <UserAuthForm mode="signin" />
          
        </CardContent>
      </Card>
    </section>
  );
}
