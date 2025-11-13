import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("credentials")
      .select("id, org_id, user_id, type, name, created_at, updated_at")
      .order("updated_at", { ascending: false })
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
    const body = await req.json().catch(() => ({}));
    const type = String(body.type ?? "");
    const name = String(body.name ?? "");
    const data = String(body.data ?? "");
    if (!type || !name || !data) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const { data: row, error } = await supabaseAdmin
      .from("credentials")
      .insert([{ type, name, data }])
      .select("id, org_id, user_id, type, name, created_at, updated_at")
      .single();
    if (error) throw error;
    return NextResponse.json(row, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


