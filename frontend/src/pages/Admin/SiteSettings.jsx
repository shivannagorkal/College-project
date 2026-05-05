import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteSettingsService } from '@/services/siteSettingsService';
import { toast } from 'sonner';

export function SiteSettings() {
  const [formData, setFormData] = useState({
    collegeName: '',
    tagline: '',
    aboutParagraph: '',
    address: '',
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
    youtube: '',
    studentsCount: '',
    facultyCount: '',
    foundedYear: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await siteSettingsService.getSettings();
        setFormData({
          collegeName: data.collegeName || '',
          tagline: data.tagline || '',
          aboutParagraph: data.aboutParagraph || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          youtube: data.youtube || '',
          studentsCount: data.studentsCount || '',
          facultyCount: data.facultyCount || '',
          foundedYear: data.foundedYear || new Date().getFullYear(),
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await siteSettingsService.updateSettings(formData);
      toast.success('Settings saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  const yearsOfExcellence = formData.foundedYear
    ? new Date().getFullYear() - formData.foundedYear
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

      <div className="space-y-8">
        {/* College Info */}
        <Card>
          <CardHeader>
            <CardTitle>College Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">College Name</label>
              <Input
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="College name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tagline</label>
              <Input
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="College tagline"
              />
            </div>
            <div>
              <label className="text-sm font-medium">About Paragraph</label>
              <Textarea
                name="aboutParagraph"
                value={formData.aboutParagraph}
                onChange={handleChange}
                placeholder="About college paragraph"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Founded Year</label>
              <Input
                type="number"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Address</label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="College address"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Facebook URL</label>
              <Input
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="Facebook profile URL"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Instagram URL</label>
              <Input
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="Instagram profile URL"
              />
            </div>
            <div>
              <label className="text-sm font-medium">YouTube URL</label>
              <Input
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                placeholder="YouTube channel URL"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Students Count</label>
              <Input
                name="studentsCount"
                value={formData.studentsCount}
                onChange={handleChange}
                placeholder="e.g., 5,000+"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Faculty Count</label>
              <Input
                name="facultyCount"
                value={formData.facultyCount}
                onChange={handleChange}
                placeholder="e.g., 50+"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Years of Excellence (Read-only)</label>
              <Input
                value={yearsOfExcellence}
                disabled
                className="bg-gray-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
