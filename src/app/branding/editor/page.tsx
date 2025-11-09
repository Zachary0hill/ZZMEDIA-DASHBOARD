"use client";
import { Paintbrush, Upload, Palette, Type, Save } from "lucide-react";

export default function BrandEditorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Brand Editor</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your logo, colors, fonts, and company information</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/15 transition-colors font-medium">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Section */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center">
                <Upload className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Logo</h3>
                <p className="text-xs text-zinc-500">Upload your company logo</p>
              </div>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/20 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-400">Click to upload or drag and drop</p>
              <p className="text-xs text-zinc-600 mt-1">SVG, PNG, JPG (max. 2MB)</p>
            </div>
          </div>

          {/* Color Palette Section */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Palette className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Color Palette</h3>
                <p className="text-xs text-zinc-500">Define your brand colors</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["Primary", "Secondary", "Accent"].map((label) => (
                <div key={label}>
                  <label className="text-xs text-zinc-400 mb-2 block">{label}</label>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 cursor-pointer hover:scale-105 transition-transform" />
                    <input 
                      type="text" 
                      placeholder="#000000"
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Section */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Type className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Typography</h3>
                <p className="text-xs text-zinc-500">Select your brand fonts</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Heading Font</label>
                <select className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                  <option>Montserrat</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Body Font</label>
                <select className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                  <option>Montserrat</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Company Name</label>
                <input 
                  type="text"
                  placeholder="ZZ Media"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Tagline</label>
                <input 
                  type="text"
                  placeholder="Your tagline here"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Website</label>
                <input 
                  type="url"
                  placeholder="https://zzmedia.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Email</label>
                <input 
                  type="email"
                  placeholder="hello@zzmedia.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

