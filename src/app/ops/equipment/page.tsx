"use client";
import { useState, useMemo } from "react";
import { Camera, Plus, Package, DollarSign, AlertTriangle, Video, Lightbulb, Mic, Filter, X, Calendar, Upload, Image as ImageIcon, Edit2, Trash2, MoreVertical } from "lucide-react";
import { Modal } from "@/components/Modal";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const GEAR_CATEGORIES = [
  { value: "cameras", label: "Cameras", icon: Camera, color: "cyan" },
  { value: "lighting", label: "Lighting", icon: Lightbulb, color: "amber" },
  { value: "audio", label: "Audio", icon: Mic, color: "emerald" },
  { value: "lenses", label: "Lenses", icon: Video, color: "purple" },
] as const;

export default function EquipmentPage() {
  const { data } = useSWR("/api/equipment", fetcher, { keepPreviousData: true });
  const equipment = data ?? [];

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    serial_number: "",
    purchase_date: "",
    purchase_price: "",
    status: "available",
    location: "",
    notes: "",
    image_url: "",
  });

  // Extract available years from equipment
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    equipment.forEach((item: any) => {
      if (item.purchase_date) {
        const year = new Date(item.purchase_date).getFullYear().toString();
        years.add(year);
      }
    });
    return Array.from(years).sort().reverse();
  }, [equipment]);

  // Filter equipment based on selected filters
  const filteredEquipment = useMemo(() => {
    return equipment.filter((item: any) => {
      const matchesCategory = !selectedCategory || 
        item.category?.toLowerCase().includes(selectedCategory.toLowerCase());
      
      const matchesYear = !selectedYear || 
        (item.purchase_date && new Date(item.purchase_date).getFullYear().toString() === selectedYear);
      
      return matchesCategory && matchesYear;
    });
  }, [equipment, selectedCategory, selectedYear]);

  // Handle image file selection
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 5MB limit");
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Upload image to server
  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/equipment/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Upload failed");
      }

      const data = await res.json();
      return data.url;
    } catch (err: any) {
      alert(`Failed to upload image: ${String(err?.message ?? err)}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  // Clear image
  function clearImage() {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, image_url: "" });
  }

  // Open edit modal
  function handleEdit(item: any) {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      category: item.category || "",
      serial_number: item.serial_number || "",
      purchase_date: item.purchase_date || "",
      purchase_price: item.purchase_price?.toString() || "",
      status: item.status || "available",
      location: item.location || "",
      notes: item.notes || "",
      image_url: item.image_url || "",
    });
    setImagePreview(item.image_url || "");
    setShowModal(true);
  }

  // Open delete confirmation
  function handleDeleteClick(item: any) {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  }

  // Delete equipment
  async function handleDelete() {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`/api/equipment?id=${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to delete equipment: ${err?.error ?? res.statusText}`);
        return;
      }

      (await import("swr")).mutate("/api/equipment");
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (err: any) {
      alert(`Failed to delete equipment: ${String(err?.message ?? err)}`);
    }
  }

  // Reset form
  function resetForm() {
    setFormData({
      name: "",
      category: "",
      serial_number: "",
      purchase_date: "",
      purchase_price: "",
      status: "available",
      location: "",
      notes: "",
      image_url: "",
    });
    clearImage();
    setEditingItem(null);
    setShowModal(false);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsUploading(true);
    try {
      // Upload image first if one is selected
      let imageUrl = formData.image_url || null;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          setIsUploading(false);
          return; // Upload failed, don't create/update equipment
        }
        imageUrl = uploadedUrl;
      }

      const payload = {
        name: formData.name,
        category: formData.category || null,
        serial_number: formData.serial_number || null,
        purchase_date: formData.purchase_date || null,
        purchase_price: formData.purchase_price ? Number(formData.purchase_price) : null,
        status: formData.status,
        location: formData.location || null,
        notes: formData.notes || null,
        image_url: imageUrl,
      };

      const url = editingItem 
        ? `/api/equipment?id=${editingItem.id}`
        : "/api/equipment";
      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to ${editingItem ? 'update' : 'create'} equipment: ${err?.error ?? res.statusText}`);
        return;
      }

      (await import("swr")).mutate("/api/equipment");
      resetForm();
    } catch (err: any) {
      alert(`Failed to ${editingItem ? 'update' : 'create'} equipment: ${String(err?.message ?? err)}`);
    } finally {
      setIsUploading(false);
    }
  }

  const totalItems = equipment.length;
  const totalValue = equipment.reduce((sum: number, e: any) => sum + Number(e.purchase_price || 0), 0);
  const inUse = equipment.filter((e: any) => e.status === "in_use").length;
  const maintenanceDue = 0; // placeholder for future logic

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Equipment & Studio Catalog</h1>
          <p className="text-sm text-zinc-400 mt-1">Track all gear, equipment, and studio assets</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Equipment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Items</div>
              <div className="text-2xl font-bold text-white">{totalItems}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Package className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Value</div>
              <div className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">In Use</div>
              <div className="text-2xl font-bold text-white">{inUse}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Camera className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Maintenance Due</div>
              <div className="text-2xl font-bold text-white">{maintenanceDue}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Gear Catalog with Sidebar */}
      <div className="flex gap-6">
        {/* Left Filter Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="glass-card p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                <Filter className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Filters</h2>
                <p className="text-xs text-zinc-400">Refine catalog</p>
              </div>
            </div>

            {/* Category Filters */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
                  Equipment Type
                </label>
                <div className="flex flex-col gap-2">
                {GEAR_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.value;
                  
                  const colorClasses = {
                    cyan: {
                      bg: 'bg-cyan-500/20',
                      border: 'border-cyan-500/50',
                      text: 'text-cyan-300',
                      shadow: 'shadow-cyan-500/20',
                      gradient: 'from-cyan-500/10'
                    },
                    amber: {
                      bg: 'bg-amber-500/20',
                      border: 'border-amber-500/50',
                      text: 'text-amber-300',
                      shadow: 'shadow-amber-500/20',
                      gradient: 'from-amber-500/10'
                    },
                    emerald: {
                      bg: 'bg-emerald-500/20',
                      border: 'border-emerald-500/50',
                      text: 'text-emerald-300',
                      shadow: 'shadow-emerald-500/20',
                      gradient: 'from-emerald-500/10'
                    },
                    purple: {
                      bg: 'bg-purple-500/20',
                      border: 'border-purple-500/50',
                      text: 'text-purple-300',
                      shadow: 'shadow-purple-500/20',
                      gradient: 'from-purple-500/10'
                    }
                  };

                  const colors = colorClasses[cat.color as keyof typeof colorClasses];

                  return (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.value)}
                      className={`
                        w-full group relative overflow-hidden rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300
                        ${isSelected 
                          ? `${colors.bg} ${colors.border} ${colors.text} shadow-lg ${colors.shadow}` 
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                        }
                        border backdrop-blur-sm text-left
                      `}
                    >
                      <div className="relative z-10 flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="flex-1">{cat.label}</span>
                        {isSelected && <X className="h-4 w-4" />}
                      </div>
                      {isSelected && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} to-transparent`} />
                      )}
                    </button>
                  );
                })}
                </div>
              </div>

              {/* Year Filter */}
              {availableYears.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
                    Purchase Year
                  </label>
                  <div className="flex flex-col gap-2">
                    {availableYears.map((year) => {
                      const isSelected = selectedYear === year;
                      return (
                        <button
                          key={year}
                          onClick={() => setSelectedYear(isSelected ? null : year)}
                          className={`
                            w-full relative overflow-hidden rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300
                            ${isSelected 
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/20' 
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                            }
                            border backdrop-blur-sm text-left
                          `}
                        >
                          <div className="relative z-10 flex items-center gap-3">
                            <Calendar className="h-5 w-5" />
                            <span className="flex-1">{year}</span>
                            {isSelected && <X className="h-4 w-4" />}
                          </div>
                          {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Filters Summary */}
              {(selectedCategory || selectedYear) && (
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedYear(null);
                    }}
                    className="w-full text-sm text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5"
                  >
                    <X className="h-4 w-4" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Results Header */}
          {equipment.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {filteredEquipment.length} {filteredEquipment.length === 1 ? 'Item' : 'Items'}
                </h3>
                <p className="text-sm text-zinc-400 mt-0.5">
                  {selectedCategory || selectedYear 
                    ? `Filtered from ${equipment.length} total`
                    : 'Total equipment in catalog'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Equipment Grid */}
          {filteredEquipment.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 flex items-center justify-center border border-white/10">
              <Package className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No equipment found</h3>
            <p className="text-sm text-zinc-400 mb-6">
              {selectedCategory || selectedYear 
                ? "Try adjusting your filters or add new equipment to get started."
                : "Add your first piece of equipment to start tracking your gear."
              }
            </p>
            <button 
              onClick={() => setShowModal(true)} 
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Equipment
            </button>
          </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item: any) => {
              const categoryInfo = GEAR_CATEGORIES.find(c => 
                item.category?.toLowerCase().includes(c.value.toLowerCase())
              ) || { icon: Package, color: "zinc" as const };
              const Icon = categoryInfo.icon;
              const purchaseYear = item.purchase_date 
                ? new Date(item.purchase_date).getFullYear() 
                : null;

              const cardColorClasses = {
                cyan: {
                  iconBg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5',
                  iconBorder: 'border-cyan-500/30',
                  iconText: 'text-cyan-400',
                  hoverGlow: 'group-hover:from-cyan-500/10',
                  hoverBorder: 'group-hover:border-cyan-500/30'
                },
                amber: {
                  iconBg: 'bg-gradient-to-br from-amber-500/20 to-amber-500/5',
                  iconBorder: 'border-amber-500/30',
                  iconText: 'text-amber-400',
                  hoverGlow: 'group-hover:from-amber-500/10',
                  hoverBorder: 'group-hover:border-amber-500/30'
                },
                emerald: {
                  iconBg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5',
                  iconBorder: 'border-emerald-500/30',
                  iconText: 'text-emerald-400',
                  hoverGlow: 'group-hover:from-emerald-500/10',
                  hoverBorder: 'group-hover:border-emerald-500/30'
                },
                purple: {
                  iconBg: 'bg-gradient-to-br from-purple-500/20 to-purple-500/5',
                  iconBorder: 'border-purple-500/30',
                  iconText: 'text-purple-400',
                  hoverGlow: 'group-hover:from-purple-500/10',
                  hoverBorder: 'group-hover:border-purple-500/30'
                },
                zinc: {
                  iconBg: 'bg-gradient-to-br from-zinc-500/20 to-zinc-500/5',
                  iconBorder: 'border-zinc-500/30',
                  iconText: 'text-zinc-400',
                  hoverGlow: 'group-hover:from-zinc-500/10',
                  hoverBorder: 'group-hover:border-zinc-500/30'
                }
              };

              const cardColors = cardColorClasses[categoryInfo.color as keyof typeof cardColorClasses];

              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-zinc-900/70 backdrop-blur-2xl hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                >
                  {/* Neon Glow Effect on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent ${cardColors.hoverGlow} group-hover:to-transparent transition-all duration-500 opacity-0 group-hover:opacity-100`} />
                  
                  {/* Cover Photo */}
                  {item.image_url ? (
                    <div className="relative h-48 overflow-hidden bg-zinc-950/50">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 flex items-center justify-center">
                      <Icon className={`h-16 w-16 ${cardColors.iconText} opacity-30`} />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-9 h-9 rounded-lg bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center text-cyan-300 hover:bg-cyan-500/30 transition-all hover:scale-110"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="w-9 h-9 rounded-lg bg-red-500/20 backdrop-blur-md border border-red-500/30 flex items-center justify-center text-red-300 hover:bg-red-500/30 transition-all hover:scale-110"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`
                      inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md
                      ${item.status === 'available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : ''}
                      ${item.status === 'in_use' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : ''}
                      ${item.status === 'maintenance' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : ''}
                      ${item.status === 'retired' ? 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30' : ''}
                    `}>
                      <div className={`w-1.5 h-1.5 rounded-full
                        ${item.status === 'available' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : ''}
                        ${item.status === 'in_use' ? 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : ''}
                        ${item.status === 'maintenance' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''}
                        ${item.status === 'retired' ? 'bg-zinc-400' : ''}
                      `} />
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="relative p-6">

                    {/* Name */}
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {item.name}
                    </h3>

                    {/* Category */}
                    {item.category && (
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                        {item.category}
                      </p>
                    )}

                    {/* Details Grid */}
                    <div className="space-y-2 mb-4">
                      {item.serial_number && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Serial</span>
                          <span className="text-zinc-300 font-mono">{item.serial_number}</span>
                        </div>
                      )}
                      {purchaseYear && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Year</span>
                          <span className="text-zinc-300 font-semibold">{purchaseYear}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Location</span>
                          <span className="text-zinc-300">{item.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    {item.purchase_price && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">Value</span>
                          <span className="text-lg font-bold text-white">
                            ${Number(item.purchase_price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Neon Border Glow on Hover */}
                  <div className={`absolute inset-0 rounded-2xl border border-transparent ${cardColors.hoverBorder} transition-all duration-300 pointer-events-none`} />
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={resetForm} title={editingItem ? "Edit Equipment" : "Add Equipment"}>
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
              Name *
            </label>
            <input
              id="name"
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Sony A7SIII"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Cover Photo
            </label>
            
            {/* Image Preview or Upload Area */}
            {imagePreview ? (
              <div className="relative group">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10 bg-zinc-900">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={clearImage}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="relative block">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageSelect}
                  className="sr-only"
                />
                <div className="w-full h-48 rounded-lg border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group">
                  <div className="w-16 h-16 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white mb-1">
                      Click to upload cover photo
                    </p>
                    <p className="text-xs text-zinc-500">
                      JPEG, PNG, WebP, or GIF (max 5MB)
                    </p>
                  </div>
                </div>
              </label>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              >
                <option value="">Select category...</option>
                <option value="cameras">Cameras</option>
                <option value="lighting">Lighting</option>
                <option value="audio">Audio</option>
                <option value="lenses">Lenses</option>
                <option value="accessories">Accessories</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="serial_number" className="block text-sm font-medium text-zinc-300 mb-2">
                Serial Number
              </label>
              <input
                id="serial_number"
                type="text"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="purchase_date" className="block text-sm font-medium text-zinc-300 mb-2">
                Purchase Date
              </label>
              <input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
            </div>
            <div>
              <label htmlFor="purchase_price" className="block text-sm font-medium text-zinc-300 mb-2">
                Purchase Price
              </label>
              <input
                id="purchase_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="2499.00"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-zinc-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Studio A, Storage, On-site..."
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-zinc-300 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Condition, accessories, maintenance cycle..."
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              disabled={isUploading}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                  {imageFile ? "Uploading..." : editingItem ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingItem ? "Update Equipment" : "Create Equipment"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteConfirm} 
        onClose={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        }} 
        title="Delete Equipment"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30 flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-zinc-300 mb-2">
                Are you sure you want to delete <span className="font-semibold text-white">{itemToDelete?.name}</span>?
              </p>
              <p className="text-xs text-zinc-500">
                This action cannot be undone. All data associated with this equipment will be permanently removed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirm(false);
                setItemToDelete(null);
              }}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/15 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Equipment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

