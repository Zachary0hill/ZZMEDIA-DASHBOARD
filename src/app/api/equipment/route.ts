import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("equipment")
      .select("id,created_at,name,category,serial_number,purchase_date,purchase_price,status,location,notes")
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
      .from("equipment")
      .insert([
        {
          name: String(body.name ?? ""),
          category: body.category ?? null,
          serial_number: body.serial_number ?? null,
          purchase_date: body.purchase_date ?? null,
          purchase_price: body.purchase_price != null ? Number(body.purchase_price) : null,
          status: String(body.status ?? "available"),
          location: body.location ?? null,
          notes: body.notes ?? null,
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
      .from("equipment")
      .update({
        name: body.name != null ? String(body.name) : undefined,
        category: body.category ?? undefined,
        serial_number: body.serial_number ?? undefined,
        purchase_date: body.purchase_date ?? undefined,
        purchase_price: body.purchase_price != null ? Number(body.purchase_price) : undefined,
        status: body.status != null ? String(body.status) : undefined,
        location: body.location ?? undefined,
        notes: body.notes ?? undefined,
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
    const { error } = await supabaseAdmin.from("equipment").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


