import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on server" }, { status: 500 });
    }
    const { id: workflowId } = await context.params;
    // Get current version for record
    const { data: wf, error: e1 } = await supabase
      .from("workflows")
      .select("version")
      .eq("id", workflowId)
      .single();
    if (e1 || !wf) throw e1 || new Error("Workflow not found");

    // Create execution as running
    const startedAt = new Date();
    const { data: run, error: e2 } = await supabaseAdmin
      .from("workflow_executions")
      .insert([{ workflow_id: workflowId, version: wf.version ?? 1, status: "running", started_at: startedAt.toISOString() }])
      .select("id, status, started_at")
      .single();
    if (e2) throw e2;

    // Immediately mark succeeded (stub)
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();
    const { error: e3 } = await supabaseAdmin
      .from("workflow_executions")
      .update({ status: "succeeded", finished_at: finishedAt.toISOString(), duration_ms: durationMs })
      .eq("id", run.id);
    if (e3) throw e3;

    return NextResponse.json({ runId: run.id, status: "succeeded", durationMs });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 400 });
  }
}


