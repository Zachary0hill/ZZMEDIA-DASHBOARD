import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { workflowTemplates } from "@/lib/fixtures/workflowTemplates";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET() {
  try {
    // List workflows (without graphs for performance)
    const { data, error } = await supabase
      .from("workflows")
      .select("id, name, slug, description, version, created_at, updated_at")
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
    const name = String(body.name ?? body.templateName ?? "Untitled Assistant");
    const description = body.description ? String(body.description) : null;
    const templateId = body.templateId ? String(body.templateId) : null;
    const tmpl = templateId ? workflowTemplates.find((t) => t.id === templateId) : null;
    const graph = tmpl?.graph ?? { nodes: [], edges: [] };

    const slug = slugify(name);

    const { data: wf, error: err1 } = await supabaseAdmin
      .from("workflows")
      .insert([{ name, slug, description, version: 1 }])
      .select("id, name, slug, description, version, created_at, updated_at")
      .single();
    if (err1) throw err1;

    const { error: err2 } = await supabaseAdmin
      .from("workflow_versions")
      .insert([{ workflow_id: wf.id, version: 1, graph }]);
    if (err2) throw err2;

    return NextResponse.json(wf, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


