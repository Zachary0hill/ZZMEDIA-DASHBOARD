"use client";
import { useState } from "react";
import { Modal } from "./Modal";
import { Bell, Mail, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

export function NotificationSettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    invoiceReminders: true,
    projectDeadlines: true,
    paymentReceived: true,
    overdueInvoices: true,
    newLeads: false,
    weeklyReports: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // TODO: Save to database/API
    alert("Notification settings saved!");
    onClose();
  };

  const notificationTypes = [
    { 
      key: "emailNotifications" as const, 
      label: "Email Notifications", 
      description: "Receive notifications via email",
      icon: Mail,
      color: "blue"
    },
    { 
      key: "invoiceReminders" as const, 
      label: "Invoice Reminders", 
      description: "Get reminded about unpaid invoices",
      icon: DollarSign,
      color: "purple"
    },
    { 
      key: "projectDeadlines" as const, 
      label: "Project Deadlines", 
      description: "Alerts for upcoming project due dates",
      icon: AlertTriangle,
      color: "amber"
    },
    { 
      key: "paymentReceived" as const, 
      label: "Payment Received", 
      description: "Notify when payments are received",
      icon: CheckCircle,
      color: "emerald"
    },
    { 
      key: "overdueInvoices" as const, 
      label: "Overdue Invoices", 
      description: "Alert for overdue invoices",
      icon: AlertTriangle,
      color: "rose"
    },
    { 
      key: "newLeads" as const, 
      label: "New Leads", 
      description: "Notify about new lead submissions",
      icon: Bell,
      color: "cyan"
    },
    { 
      key: "weeklyReports" as const, 
      label: "Weekly Reports", 
      description: "Receive weekly performance summaries",
      icon: Mail,
      color: "blue"
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notification Settings">
      <div className="space-y-4">
        <p className="text-sm text-zinc-400">Customize your notification preferences</p>

        <div className="space-y-2">
          {notificationTypes.map((type) => {
            const Icon = type.icon;
            const isEnabled = settings[type.key];
            
            return (
              <div
                key={type.key}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-lg bg-${type.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-4 w-4 text-${type.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-200">{type.label}</div>
                    <div className="text-xs text-zinc-500">{type.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting(type.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isEnabled ? "bg-cyan-500" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      isEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </Modal>
  );
}

