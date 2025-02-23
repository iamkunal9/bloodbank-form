import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/utils/supabase/server"

export async function TopPerformers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("form-results")
    .select("supervisor_name, city, total_registrations")
    .order("total_registrations", { ascending: false })
    .limit(5)
  if (error) {
    throw new Error("Failed to fetch data")
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Supervisor</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Total Registrations</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((performer,idx) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">{performer.supervisor_name}</TableCell>
            <TableCell>{performer.city}</TableCell>
            <TableCell>{performer.total_registrations}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

