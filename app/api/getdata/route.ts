// app/api/files/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || null;
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;
  let formData;
  if (id) {
    const { data: d, error: fetchError } = await supabase
      .from("form-results")
      .select("*")
      .eq("user_id", userId)
      .eq("uuid", id);
    formData = d;
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
  } else {
    const { data: d, error: fetchError } = await supabase
      .from("form-results")
      .select("*")
      .eq("user_id", userId);
    formData = d;
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
  }
  // Transform the data format
  const transformedData = formData?.map((item) => ({
    uuid: item.uuid,
    supervisorName: item.supervisor_name,
    mobileNo: item.mobile_no.toString(),
    email: item.email,
    city: item.city,
    venue: item.venue_address,
    coordinatorName: item.coordinator_name,
    totalDonors: item.total_donors.toString(),
    totalRegistrations: item.total_registrations.toString(),
    endTime: item.end_time,
    bloodBank: item.blood_bank_name,
    startTime: item.start_time,
    comments: item.comments,
    eventDate: item.event_date,
    date:item.event_date
  }));

  return NextResponse.json(transformedData, { status: 200 });
}

// export async function POST(request: Request) {
//   const supabase = createClient();
//   const { data: userData, error: authError } = await supabase.auth.getUser();

//   if (authError || !userData?.user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const { filenames } = await request.json();
//     const userId = userData.user.id;

//     const results = await Promise.all(
//       filenames.map(async (filename: string) => {
//         const { data: fileContent, error } = await supabase.storage
//           .from('files')
//           .download(`${userId}/${filename}`);

//         if (error) throw error;

//         const text = await fileContent.text();
//         const parsed = Papa.parse(text, {
//           header: true,
//           dynamicTyping: true,
//         });

//         return {
//           filename,
//           data: parsed.data,
//         };
//       }),
//     );

//     return NextResponse.json({ data: results, error: null });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to process files', details: error },
//       { status: 500 },
//     );
//   }
// }

// export async function DELETE(request: Request) {
//   const supabase = createClient();
//   const { data: userData, error: authError } = await supabase.auth.getUser();

//   if (authError || !userData?.user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const userId = userData.user.id;
//   const { fileName } = await request.json();
//   const client = new Client({ connectionString: process.env.POSTGRES_URL });

//   console.log(`Received request to delete file: ${fileName}`);

//   try {
//     // 1. Delete file from storage
//     // First get the current tableHeaders
//     const { data: data, error: fetchError } = await supabase
//       .from('connectedDBInfo')
//       .select('tableHeaders')
//       .eq('userId', userId)
//       .eq('typeof', 'file');

//     if (fetchError) {
//       console.error('Error fetching tableHeaders:', fetchError);
//       return NextResponse.json({ error: fetchError.message }, { status: 500 });
//     }
//     console.log(data);
//     // return NextResponse.json({ error: 'Failed to delete file and update context' }, { status: 500 });
//     await client.connect();
//     const { data: asd, error: dropTableError } = await client.query(
//       `DROP TABLE IF EXISTS ${'file_' + userId.replaceAll('-', '_')}.${fileName}`,
//     );
//     if (dropTableError) {
//       console.error('Error dropping table:', dropTableError);
//       return NextResponse.json(
//         { error: dropTableError.message },
//         { status: 500 },
//       );
//     }

//     // Update tableHeaders by removing the file entry
//     const currentHeaders =
//       data[0]?.tableHeaders['file_' + userId.replaceAll('-', '_')] || {};
//     delete currentHeaders[fileName];

//     const { error: updateError } = await supabase
//       .from('connectedDBInfo')
//       .update({
//         tableHeaders: {
//           ['file_' + userId.replaceAll('-', '_')]: currentHeaders,
//         },
//       })
//       .eq('userId', userId)
//       .eq('typeof', 'file');

//     if (updateError) {
//       console.error('Error updating tableHeaders:', updateError);
//       return NextResponse.json({ error: updateError.message }, { status: 500 });
//     }

//     clearValueCache(userId,'file');
//     const { data:d, error } = await supabase
//       .from('connectedDBInfo')
//       .select('id')
//       .eq('userId', userId)
//       .eq('typeof', 'file');

//     if (error) {
//       console.error('Error fetching tableHeaders:', error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     const schemaName = "file_"+userId?.replaceAll('-', '_');
//     await processSelectedDBs(
//       [schemaName],
//       {
//         host: process.env.POSTGRES_HOST,
//         port: parseInt(process.env.POSTGRES_PORT),
//         user: process.env.POSTGRES_USER,
//         name: 'postgres',
//         database: process.env.POSTGRES_DB as 'postgres',
//         password: process.env.POSTGRES_PASSWORD,
//         passwordToEncryptDB: '999999',
//       },
//       d[0].id,
//       true,
//     );

//     return NextResponse.json(
//       {
//         message: 'File deleted and context updated',
//         updatedContext: Object.keys([]),
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error('Error in delete operation:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete file and update context' },
//       { status: 500 },
//     );
//   } finally {
//     await client.end();
//   }
// }
