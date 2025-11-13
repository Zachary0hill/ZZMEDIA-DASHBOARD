import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from("workflow_versions")
      .select("id, version, created_at")
      .eq("workflow_id", params.id)
      .order("version", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e: any) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on server" }, { status: 500 });
    }
    const body = await req.json().catch(() => ({}));
    const graph = body.graph ?? { nodes: [], edges: [] };
    const note = typeof body.note === "string" ? body.note : null;

    // Get current version from workflows
    const { data: wf, error: e1 } = await supabase
      .from("workflows")
      .select("id, version")
      .eq("id", params.id)
      .single();
    if (e1 || !wf) throw e1 || new Error("Workflow not found");
    const nextVersion = (wf.version || 0) + 1;

    const { error: e2 } = await supabaseAdmin
      .from("workflow_versions")
      .insert([{ workflow_id: params.id, version: nextVersion, graph, note }]);
    if (e2) throw e2;

    const { error: e3 } = await supabaseAdmin
      .from("workflows")
      .update({ version: nextVersion })
      .eq("id", params.id);
    if (e3) throw e3;

    return NextResponse.json({ version: nextVersion }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


