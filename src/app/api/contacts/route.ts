import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("id,created_at,name,email,phone,subscribed,tags,notes")
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
      .from("contacts")
      .insert([
        {
          name: String(body.name ?? ""),
          email: body.email ?? null,
          phone: body.phone ?? null,
          subscribed: body.subscribed ?? true,
          tags: Array.isArray(body.tags) ? body.tags : null,
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
      .from("contacts")
      .update({
        name: body.name != null ? String(body.name) : undefined,
        email: body.email ?? undefined,
        phone: body.phone ?? undefined,
        subscribed: body.subscribed ?? undefined,
        tags: Array.isArray(body.tags) ? body.tags : undefined,
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
    const { error } = await supabaseAdmin.from("contacts").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


