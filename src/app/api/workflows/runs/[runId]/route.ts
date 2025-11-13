import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: { runId: string } }) {
  try {
    const { data: run, error } = await supabase
      .from("workflow_executions")
      .select("*")
      .eq("id", params.runId)
      .single();
    if (error || !run) throw error || new Error("Not found");
    return NextResponse.json(run);
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 404 });
  }
}


