"use client";
import { useState } from "react";
import { Modal } from "./Modal";
import { Upload, User, X } from "lucide-react";
import { useUserStore } from "@/store/user";

export function ChangePhotoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const { updateProfile } = useUserStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Future: upload to server. For now, persist preview in local storage-backed store.
    updateProfile({ avatarUrl: preview || null });
    onClose();
    setPreview(null);
  };

  const handleRemove = () => {
    setPreview(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Profile Photo">
      <div className="space-y-6">
        {/* Current/Preview Photo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white/10"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center border-4 border-white/10">
                <User className="h-16 w-16 text-white" />
              </div>
            )}
            {preview && (
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-3">Current profile photo</p>
        </div>

        {/* Upload Area */}
        <div>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all">
              <Upload className="h-12 w-12 mx-auto text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-400 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-zinc-600">PNG, JPG, GIF up to 5MB</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!preview}
            className="flex-1 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Photo
          </button>
        </div>
      </div>
    </Modal>
  );
}

