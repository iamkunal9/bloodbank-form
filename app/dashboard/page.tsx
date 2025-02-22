import type { Metadata } from "next";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/overview";
import { TopPerformers } from "@/components/top-performers";
import { Search } from "@/components/search";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { DonationEventsTable } from "@/components/donation-events-table";
import { getMonthlyDonors, getTopOverview } from "./actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Blood Donation Dashboard",
  description: "A dashboard for managing blood donation events.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return redirect("/login");
  }

  const userId = userData.user.id;
  const { data: admins } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", userId);
    console.log(admins)
  if (!admins || admins.length === 0) {
    return redirect("/login");
  }

  const {
    totalDonors,
    totalRegistrations,
    citiesCovered,
    donorsChange,
    registrationsChangePercent,
    citiesChange,
  } = await getTopOverview();
  const chartData = await getMonthlyDonors();

  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Blood Donation Dashboard
            </h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Donors
                    </CardTitle>
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalDonors}</div>
                    <p className="text-xs text-muted-foreground">
                      {donorsChange} from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Registrations
                    </CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {totalRegistrations}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +{registrationsChangePercent}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Cities Covered
                    </CardTitle>
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{citiesCovered}</div>
                    <p className="text-xs text-muted-foreground">
                      {citiesChange} new cities this month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview data={chartData} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                    <CardDescription>
                      Top supervisors and cities by total registrations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TopPerformers />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="events" className="space-y-4">
              <DonationEventsTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
