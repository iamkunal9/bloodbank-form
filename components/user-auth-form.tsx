'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { login, signup } from '@/app/(auth)/actions';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: 'signin' | 'signup';
}

export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
});
type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const isSignUp = mode === 'signup';
  const supabase = createClient();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    if (isSignUp) {
      const { message, error } = await signup(formData);
      setIsLoading(false);
      if (error) {
        return toast.error('Something went wrong.', {
          description: message,
        });
      } else {
        return toast.success('Check your email', {
          description:
            'We sent you a login link. Be sure to check your spam too.',
        });
      }
    } else {
      const resp = await login(formData);
      setIsLoading(false);
      if (resp?.error) {
        return toast.error('Something went wrong.', {
          description: resp.message,
        });
      }
    }
  }

  async function onSignInGoogle() {
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Error signing in with Google:', error);
    }
    setIsGoogleLoading(false);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isLoading || isGoogleLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isSignUp ? 'Sign Up' : 'Sign In'} with Email
            </button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          type="submit"
          disabled={isLoading || isGoogleLoading}
          onClick={() => {
            onSignInGoogle();
          }}>
          {isGoogleLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <FcGoogle className="mr-2 size-4" />
          )}{' '}
          Google
        </Button>
      </div>
    </div>
  );
}
