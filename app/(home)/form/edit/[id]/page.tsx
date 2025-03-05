"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FileUploadWithPreview } from "file-upload-with-preview";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import React from "react";
import { fetchData } from "@/app/dashboard/adminactions";
import { getAllFilesCount } from "./actions";
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
  comments: z.string().optional(),
  newsLinks: z.string().optional(),
  institute_name: z.string().min(2, "Institute name must be at least 2 characters"),
});
interface FilesUploaded {
  eventImages: number;
  donerListImages: number;
  prMediaImages: number;
}
export default function BloodDonationForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [editMode, setEditMode] = useState(false);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);

  const supabase = createClient();
  const [upload, setUpload] = useState<FileUploadWithPreview | null>(null);
  const [upload2, setUpload2] = useState<FileUploadWithPreview | null>(null);
  const [upload3, setUpload3] = useState<FileUploadWithPreview | null>(null);
  const [filesCount, setFilesCount] = useState<FilesUploaded | null>(null);
  interface CityData {
    id: number;
    city: string;
    created_at?: string;
  }
  const [cities, setCities] = useState<CityData[]>([]);

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
      newsLinks: "",
      institute_name: "",
      date: new Date(),
    },
  });

  const checkIsAlreadySubmitted = useCallback(() => {
    fetch(`/api/getdata?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getAllFilesCount(id)
        .then((x)=>{
          if (x)
            setFilesCount(x);
        })
        if (data.length > 0) {
          setIsAlreadySubmitted(true);
          const formData = {
            ...data[0],
            date: data[0].date ? new Date(data[0].date) : new Date(),
          };
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
            console.log(validatedCities)

          }).finally(
            ()=>{
              console.log("The form will be resetted to ", formData)
              form.reset(formData);
            }
          )
        }
      });
  }, [form, id]);

  useEffect(() => {
    

    checkIsAlreadySubmitted();
  }, [checkIsAlreadySubmitted]);

  React.useEffect(() => {
    const oldContainer = document.querySelector(
      '[data-upload-id="my-unique-id"]'
    );
    const oldContainer2 = document.querySelector(
      '[data-upload-id="my-unique-id2"]'
    );
    const oldContainer3 = document.querySelector(
      '[data-upload-id="my-unique-id3"]'
    );

    if (oldContainer) {
      oldContainer.innerHTML = "";
    }
    if (oldContainer2) {
      oldContainer2.innerHTML = "";
    }
    if (oldContainer3) {
      oldContainer3.innerHTML = "";
    }

    const uploadInstance = new FileUploadWithPreview("my-unique-id", {
      maxFileCount: 110,
      multiple: true,
      accept: "image/png, image/jpeg, image/jpg",
      text: {
        browse: "Choose",
        chooseFile: "Take your pick...",
        label: `Choose Files to Upload (Count: ${filesCount?.eventImages})`,
      },
    });

    const upload2Instance = new FileUploadWithPreview("my-unique-id2", {
      maxFileCount: 50,
      multiple: true,
      accept: "image/png, image/jpeg, image/jpg",
      text: {
        browse: "Choose",
        chooseFile: "Take your pick...",
        label: `Choose Blood Doner List to Upload (Count: ${filesCount?.donerListImages})`,
      },
    });

    const upload3Instance = new FileUploadWithPreview("my-unique-id3", {
      maxFileCount: 20,
      multiple: true,
      accept: "application/pdf, image/png, image/jpeg, image/jpg",
      text: {
        browse: "Choose",
        chooseFile: "Take your pick...",
        label: `Upload Newspaper Articles (PDF/Images) (Count: ${filesCount?.prMediaImages})`,
      },
    });

    setUpload(uploadInstance);
    setUpload2(upload2Instance);
    setUpload3(upload3Instance);
  }, [filesCount]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData?.user) {
      alert("Unauthorized");
      return;
    }

    const userId = userData.user.id;

    if (isAlreadySubmitted && !editMode) {
      alert("Form already submitted");
      return;
    }
    let data;
    if (editMode) {
      const { data: d, error } = await supabase
        .from("form-results")
        .update({
          supervisor_name: values.supervisorName,
          mobile_no: values.mobileNo,
          email: values.email,
          city: values.city,
          venue_address: values.venue,
          coordinator_name: values.coordinatorName,
          blood_bank_name: values.bloodBank,
          total_donors: values.totalDonors,
          total_registrations: values.totalRegistrations,
          start_time: values.startTime,
          end_time: values.endTime,
          event_date: values.date,
          comments: values.comments,
          news_links: values.newsLinks,
          institute_name: values.institute_name,
          user_id: userId,
        })
        .eq("user_id", userId)
        .eq("uuid", id)
        .select("uuid");
      if (error) {
        console.error("Error updating data:", error);
        alert("Failed to update form");
        return;
      }
      data = d;
    } else {
      const { data: d, error } = await supabase
        .from("form-results")
        .insert({
          supervisor_name: values.supervisorName,
          mobile_no: values.mobileNo,
          email: values.email,
          city: values.city,
          venue_address: values.venue,
          coordinator_name: values.coordinatorName,
          blood_bank_name: values.bloodBank,
          total_donors: values.totalDonors,
          total_registrations: values.totalRegistrations,
          start_time: values.startTime,
          end_time: values.endTime,
          event_date: values.date,
          comments: values.comments,
          news_links: values.newsLinks,
          institute_name: values.institute_name,
          user_id: userId,
        })
        .select("uuid");
      if (error) {
        console.error("Error inserting data:", error);
        alert("Failed to submit form");
        return;
      }
      data = d;
    }

    const eventImages = upload?.cachedFileArray || [];
    const bloodDonorList = upload2?.cachedFileArray || [];
    const newspaperFiles = upload3?.cachedFileArray || [];

    console.log(eventImages);
    console.log(bloodDonorList);

    for (const file of eventImages) {
      const fileName = file.name.split(":")[0]; // Get original name without upload ID
      const fileExtension = fileName.split(".").pop() || "png"; // Get extension or default to png
      const randomId = Math.random().toString(36).substring(2, 15);
      const finalFileName = `${randomId}.${fileExtension}`;
      const { error } = await supabase.storage
        .from("event-images")
        .upload(`${userId}/${data[0].uuid}/${finalFileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        console.error("Error uploading file:", error);
      }
    }
    for (const file of bloodDonorList) {
      const fileName = file.name.split(":")[0]; // Get original name without upload ID
      const fileExtension = fileName.split(".").pop() || "png"; // Get extension or default to png
      const randomId = Math.random().toString(36).substring(2, 15);
      const finalFileName = `${randomId}.${fileExtension}`;

      const { error } = await supabase.storage
        .from("blood-donor-list")
        .upload(`${userId}/${data[0].uuid}/${finalFileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        console.error("Error uploading file:", error);
      }
    }
    for (const file of newspaperFiles) {
      const fileName = file.name.split(":")[0]; // Get original name without upload ID
      const fileExtension = fileName.split(".").pop() || "pdf"; // Get extension or default to pdf
      const randomId = Math.random().toString(36).substring(2, 15);
      const finalFileName = `${randomId}.${fileExtension}`;

      const { error } = await supabase.storage
        .from("newspaper-articles")
        .upload(`${userId}/${data[0].uuid}/${finalFileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        console.error("Error uploading file:", error);
      }
    }
    checkIsAlreadySubmitted();
    setEditMode(false);
    alert("Form submitted successfully!");
  }

  return (
    <>
      <Link
        href="/form"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "m-10 left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <ChevronLeft className="mr-2 size-4" />
          Back
        </>
      </Link>

      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Form</h1>

        <div className="relative">
          {isAlreadySubmitted && !editMode && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
              <Button
                onClick={() => setEditMode(true)}
                className="bg-primary text-black px-6 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
              >
                Click here to edit
              </Button>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Supervisor Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Venue */}
              <FormField
                control={form.control}
                name="institute_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institute Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter institute name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <FormLabel>Total Donors</FormLabel>
                      <FormControl>
                        <Input placeholder="Total Donors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border w-full sm:w-auto"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* File Uploads */}
              <div className="space-y-6">
                <div
                  className="custom-file-container"
                  data-upload-id="my-unique-id"
                ></div>
                <div
                  className="custom-file-container"
                  data-upload-id="my-unique-id2"
                ></div>
                
                {/* PR and Media Section */}
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-lg font-medium mb-4">PR and Media</h3>
                  
                  {/* Newspaper Upload */}
                  <div className="mb-4">
                    <div
                      className="custom-file-container"
                      data-upload-id="my-unique-id3"
                    ></div>
                  </div>
                  
                  {/* News Links */}
                  <FormField
                    control={form.control}
                    name="newsLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Online News Links</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter comma-separated links to online news articles"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
      </div>
    </>
  );
}
