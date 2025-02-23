"use server"
import { createClient } from "@/utils/supabase/server";
export async function handleCity(
  cityName: string,
  method: number
): Promise<boolean> {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    return false;
  }

  const userId = userData.user.id;
  const { data: admins } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", userId);
  if (!admins || admins.length === 0) {
    return false;
  }

  if (method === 0) {
    const { error } = await supabase
      .from("cities")
      .insert([{ city: cityName }]);

    if (error) {
      return false;
    }
  } else if (method === 1) {
    const { error } = await supabase
      .from("cities")
      .delete()
      .eq("city", cityName);

    if (error) {
        console.log("Error", error)
      return false;
    }
  }

  return true;
}


export async function handleGuest(
    email: string,
    cities: string[],
    method: number
    ): Promise<boolean> {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
        return false;
    }
    
    const userId = userData.user.id;
    const { data: admins } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", userId);
    if (!admins || admins.length === 0) {
        return false;
    }
    
    if (method === 0) {
        const { error } = await supabase.from("guests").insert([
        {
            user_id: email,
            cities,
        },
        ]);
    
        if (error) {
        return false;
        }
    } else if (method === 1) {
        const { error } = await supabase
        .from("guests")
        .delete()
        .eq("user_id", email);
    
        if (error) {
        return false;
        }
    }
    
    return true;
    }

export async function fetchData(table: number): Promise<{
  data: Record<string, unknown>[];
  error: string | null;
}> {
  const supabase = await createClient();
if (table === 1) {
    const { data, error } = await supabase.from("guests").select("*");
    console.log("Here",data)
    if (error) {
        return { data: [], error: error.message };
    }
    return { data, error: null };
} else if (table === 2) {
    const { data, error } = await supabase.from("cities").select("*");
    if (error) {
        return { data: [], error: error.message };
    }
    return { data, error: null };
} else if (table === 3) {
    const { data, error } = await supabase.from("admins").select("*");
    if (error) {
        return { data: [], error: error.message };
    }
    return { data, error: null };
} else if (table === 4) {
    const { data, error } = await supabase.from('user_emails').select('*');
    if (error) {
        return { data: [], error: error.message };
    }

    const users = data.map(user => ({
        id: user.id,
        email: user.email
    }));
    return { data: users, error: null };
}
  return { data: [], error: null };
}
