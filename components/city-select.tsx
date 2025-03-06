"use client"
import { fetchData } from "@/app/dashboard/adminactions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react";
interface CitySelectProps {
  className?: string;
  onValueChange?: (value: string) => void;
}

export function CitySelect({ onValueChange }: CitySelectProps) {
  interface CityData {
    id: number;
    city: string;
    created_at?: string;
  }
  const [cities, setCities] = useState<CityData[]>([]);
  useEffect(() => {
    fetchData(2).then((data) => {
      if (data.error) {
        console.error("Error fetching data:", data.error);
        return;
      }
      const validatedCities = (data.data as Record<string, unknown>[]).map(
        (item) => ({
          id: Number(item.id),
          city: String(item.city),
        })
      );
      setCities(validatedCities);
    });

  }, []);
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a city" />
      </SelectTrigger>
      <SelectContent>
        {cities
                              .sort((a, b) => a.city.localeCompare(b.city))
                              .map((city) => (
                              <SelectItem key={city.id} value={city.city}>
                                {city.city}
                              </SelectItem>
                              ))}
      </SelectContent>
    </Select>
  )
}

