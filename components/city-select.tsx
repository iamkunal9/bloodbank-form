import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
interface CitySelectProps {
  className?: string;
  onValueChange?: (value: string) => void;
}

export function CitySelect({ onValueChange }: CitySelectProps) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a city" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="mumbai">Mumbai</SelectItem>
        <SelectItem value="delhi">Delhi</SelectItem>
        <SelectItem value="bangalore">Bangalore</SelectItem>
        <SelectItem value="chennai">Chennai</SelectItem>
        <SelectItem value="kolkata">Kolkata</SelectItem>
      </SelectContent>
    </Select>
  )
}

