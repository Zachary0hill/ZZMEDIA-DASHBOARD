import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("id,created_at,vendor,name,amount,billing_cycle,renew_date,status,category")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) throw error;
    return NextResponse.json(data ?? [], { status: 200 });
  } catch (_e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on server" },
        { status: 500 }
      );
    }
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .insert([
        {
          vendor: String(body.vendor ?? ""),
          name: body.name ?? null,
          amount: Number(body.amount ?? 0),
          billing_cycle: String(body.billing_cycle ?? "monthly"),
          renew_date: body.renew_date ?? null,
          status: String(body.status ?? "active"),
          category: body.category ?? null,
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
      return NextResponse.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on server" },
        { status: 500 }
      );
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        vendor: body.vendor != null ? String(body.vendor) : undefined,
        name: body.name ?? undefined,
        amount: body.amount != null ? Number(body.amount) : undefined,
        billing_cycle: body.billing_cycle != null ? String(body.billing_cycle) : undefined,
        renew_date: body.renew_date ?? undefined,
        status: body.status != null ? String(body.status) : undefined,
        category: body.category ?? undefined,
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
      return NextResponse.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on server" },
        { status: 500 }
      );
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const { error } = await supabaseAdmin.from("subscriptions").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


