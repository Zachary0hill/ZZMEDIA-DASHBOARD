import type { WorkflowTemplate } from "@/lib/workflows/types";

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "tmpl-ai-content-draft",
    name: "AI Content Draft",
    description: "Manual trigger → OpenAI chat completion → Log output",
    thumbnail: "/window.svg",
    graph: {
      nodes: [
        {
          id: "n1",
          type: "trigger.manual",
          label: "Manual Trigger",
          position: { x: 80, y: 120 },
          config: {},
        },
        {
          id: "n2",
          type: "ai.openai",
          label: "OpenAI (Chat)",
          position: { x: 360, y: 120 },
          config: { model: "gpt-4o-mini", messages: [] },
        },
        {
          id: "n3",
          type: "util.log",
          label: "Logger",
          position: { x: 640, y: 120 },
          config: { level: "info" },
        },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
      ],
    },
  },
  {
    id: "tmpl-webhook-transform-http",
    name: "Webhook → Transform → HTTP",
    description: "Receive webhook, map payload, send HTTP request",
    thumbnail: "/window.svg",
    graph: {
      nodes: [
        {
          id: "n1",
          type: "trigger.webhook",
          label: "Webhook",
          position: { x: 80, y: 120 },
          config: { path: "/hook" },
        },
        {
          id: "n2",
          type: "data.map",
          label: "Map/Transform",
          position: { x: 360, y: 120 },
          config: { expression: "" },
        },
        {
          id: "n3",
          type: "http.request",
          label: "HTTP Request",
          position: { x: 640, y: 120 },
          config: { method: "POST", url: "" },
        },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
      ],
    },
  },
  {
    id: "tmpl-cron-feed-summarize",
    name: "Cron → Fetch → ForEach → Summarize → Log",
    description: "Periodic fetch, summarize with OpenAI, log results",
    thumbnail: "/window.svg",
    graph: {
      nodes: [
        {
          id: "n1",
          type: "trigger.cron",
          label: "Cron",
          position: { x: 80, y: 120 },
          config: { rrule: "FREQ=DAILY;INTERVAL=1" },
        },
        {
          id: "n2",
          type: "http.request",
          label: "Fetch Feed",
          position: { x: 320, y: 120 },
          config: { method: "GET", url: "" },
        },
        {
          id: "n3",
          type: "control.foreach",
          label: "For Each",
          position: { x: 560, y: 120 },
          config: {},
        },
        {
          id: "n4",
          type: "ai.openai",
          label: "OpenAI Summarize",
          position: { x: 800, y: 120 },
          config: { model: "gpt-4o-mini", messages: [] },
        },
        {
          id: "n5",
          type: "util.log",
          label: "Logger",
          position: { x: 1040, y: 120 },
          config: { level: "info" },
        },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n3", target: "n4" },
        { id: "e4", source: "n4", target: "n5" },
      ],
    },
  },
];


