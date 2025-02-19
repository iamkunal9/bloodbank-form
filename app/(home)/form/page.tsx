"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FileUploadWithPreview } from 'file-upload-with-preview';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

const formSchema = z.object({
  supervisorName: z.string().min(2),
  mobileNo: z.string().regex(/^\d{10}$/),
  email: z.string().email(),
  city: z.string().min(1),
  venue: z.string().min(5),
  coordinatorName: z.string().min(2),
  bloodBank: z.string().min(2),
  totalDonors: z.string().regex(/^\d+$/, "Must be a valid number"),
  totalRegistrations: z.string().regex(/^\d+$/, "Must be a valid number"),
  endTime: z.string(),
  startTime: z.string(),
  date: z.date(),
  photographs: z.any(),
  comments: z.string().optional(),
});

export default function BloodDonationForm() {
  const [donors, setDonors] = useState<string[]>(['']);
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    const upload = new FileUploadWithPreview('my-unique-id', {
      maxFileCount: 110,
      multiple: true,
      text: {
        browse: 'Choose',
        chooseFile: 'Take your pick...',
        label: 'Choose Files to Upload',
      },
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supervisorName: "",
      mobileNo: "",
      email: "",
      city: "",
      venue: "",
      coordinatorName: "",
      totalDonors: "",
      totalRegistrations: "",
      endTime: "",
      bloodBank: "",
      startTime: "",
      comments: "",
    },
  });

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai'];

  function addDonor() {
    setDonors([...donors, '']);
  }

  function removeDonor(index: number) {
    const newDonors = donors.filter((_, i) => i !== index);
    setDonors(newDonors);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Save to localStorage for edit functionality
    // localStorage.setItem('bloodDonationForm', JSON.stringify({
    //   ...values,
    //   date: format(values.date, 'yyyy-MM-dd'),
    //   timestamp: new Date().getTime()
    // }));
    alert('Form submitted successfully!');
  }

  // Check for existing data in localStorage
  if (typeof window !== 'undefined' && !editMode) {
    const savedData = localStorage.getItem('bloodDonationForm');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const submissionTime = new Date(parsedData.timestamp);
      const currentTime = new Date();
      const hoursDiff = (currentTime.getTime() - submissionTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 2) { // 2-hour edit window
        form.reset({
          ...parsedData,
          date: new Date(parsedData.date)
        });
        setEditMode(true);
      } else {
        localStorage.removeItem('bloodDonationForm');
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Blood Donation Event Form</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Supervisor Details */}
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="supervisorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile No</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* City Dropdown */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Venue */}
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Coordinator and Blood Bank */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="coordinatorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordinator Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodBank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="City Blood Bank" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="totalRegistrations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Registrations</FormLabel>
                  <FormControl>
                    <Input placeholder="Total Registrations" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalDonors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Doners</FormLabel>
                  <FormControl>
                    <Input placeholder="Total Doners" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date</FormLabel>
                  <FormControl>
                    
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="rounded-md border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
          </div>

          {/* Event Photographs */}
          {/* <FormField
            control={form.control}
            name="photographs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Photographs</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="custom-file-container" data-upload-id="my-unique-id"></div>

          {/* Blood Donor List */}
          <div className="space-y-4">
            <FormLabel>Blood Donor List</FormLabel>
            {donors.map((_, index) => (
              <div key={index} className="flex gap-2">
                <Input 
                  placeholder={`Donor ${index + 1} Name`}
                  value={donors[index]}
                  onChange={(e) => {
                    const newDonors = [...donors];
                    newDonors[index] = e.target.value;
                    setDonors(newDonors);
                  }}
                />
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => removeDonor(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline"
              onClick={addDonor}
            >
              Add Donor
            </Button>
          </div>

          {/* Comments */}
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional comments"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}