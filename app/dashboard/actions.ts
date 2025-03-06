"use server"

import { createClient } from "@/utils/supabase/server";
export async function getTopOverview(): Promise<TopOverviewData> {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return {
        totalDonors: 0,
        totalRegistrations: 0,
        citiesCovered: 0,
        donorsChange: '0',
        registrationsChangePercent: 0,
        citiesChange: '0',
      };
  }

  const userId = userData.user.id;
  const { data: admins } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", userId);
  if (!admins || admins.length === 0) {
    return {
        totalDonors: 0,
        totalRegistrations: 0,
        citiesCovered: 0,
        donorsChange: '0',
        registrationsChangePercent: 0,
        citiesChange: '0',
      };
  }
  // Get current and last month dates
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Get data for current month
  const { data: currentMonthData, error: currentError } = await supabase
    .from("form-results")
    .select("total_donors, total_registrations, city, event_date")
    .gte(
      "event_date",
      `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-01`
    )
    .lt(
      "event_date",
      `${currentYear}-${(currentMonth + 2).toString().padStart(2, "0")}-01`
    );

  // Get data for last month
  const { data: lastMonthData, error: lastError } = await supabase
    .from("form-results")
    .select("total_donors, total_registrations, city, event_date")
    .gte(
      "event_date",
      `${lastMonthYear}-${(lastMonth + 1).toString().padStart(2, "0")}-01`
    )
    .lt(
      "event_date",
      `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-01`
    );

  if (currentError || lastError) {
    throw new Error("Failed to fetch data");
  }

  // Calculate current month totals
  const currentTotalDonors = currentMonthData.reduce(
    (sum, result) => sum + (parseInt(result.total_donors) || 0),
    0
  );
  const currentTotalRegistrations = currentMonthData.reduce(
    (sum, result) => sum + (parseInt(result.total_registrations) || 0),
    0
  );
  const currentCities = new Set(currentMonthData.map((result) => result.city))
    .size;

  // Calculate last month totals
  const lastTotalDonors = lastMonthData.reduce(
    (sum, result) => sum + (parseInt(result.total_donors) || 0),
    0
  );
  const lastTotalRegistrations = lastMonthData.reduce(
    (sum, result) => sum + (parseInt(result.total_registrations) || 0),
    0
  );
  const lastCities = new Set(lastMonthData.map((result) => result.city)).size;

  const donorsChange = currentTotalDonors - lastTotalDonors;
  const citiesChange = currentCities - lastCities;

  return {
    totalDonors: currentTotalDonors,
    totalRegistrations: currentTotalRegistrations,
    citiesCovered: currentCities,
    donorsChange: `${donorsChange >= 0 ? "+" : ""}${donorsChange}`,
    registrationsChangePercent: lastTotalRegistrations
      ? Math.round(
          ((currentTotalRegistrations - lastTotalRegistrations) /
            lastTotalRegistrations) *
            100
        )
      : 0,
    citiesChange: `${citiesChange >= 0 ? "+" : ""}${citiesChange}`,
  };
}
interface TopOverviewData {
    totalDonors: number;
    totalRegistrations: number;
    citiesCovered: number;
    donorsChange: string;
    registrationsChangePercent: number;
    citiesChange: string;
  }
  
export async function getMonthlyDonors() {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return [];
  }

  const userId = userData.user.id;
  const { data: admins } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", userId);
  if (!admins || admins.length === 0) {
    return [];
  }
  const now = new Date();
  const currentYear = now.getFullYear();

  const { data, error } = await supabase
    .from("form-results")
    .select("total_donors, event_date")
    .gte("event_date", `${currentYear}-01-01`)
    .lte("event_date", `${currentYear}-12-31`);

  if (error) {
    throw new Error("Failed to fetch monthly donors data");
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyTotals = months.map((name, index) => {
    const monthData = data.filter((item) => {
      const itemDate = new Date(item.event_date);
      return itemDate.getMonth() === index;
    });
    const total = monthData.reduce(
      (sum, item) => sum + (parseInt(item.total_donors) || 0),
      0
    );
    return { name, total };
  });

  return monthlyTotals;
}

export async function deleteEvent(uuid: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return false;
  }

  const userId = userData.user.id;
  const { data: admins } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", userId);
  if (!admins || admins.length === 0) {
    return false;
  }

  const { error } = await supabase
    .from("form-results")
    .delete()
    .eq("uuid", uuid);

  return !error;
}