import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month")); // 1-12

  try {
    let query = supabase
      .from("income")
      .select("id,date,source,description,amount")
      .order("date", { ascending: false })
      .limit(2000);

    if (year && month) {
      const start = new Date(year, month - 1, 1);
      const next = new Date(year, month, 1);
      const from = start.toISOString().slice(0, 10);
      const to = next.toISOString().slice(0, 10);
      query = query.gte("date", from).lt("date", to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}


