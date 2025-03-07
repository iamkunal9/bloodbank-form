import { createClient } from "@/utils/supabase/server";
export async function getUserRole(){
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
        return [false, false];
    }
    const userId = userData.user.id;
    const { data: admins } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", userId);
    const { data: guests } = await supabase
        .from("guests")
        .select("*")
        .eq("user_id", userId);
    let admin = true;
    let guest = true;
    if (!admins || admins.length === 0) {
        admin = false;
    }
    if (!guests || guests.length === 0) {
        guest = false;
    }

    return [admin, guest];
}