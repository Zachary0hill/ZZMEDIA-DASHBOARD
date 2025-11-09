import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("rate_cards")
      .select("id, name, description, category, unit_type, rate, cost, status, created_at")
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
      .from("rate_cards")
      .insert([
        {
          name: String(body.name ?? ""),
          description: body.description ?? null,
          category: String(body.category ?? "other"),
          unit_type: String(body.unit_type ?? "hour"),
          rate: Number(body.rate ?? 0),
          cost: body.cost ? Number(body.cost) : null,
          status: String(body.status ?? "active"),
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
      .from("rate_cards")
      .update({
        name: String(body.name ?? ""),
        description: body.description ?? null,
        category: String(body.category ?? "other"),
        unit_type: String(body.unit_type ?? "hour"),
        rate: Number(body.rate ?? 0),
        cost: body.cost ? Number(body.cost) : null,
        status: String(body.status ?? "active"),
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
    const { error } = await supabaseAdmin.from("rate_cards").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String((e as any)?.message ?? e) }, { status: 400 });
  }
}

