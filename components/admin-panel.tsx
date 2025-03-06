"use client";

import * as React from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  fetchData,
  handleCity,
  handleGuest,
} from "@/app/dashboard/adminactions";

// Mock data for emails and cities
// const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]

export function AdminPanel() {
  const [guestEmail, setGuestEmail] = React.useState("");
  
  const [guestCities, setGuestCities] = React.useState<string[]>([]);
  const [newCity, setNewCity] = React.useState("");
  const [guests, setGuests] = React.useState<
    { email: string; cities: string[]; user_id?: string }[]
  >([]);
  interface EmailData {
    id: string;
    email: string;
  }
  const [emails, setEmails] = React.useState<EmailData[]>([]);
  const [availableCities, setAvailableCities] = React.useState<string[]>([]);
  const [availableVenueAddresses, setAvailableVenueAddresses] = React.useState<string[]>([]);

  interface CityData {
    city: string;
  }
  interface VenueAddressData {
    venue_address: string;
  }
  const fetchCities = async () => {
    const { data: cities, error } = await fetchData(2);
    if (error) {
      return;
    }
    setAvailableCities(((cities as unknown) as CityData[]).map(city => city.city));
  };

  const fetchVenueAddresses = async () => {
    const { data: venueAddresses, error } = await fetchData(5);
    if (error) {
      return;
    }
    // Use Set to get unique venue addresses
    const uniqueAddresses = [...new Set(((venueAddresses as unknown) as VenueAddressData[]).map(city => city.venue_address))];
    setAvailableVenueAddresses(uniqueAddresses);
  };
  const fetchEmails = async () => {
    console.log("Hereerre");
    const { data: users, error } = await fetchData(4);
    if (error) {
      return;
    }
    setEmails(users.map((user: Record<string, unknown>) => ({
      id: String(user.id),
      email: String(user.email)
    })));
  };
  const fetchGuests = async () => {
    const { data: guests, error } = await fetchData(1);
    if (error) {
      return;
    }
    setGuests(guests.map((guest: Record<string, unknown>) => ({
      email: String(guest.email),
      cities: Array.isArray(guest.cities) ? guest.cities : [],
      user_id: guest.user_id ? String(guest.user_id) : undefined
    })));
  };
  React.useEffect(() => {
    fetchCities();
    fetchGuests();
    fetchEmails();
    fetchVenueAddresses();
  }, []);

  const handleAddGuest = async () => {
    if (guestEmail && guestCities.length > 0) {
      const resp = await handleGuest(guestEmail, guestCities, 0);
      if (!resp) {
        toast.error(
          `Failed to add ${guestEmail} as a guest for ${guestCities.join(
            ", "
          )}.`
        );
        return;
      }
      setGuests([...guests, { email: guestEmail, cities: guestCities }]);
      toast.success(
        `${guestEmail} has been added as a guest for ${guestCities.join(", ")}.`
      );
      setGuestEmail("");
      setGuestCities([]);
    }
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    const resp = await handleCity(newCity, 0);
    if (!resp) {
      toast.error(`Failed to add ${newCity} to the list of cities.`);
      return;
    }

    if (newCity && !availableCities.includes(newCity)) {
      setAvailableCities([...availableCities, newCity]);
      toast.success(`${newCity} has been added to the list of cities.`);
      setNewCity("");
    }
  };

  const handleRemoveGuest = (email: string) => {
    const resp = handleGuest(email, [], 1);
    if (!resp) {
      toast.error(`Failed to remove ${email} from the guest list.`);
      return;
    }

    setGuests(guests.filter((guest) => (guest.user_id || guest.email) !== email));
    toast.success(`${email} has been removed from the guest list.`);
  };

  // const handleRemoveCity = async (city: string) => {
  //   const resp = await handleCity(city, 1);
  //   if (!resp) {
  //     toast.error(`Failed to remove ${city} from the list of cities.`);
  //     return;
  //   }

  //   setAvailableCities(availableCities.filter((c) => c !== city));
  //   setGuests(
  //     guests.map((guest) => ({
  //       ...guest,
  //       cities: guest.cities.filter((c) => c !== city),
  //     }))
  //   );

  //   toast(`${city} has been removed from the list of cities.`);
  // };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add Guest</CardTitle>
          <CardDescription>Add a new guest to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="guestEmail">Email</Label>
              <Select onValueChange={setGuestEmail} value={guestEmail}>
                <SelectTrigger id="guestEmail">
                  <SelectValue placeholder="Select an email" />
                </SelectTrigger>
                <SelectContent>
                  {emails.map((email) => (
                    <SelectItem key={email.id} value={email.id}>
                      {email.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="guestCities">Venue Address</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {guestCities.length > 0
                      ? guestCities.map((city, idx) => (
                          <Badge key={idx} variant="secondary" className="mr-1">
                            {city}
                          </Badge>
                        ))
                      : "Select Venue Address"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search Venues..." />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-[200px]">
                          {availableVenueAddresses.map((city, idx) => (
                            <CommandItem
                              key={idx}
                              onSelect={() => {
                                setGuestCities(
                                  guestCities.includes(city)
                                    ? guestCities.filter((c) => c !== city)
                                    : [...guestCities, city]
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  guestCities.includes(city)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {city}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddGuest}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Guest
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add City</CardTitle>
          <CardDescription>Add a new city to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCity}>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="newCity">City Name</Label>
              <Input
                id="newCity"
                placeholder="New City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddCity}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add City
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Guests</CardTitle>
          <CardDescription>View and remove guests</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {guests.map((guest, idx) => (
              <div key={idx} className="flex justify-between items-center mb-2">
                <div>
                  <div>{emails.find(email => email.id === (guest.user_id || guest.email))?.email || guest.email}</div>
                  <div className="text-sm text-muted-foreground">
                    {guest.cities.join(", ")}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveGuest(guest.user_id || guest.email)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Cities</CardTitle>
          <CardDescription>View cities</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {availableCities.map((city, idx) => (
              <div key={idx} className="flex justify-between items-center mb-2">
                <div>{city}</div>
                {/* <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveCity(city)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button> */}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
