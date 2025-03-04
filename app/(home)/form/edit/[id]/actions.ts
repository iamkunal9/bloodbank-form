"use server"
import { createClient } from "@/utils/supabase/server";

interface FilesUploaded {
    eventImages: number;
    donerListImages: number;
    prMediaImages: number;
}
export async function getAllFilesCount(form_id: string): Promise<FilesUploaded | null> {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return null;
  }

  const userId = userData.user.id;
  const folderPath = `${userId}/${form_id}`;

  try {
    // Get files from event-images bucket
    const { data: eventFiles, error: eventError } = await supabase
      .storage
      .from('event-images')
      .list(folderPath);

    if (eventError) throw eventError;

    // Get files from blood-donor-list bucket
    const { data: donorFiles, error: donorError } = await supabase
      .storage
      .from('blood-donor-list')
      .list(folderPath);

    if (donorError) throw donorError;

    // Get files from newspaper-articles bucket
    const { data: prFiles, error: prError } = await supabase
      .storage
      .from('newspaper-articles')
      .list(folderPath);

    if (prError) throw prError;

    return {
      eventImages: eventFiles?.length || 0,
      donerListImages: donorFiles?.length || 0,
      prMediaImages: prFiles?.length || 0
    };
  } catch (error) {
    console.error('Error fetching file counts:', error);
    return null;
  }
}