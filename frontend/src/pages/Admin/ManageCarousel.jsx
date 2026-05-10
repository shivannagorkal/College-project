import { useState, useEffect } from 'react';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Plus, UploadCloud, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { carouselService } from '@/services/carouselService';
import { PageShell, PageHeader, Surface, Field, EmptyState } from '@/components/admin/adminUI';

const PAGES = [
  'home','about','academics','results','toppers',
  'events','gallery','faculty','admissions',
  'announcements','history','contact',
];

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

export function ManageCarousel() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open,      setOpen]      = useState(false);
  const [preview,   setPreview]   = useState(null);
  const [formData,  setFormData]  = useState({ page: 'home', title: '', order: 0, image: null });

  useEffect(() => { fetchImages(selectedPage); }, [selectedPage]);

  async function fetchImages(page) {
    try {
      setLoading(true);
      const data = await carouselService.getCarouselImages(page);
      setImages(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load images'); }
    finally  { setLoading(false); }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const f = files[0];
      if (!f) return;
      setFormData(p => ({ ...p, image: f }));
      setPreview(URL.createObjectURL(f));
    },
    accept: { 'image/*': [] },
    multiple: false,
  });

  async function handleUpload() {
    if (!formData.image) { toast.error('Please select an image'); return; }
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('image', formData.image);
      fd.append('page',  formData.page);
      fd.append('title', formData.title);
      fd.append('order', formData.order);
      await carouselService.uploadCarouselImage(fd);
      toast.success('Uploaded successfully');
      setOpen(false);
      setPreview(null);
      setFormData({ page: formData.page, title: '', order: 0, image: null });
      setSelectedPage(formData.page);
    } catch { toast.error('Failed to upload'); }
    finally  { setUploading(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this image?')) return;
    try {
      await carouselService.deleteCarouselImage(id);
      toast.success('Deleted');
      fetchImages(selectedPage);
    } catch { toast.error('Failed to delete'); }
  }

  return (
    <PageShell>
      <PageHeader
        title="Carousel"
        subtitle="Manage page banner images"
        action={
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Upload Image
          </Button>
        }
      />

      {/* Page tabs */}
      <Surface className="p-1">
        <div className="flex flex-wrap gap-1">
          {PAGES.map(page => (
            <button key={page} onClick={() => setSelectedPage(page)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all
                ${selectedPage === page
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {capitalize(page)}
            </button>
          ))}
        </div>
      </Surface>

      {/* Images */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-muted aspect-video" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <Surface>
          <EmptyState icon={Share2} title={`No images for "${capitalize(selectedPage)}"`}
            description="Upload an image for this page using the button above." />
        </Surface>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img._id}
              className="group relative rounded-2xl overflow-hidden border border-border
                bg-background shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-secondary">
                <img src={img.image} alt={img.title || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>

              {/* Overlay delete */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(img._id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                    bg-destructive text-destructive-foreground text-xs font-semibold
                    hover:bg-destructive/90 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>

              <div className="p-3 border-t border-border">
                {img.title && <p className="text-xs font-semibold text-foreground truncate">{img.title}</p>}
                <p className="text-[10px] text-muted-foreground mt-0.5">Order: {img.order}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Carousel Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <Field label="Page">
              <Select value={formData.page}
                onValueChange={v => setFormData(p => ({ ...p, page: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGES.map(pg => <SelectItem key={pg} value={pg}>{capitalize(pg)}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title (optional)">
                <Input value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Banner title" />
              </Field>
              <Field label="Display Order">
                <Input type="number" value={formData.order}
                  onChange={e => setFormData(p => ({ ...p, order: Number(e.target.value) }))}
                  placeholder="0" />
              </Field>
            </div>

            {/* Dropzone */}
            <Field label="Image">
              <div {...getRootProps()}
                className={`flex flex-col items-center justify-center gap-2 h-36
                  rounded-xl border-2 border-dashed cursor-pointer transition-colors
                  ${isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary hover:bg-secondary'}`}>
                <input {...getInputProps()} />
                {preview ? (
                  <img src={preview} alt="preview"
                    className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground text-center">
                      {isDragActive ? 'Drop here…' : 'Drag & drop or click to browse'}
                    </p>
                  </>
                )}
              </div>
            </Field>

            {preview && (
              <button onClick={() => { setPreview(null); setFormData(p => ({ ...p, image: null })); }}
                className="text-xs text-destructive hover:underline">
                Remove image
              </button>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading…' : 'Upload'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}