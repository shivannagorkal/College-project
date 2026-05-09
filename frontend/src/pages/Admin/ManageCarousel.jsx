import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Upload, ImagePlus, UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { carouselService } from '@/services/carouselService';
import { toast } from 'sonner';

const PAGES = [
  'home', 'about', 'academics', 'results', 'toppers',
  'events', 'gallery', 'faculty', 'admissions',
  'announcements', 'history', 'contact'
];

export function ManageCarousel() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    page: 'home',
    title: '',
    order: 0,
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await carouselService.getCarouselImages(selectedPage);
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load carousel images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [selectedPage]);

  const handleFileChange = (file) => {
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
     setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value
    }));
  };

  const handlePageChange = (value) => {
    setFormData(prev => ({ ...prev, page: value }));
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const handleUpload = async () => {
    const uploadedPage = formData.page;
    
    if (!formData.image) {
      toast.error('Please select an image');
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('image', formData.image);
      fd.append('page', formData.page);
      fd.append('title', formData.title);
      fd.append('order', formData.order);

      await carouselService.uploadCarouselImage(fd);
      toast.success('Image uploaded successfully');

      setFormData({
        page: uploadedPage,
        title: '',
        order: 0,
        image: null,
      });
      setPreview(null);
      setOpen(false);

      const data = await carouselService.getCarouselImages(uploadedPage);
      setImages(Array.isArray(data) ? data : []);

      setSelectedPage(uploadedPage)
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await carouselService.deleteCarouselImage(id);
      toast.success('Image deleted successfully');

      const data = await carouselService.getCarouselImages(selectedPage);
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Carousel Images</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Carousel Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 flex flex-col max-h-120 overflow-auto">
              <div>
                <label className="text-sm font-medium">Page</label>
                <Select value={formData.page} onValueChange={handlePageChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGES.map(page => (
                      <SelectItem key={page} value={page}>
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Title (Optional)</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Image title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Order</label>
                <Input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  placeholder="Display order"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold">
                  Upload Image
                </label>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer text-center
                  ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-14 h-14 text-primary mb-4" />
                  
                    <h3 className="font-bold text-lg">
                      Drag & Drop Image
                    </h3>
                  
                    <p className="text-sm text-gray-500 mt-2">
                      or click to browse files
                    </p>
                  </div>
                </div>
                  
                {/* PREVIEW */}
                {preview && (
                  <div className="relative rounded-3xl overflow-hidden border">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-56 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                      
                        setFormData((prev) => ({
                          ...prev,
                          image: null,
                        }));
                      }}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600
                        text-white rounded-full p-2 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Page Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b">
        {PAGES.map(page => (
          <button
            key={page}
            onClick={() => setSelectedPage(page)}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedPage === page
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(img => (
            <Card key={img._id} className="overflow-hidden">
              <div className="aspect-square bg-gray-200 overflow-hidden">
                <img
                  src={img.image}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-2">
                {img.title && (
                  <p className="text-sm font-medium line-clamp-2">{img.title}</p>
                )}
                <p className="text-xs text-gray-500">Order: {img.order}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(img._id)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No images uploaded for this page yet
        </div>
      )}
    </div>
  );
}
