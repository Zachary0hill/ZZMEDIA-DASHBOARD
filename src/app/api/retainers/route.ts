import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("retainers")
      .select(
        "id, client_id, name, status, amount, billing_cycle, start_date, end_date, hours_included, hours_used, auto_renew, next_billing_date, created_at"
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
      .from("retainers")
      .insert([
        {
          client_id: body.client_id ?? null,
          name: String(body.name ?? ""),
          status: String(body.status ?? "active"),
          amount: Number(body.amount ?? 0),
          billing_cycle: String(body.billing_cycle ?? "monthly"),
          start_date: body.start_date ?? null,
          end_date: body.end_date ?? null,
          hours_included: body.hours_included ? Number(body.hours_included) : null,
          hours_used: Number(body.hours_used ?? 0),
          auto_renew: Boolean(body.auto_renew ?? true),
          next_billing_date: body.next_billing_date ?? null,
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
      .from("retainers")
      .update({
        client_id: body.client_id ?? null,
        name: String(body.name ?? ""),
        status: String(body.status ?? "active"),
        amount: Number(body.amount ?? 0),
        billing_cycle: String(body.billing_cycle ?? "monthly"),
        start_date: body.start_date ?? null,
        end_date: body.end_date ?? null,
        hours_included: body.hours_included ? Number(body.hours_included) : null,
        hours_used: Number(body.hours_used ?? 0),
        auto_renew: Boolean(body.auto_renew ?? true),
        next_billing_date: body.next_billing_date ?? null,
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
    const { error } = await supabaseAdmin.from("retainers").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String((e as any)?.message ?? e) }, { status: 400 });
  }
}

