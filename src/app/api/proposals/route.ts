import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("proposals")
      .select(
        "id, client_id, title, number, status, issue_date, expiry_date, subtotal, tax, total, notes, created_at, updated_at"
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch {
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
      .from("proposals")
      .insert([
        {
          client_id: body.client_id ?? null,
          title: String(body.title ?? ""),
          number: body.number ? String(body.number) : null,
          status: String(body.status ?? "draft"),
          issue_date: body.issue_date ?? null,
          expiry_date: body.expiry_date ?? null,
          subtotal: Number(body.subtotal ?? 0),
          tax: Number(body.tax ?? 0),
          total: Number(body.total ?? 0),
          notes: body.notes ?? null,
        },
      ])
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String((e as any)?.message ?? e) }, { status: 400 });
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
      .from("proposals")
      .update({
        client_id: body.client_id ?? null,
        title: String(body.title ?? ""),
        number: body.number ? String(body.number) : null,
        status: String(body.status ?? "draft"),
        issue_date: body.issue_date ?? null,
        expiry_date: body.expiry_date ?? null,
        subtotal: Number(body.subtotal ?? 0),
        tax: Number(body.tax ?? 0),
        total: Number(body.total ?? 0),
        notes: body.notes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String((e as any)?.message ?? e) }, { status: 400 });
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
    const { error } = await supabaseAdmin.from("proposals").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String((e as any)?.message ?? e) }, { status: 400 });
  }
}

