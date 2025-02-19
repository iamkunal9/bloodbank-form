'use client';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: 'signin' | 'signup';
}

export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
});


export function UserAuthForm({ className,  ...props }: UserAuthFormProps) {
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const supabase = createClient();

  


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
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          type="submit"
          disabled={isGoogleLoading}
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
