import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("id,created_at,name,status,email,phone,estimated_value,source,notes,next_action_date")
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
      .from("leads")
      .insert([
        {
          name: String(body.name ?? ""),
          status: String(body.status ?? "hot"),
          email: body.email ?? null,
          phone: body.phone ?? null,
          estimated_value: body.estimated_value != null ? Number(body.estimated_value) : null,
          source: body.source ?? null,
          notes: body.notes ?? null,
          next_action_date: body.next_action_date ?? null,
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
      .from("leads")
      .update({
        name: body.name != null ? String(body.name) : undefined,
        status: body.status != null ? String(body.status) : undefined,
        email: body.email ?? undefined,
        phone: body.phone ?? undefined,
        estimated_value: body.estimated_value != null ? Number(body.estimated_value) : undefined,
        source: body.source ?? undefined,
        notes: body.notes ?? undefined,
        next_action_date: body.next_action_date ?? undefined,
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
    const { error } = await supabaseAdmin.from("leads").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


