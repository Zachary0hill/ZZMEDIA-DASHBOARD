import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("id, name, status, industry, email, phone, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e) {
    // Fallback: empty list if Supabase is not configured yet
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
      .from("clients")
      .insert([
        {
          name: String(body.name ?? "").trim(),
          status: String(body.status ?? "active"),
          industry: body.industry ?? null,
          email: body.email ?? null,
          phone: body.phone ?? null,
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
    const updateData: any = {};
    
    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.status !== undefined) updateData.status = String(body.status);
    if (body.industry !== undefined) updateData.industry = body.industry || null;
    if (body.email !== undefined) updateData.email = body.email || null;
    if (body.phone !== undefined) updateData.phone = body.phone || null;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.website !== undefined) updateData.website = body.website || null;
    if (body.address !== undefined) updateData.address = body.address || null;
    if (body.contact_person !== undefined) updateData.contact_person = body.contact_person || null;
    
    const { data, error } = await supabaseAdmin
      .from("clients")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();
    
    if (error) throw error;
    return NextResponse.json(data);
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
    const { error } = await supabaseAdmin.from("clients").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


