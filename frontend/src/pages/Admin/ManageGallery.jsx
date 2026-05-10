import { useState, useEffect } from 'react';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image as ImageIcon, Plus, Tag, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { galleryService } from '@/services/galleryService';
import { GALLERY_CATEGORIES, YEARS } from '@/utils/constants';
import { PageShell, PageHeader, Surface, Field, EmptyState, ActionButtons } from '@/components/admin/adminUI';

const empty = { title: '', category: 'Sports', year: YEARS[0] };

export function ManageGallery() {
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [isOpen,    setIsOpen]    = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [formData,  setFormData]  = useState(empty);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => { fetchGallery(); }, []);

  async function fetchGallery() {
    try {
      setLoading(true);
      const data = await galleryService.getImages();
      setImages(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load gallery'); }
    finally  { setLoading(false); }
  }

  function openNew() {
    setFormData(empty); setEditingId(null);
    setImageFile(null); setPreview(null);
    setIsOpen(true);
  }

  function openEdit(img) {
    setFormData({ title: img.title, category: img.category, year: img.year });
    setEditingId(img._id || img.id);
    setImageFile(null); setPreview(null);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false); setEditingId(null);
    setFormData(empty); setImageFile(null); setPreview(null);
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!formData.title) { toast.error('Title is required'); return; }
    if (!editingId && !imageFile) { toast.error('Please select an image'); return; }
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('title',    formData.title);
      fd.append('category', formData.category);
      fd.append('year',     formData.year);
      if (imageFile) fd.append('image', imageFile);
      if (editingId) { await galleryService.updateGallery(editingId, fd); toast.success('Image updated'); }
      else           { await galleryService.createGallery(fd);            toast.success('Image added'); }
      close(); fetchGallery();
    } catch { toast.error('Failed to save'); }
    finally  { setSaving(false); }
  }

  async function handleDelete(id) {
    try { await galleryService.deleteGallery(id); toast.success('Deleted'); fetchGallery(); }
    catch { toast.error('Failed to delete'); }
  }

  return (
    <PageShell>
      <PageHeader
        title="Gallery"
        subtitle={`${images.length} image${images.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={openNew} className="gap-2">
            <Plus className="w-4 h-4" /> Add Image
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-muted aspect-square" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <Surface>
          <EmptyState icon={ImageIcon} title="No images yet"
            description="Click 'Add Image' to upload your first gallery image." />
        </Surface>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map(img => (
            <div key={img._id || img.id}
              className="group relative rounded-2xl overflow-hidden border border-border
                bg-background shadow-sm hover:shadow-md transition-shadow">

              {/* Image */}
              <div className="aspect-square bg-secondary">
                {img.image ? (
                  <img src={img.image} alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                transition-opacity flex items-center justify-center gap-2">
                <ActionButtons
                  onEdit={() => openEdit(img)}
                  onDelete={() => handleDelete(img._id || img.id)}
                />
              </div>

              {/* Info strip */}
              <div className="p-3 border-t border-border">
                <p className="text-xs font-semibold text-foreground truncate">{img.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Tag className="w-2.5 h-2.5" />{img.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <CalendarDays className="w-2.5 h-2.5" />{img.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Image' : 'Add Image'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <Field label="Title">
              <Input value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="Image title" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <Select value={formData.category}
                  onValueChange={v => setFormData(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GALLERY_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Year">
                <Select value={formData.year.toString()}
                  onValueChange={v => setFormData(p => ({ ...p, year: parseInt(v) }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {YEARS.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* File upload */}
            <Field label={editingId ? 'Replace Image (optional)' : 'Upload Image'}>
              <label className={`flex flex-col items-center justify-center gap-2 w-full h-32
                rounded-xl border-2 border-dashed cursor-pointer transition-colors
                ${preview ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-secondary'}`}>
                {preview ? (
                  <img src={preview} alt="preview"
                    className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImageIcon className="w-7 h-7 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Click to browse</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
              </label>
            </Field>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={close}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}