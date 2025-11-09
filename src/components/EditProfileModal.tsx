"use client";
import { useState } from "react";
import { Modal } from "./Modal";
import { User, Mail, Building, Phone } from "lucide-react";
import { useUserStore } from "@/store/user";

export function EditProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { profile, updateProfile } = useUserStore();
  const [formData, setFormData] = useState({
    name: profile.name ?? "Admin User",
    email: profile.email ?? "admin@zzmedia.com",
    company: profile.company ?? "ZZ Media",
    phone: profile.phone ?? "",
    title: profile.title ?? "Owner",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      phone: formData.phone,
      title: formData.title,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-zinc-300 mb-2">
            Company Name
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Your Company"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
              Title/Role
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Owner, Manager, etc."
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
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
            type="submit"
            className="flex-1 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

