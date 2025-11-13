import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { data: wf, error: e1 } = await supabase
      .from("workflows")
      .select("id, name, slug, description, version, created_at, updated_at")
      .eq("id", id)
      .single();
    if (e1 || !wf) throw e1 || new Error("Not found");

    const { data: ver, error: e2 } = await supabase
      .from("workflow_versions")
      .select("id, version, graph, created_at")
      .eq("workflow_id", id)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (e2) throw e2;
    return NextResponse.json({ workflow: wf, version: ver });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on server" }, { status: 500 });
    }
    const id = params.id;
    const body = await req.json().catch(() => ({}));
    const updates: any = {};
    if (typeof body.name === "string") updates.name = body.name;
    if (typeof body.description === "string") updates.description = body.description;
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: true });
    }
    const { data, error } = await supabaseAdmin
      .from("workflows")
      .update(updates)
      .eq("id", id)
      .select("id, name, slug, description, version, created_at, updated_at")
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


