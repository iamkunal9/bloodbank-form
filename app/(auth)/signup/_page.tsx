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
  title: 'Sign Up',
  description: 'Sign up to your account',
};

export function Signup() {
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
          <CardTitle className="text-center text-2xl">Hello!</CardTitle>
          <CardDescription className="text-center">
            Sign up for an account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <UserAuthForm mode="signup" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="hover:text-brand underline underline-offset-4">
              Already have an account? Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

export default Signup;
