import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Example KPIs computed from tables
    const [invoicesRes, projectsRes] = await Promise.all([
      supabase.from("invoices").select("status,total,amount_paid").limit(1000),
      supabase.from("projects").select("budget_hours,hours_used").limit(1000),
    ]);

    if (invoicesRes.error) throw invoicesRes.error;
    if (projectsRes.error) throw projectsRes.error;

    const invoices = invoicesRes.data ?? [];
    const projects = projectsRes.data ?? [];

    const cash_on_hand = invoices
      .filter((i: any) => i.status === "paid")
      .reduce((sum: number, i: any) => sum + (i.amount_paid || i.total || 0), 0);

    const pipeline_value = invoices
      .filter((i: any) => i.status === "sent" || i.status === "overdue" || i.status === "draft")
      .reduce((sum: number, i: any) => sum + (i.total || 0), 0);

    const utilization_pct_week = projects.length
      ? Math.round(
          (projects.reduce((sum: number, p: any) => sum + (p.hours_used || 0), 0) /
            Math.max(1, projects.reduce((sum: number, p: any) => sum + (p.budget_hours || 0), 0))) *
            100
        )
      : 0;

    return NextResponse.json({
      mrr: cash_on_hand / 12,
      pipeline_value,
      cash_on_hand,
      utilization_pct_week,
      invoices_due_count: invoices.filter((i: any) => i.status === "overdue").length,
      unread_client_msgs: 0,
      content_published_ytd: 0,
    });
  } catch (e) {
    return NextResponse.json(
      {
        mrr: 0,
        pipeline_value: 0,
        cash_on_hand: 0,
        utilization_pct_week: 0,
        invoices_due_count: 0,
        unread_client_msgs: 0,
        content_published_ytd: 0,
      },
      { status: 200 }
    );
  }
}


