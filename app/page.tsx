import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Main() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/form');
  }
  else{
    return redirect('/login');
  }

  return (
    <div className="mx-auto flex h-screen w-full items-center justify-center gap-2">
      <Button variant="link">
        <Link href="/login"> Login </Link>
      </Button>
      <Button variant="link">
        <Link href="/signup"> Sign Up </Link>
      </Button>
    </div>
  );
}
