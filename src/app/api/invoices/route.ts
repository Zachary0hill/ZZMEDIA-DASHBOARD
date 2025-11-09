import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("id, client_id, number, status, issue_date, due_date, subtotal, tax, total, amount_paid")
      .order("issue_date", { ascending: false })
      .limit(200);
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on server" }, { status: 500 });
    }
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from("invoices")
      .insert([
        {
          client_id: body.client_id ?? null,
          number: String(body.number ?? "").trim(),
          status: String(body.status ?? "draft"),
          issue_date: body.issue_date ?? null,
          due_date: body.due_date ?? null,
          subtotal: Number(body.subtotal ?? 0),
          tax: Number(body.tax ?? 0),
          total: Number(body.total ?? 0),
          amount_paid: Number(body.amount_paid ?? 0),
        },
      ])
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on server" }, { status: 500 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from("invoices")
      .update({
        client_id: body.client_id ?? null,
        number: String(body.number ?? "").trim(),
        status: String(body.status ?? "draft"),
        issue_date: body.issue_date ?? null,
        due_date: body.due_date ?? null,
        subtotal: Number(body.subtotal ?? 0),
        tax: Number(body.tax ?? 0),
        total: Number(body.total ?? 0),
        amount_paid: Number(body.amount_paid ?? 0),
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on server" }, { status: 500 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const { error } = await supabaseAdmin.from("invoices").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


