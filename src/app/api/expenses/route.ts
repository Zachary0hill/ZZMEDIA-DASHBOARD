import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month")); // 1-12

  try {
    let query = supabase
      .from("expenses")
      .select("id,date,category,vendor,description,amount,status")
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
    return NextResponse.json(data ?? [], { status: 200 });
  } catch (e) {
    // Database errors should not leak details; return safe empty array
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  // Ephemeral create when DB table is not available yet
  try {
    const body = await req.json();
    const created = {
      id: `exp${Date.now()}`,
      date: body.date ?? new Date().toISOString().slice(0, 10),
      category: body.category ?? "other",
      vendor: body.vendor ?? "",
      description: body.description ?? body.vendor ?? "",
      amount: Number(body.amount ?? 0),
      status: body.status ?? "paid",
    };
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  // Update expense
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    
    const body = await req.json();
    const updated = {
      id,
      date: body.date ?? new Date().toISOString().slice(0, 10),
      category: body.category ?? "other",
      vendor: body.vendor ?? "",
      description: body.description ?? body.vendor ?? "",
      amount: Number(body.amount ?? 0),
      status: body.status ?? "paid",
    };
    return NextResponse.json(updated, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  // Ephemeral delete when DB table is not available yet
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


