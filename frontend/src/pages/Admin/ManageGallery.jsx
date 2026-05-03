import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, CreditCard as Edit2, Plus } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { galleryService } from '@/services/galleryService';
import { GALLERY_CATEGORIES, YEARS } from '@/utils/constants';

export function ManageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'Sports', year: YEARS[0] });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getImages();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (image = null) => {
    if (image) {
      setFormData({ title: image.title, category: image.category, year: image.year });
      setEditingId(image._id || image.id);
    } else {
      setFormData({ title: '', category: 'Sports', year: YEARS[0] });
      setEditingId(null);
    }
    setImageFile(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData({ title: '', category: 'Sports', year: YEARS[0] });
    setImageFile(null);
  };

  const handleSave = async () => {
    if (!formData.title) return;
    if (!editingId && !imageFile) {
      toast.error('Please upload an image');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('category', formData.category);
      fd.append('year', formData.year);
      if (imageFile) {
        fd.append('image', imageFile);
      }

      if (editingId) {
        await galleryService.updateGallery(editingId, fd);
        toast.success('Image updated successfully');
      } else {
        await galleryService.createGallery(fd);
        toast.success('Image added successfully');
      }
      handleClose();
      fetchGallery();
    } catch (error) {
      toast.error('Failed to save image');
    }
  };

  const handleDelete = async (id) => {
    try {
      await galleryService.deleteGallery(id);
      toast.success('Image deleted');
      fetchGallery();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Gallery</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpen()} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Image' : 'Add New Image'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Image title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GALLERY_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <Select
                    value={formData.year.toString()}
                    onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image._id || image.id} className="relative group">
                    {image.image ? (
                      <img src={image.image} alt={image.title} className="h-40 w-full object-cover rounded-lg" />
                    ) : (
                      <div className="bg-gray-300 h-40 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">📷</span>
                      </div>
                    )}
                    <p className="mt-2 text-sm font-medium truncate">{image.title}</p>
                    <p className="text-xs text-gray-600">{image.category} • {image.year}</p>
                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpen(image)}
                        className="flex-1"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(image._id || image.id)}
                        className="flex-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
