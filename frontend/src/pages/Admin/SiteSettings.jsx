import { useState, useEffect } from 'react';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2, Phone, Share2, BarChart3, Save,
  GraduationCap, Globe, Instagram, Youtube,
} from 'lucide-react';
import { toast } from 'sonner';
import { siteSettingsService } from '@/services/siteSettingsService';
import { PageShell, PageHeader, Surface, Field } from '@/components/admin/adminUI';

// Section card with icon + title
function Section({ icon: Icon, title, children }) {
  return (
    <Surface className="p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </Surface>
  );
}

const empty = {
  collegeName: '', tagline: '', aboutParagraph: '', address: '',
  phone: '', email: '', facebook: '', instagram: '', youtube: '',
  studentsCount: '', facultyCount: '', foundedYear: '',
};

export function SiteSettings() {
  const [formData, setFormData] = useState(empty);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await siteSettingsService.getSettings();
        setFormData({
          collegeName:    data.collegeName    || '',
          tagline:        data.tagline        || '',
          aboutParagraph: data.aboutParagraph || '',
          address:        data.address        || '',
          phone:          data.phone          || '',
          email:          data.email          || '',
          facebook:       data.facebook       || '',
          instagram:      data.instagram      || '',
          youtube:        data.youtube        || '',
          studentsCount:  data.studentsCount  || '',
          facultyCount:   data.facultyCount   || '',
          foundedYear:    data.foundedYear    || new Date().getFullYear(),
        });
      } catch { toast.error('Failed to load settings'); }
      finally  { setLoading(false); }
    })();
  }, []);

  function set(name, value) { setFormData(p => ({ ...p, [name]: value })); }
  const onChange = e => set(e.target.name, e.target.value);

  async function handleSave() {
    try {
      setSaving(true);
      await siteSettingsService.updateSettings(formData);
      toast.success('Settings saved successfully');
    } catch { toast.error('Failed to save settings'); }
    finally  { setSaving(false); }
  }

  const yearsOfExcellence = formData.foundedYear
    ? new Date().getFullYear() - Number(formData.foundedYear) : 0;

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse h-48 bg-muted rounded-2xl" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Site Settings"
        subtitle="Configure your college website content"
        action={
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">

        {/* College Info */}
        <Section icon={Building2} title="College Information">
          <Field label="College Name">
            <Input name="collegeName" value={formData.collegeName} onChange={onChange}
              placeholder="e.g. Sri Vidya PU College" />
          </Field>
          <Field label="Tagline">
            <Input name="tagline" value={formData.tagline} onChange={onChange}
              placeholder="e.g. Excellence in Education" />
          </Field>
          <Field label="Founded Year">
            <Input type="number" name="foundedYear" value={formData.foundedYear} onChange={onChange}
              placeholder={new Date().getFullYear().toString()} />
          </Field>
          <Field label="About Paragraph">
            <Textarea name="aboutParagraph" value={formData.aboutParagraph} onChange={onChange}
              placeholder="Write a brief about the college…" rows={4} />
          </Field>
        </Section>

        {/* Contact Info */}
        <Section icon={Phone} title="Contact Information">
          <Field label="Address">
            <Textarea name="address" value={formData.address} onChange={onChange}
              placeholder="College address" rows={3} />
          </Field>
          <Field label="Phone">
            <Input name="phone" value={formData.phone} onChange={onChange}
              placeholder="+91 XXXXX XXXXX" />
          </Field>
          <Field label="Email">
            <Input type="email" name="email" value={formData.email} onChange={onChange}
              placeholder="info@college.edu" />
          </Field>
        </Section>

        {/* Social Media */}
        <Section icon={Share2} title="Social Media">
          <Field label="Facebook URL">
            <div className="flex items-center gap-2 border border-input rounded-lg overflow-hidden
              focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <div className="px-3 py-2 bg-secondary border-r border-input shrink-0">
                <Globe className="w-4 h-4 text-muted-foreground" />
              </div>
              <input name="facebook" value={formData.facebook} onChange={onChange}
                placeholder="https://facebook.com/…"
                className="flex-1 bg-transparent text-sm outline-none px-3 py-2 text-foreground
                  placeholder:text-muted-foreground" />
            </div>
          </Field>
          <Field label="Instagram URL">
            <div className="flex items-center gap-2 border border-input rounded-lg overflow-hidden
              focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <div className="px-3 py-2 bg-secondary border-r border-input shrink-0">
                <Instagram className="w-4 h-4 text-muted-foreground" />
              </div>
              <input name="instagram" value={formData.instagram} onChange={onChange}
                placeholder="https://instagram.com/…"
                className="flex-1 bg-transparent text-sm outline-none px-3 py-2 text-foreground
                  placeholder:text-muted-foreground" />
            </div>
          </Field>
          <Field label="YouTube URL">
            <div className="flex items-center gap-2 border border-input rounded-lg overflow-hidden
              focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <div className="px-3 py-2 bg-secondary border-r border-input shrink-0">
                <Youtube className="w-4 h-4 text-muted-foreground" />
              </div>
              <input name="youtube" value={formData.youtube} onChange={onChange}
                placeholder="https://youtube.com/…"
                className="flex-1 bg-transparent text-sm outline-none px-3 py-2 text-foreground
                  placeholder:text-muted-foreground" />
            </div>
          </Field>
        </Section>

        {/* Statistics */}
        <Section icon={BarChart3} title="Statistics">
          <Field label="Total Students">
            <Input name="studentsCount" value={formData.studentsCount} onChange={onChange}
              placeholder="e.g. 5,000+" />
          </Field>
          <Field label="Faculty Count">
            <Input name="facultyCount" value={formData.facultyCount} onChange={onChange}
              placeholder="e.g. 50+" />
          </Field>
          <Field label="Years of Excellence (auto-calculated)">
            <div className="flex items-center gap-3 h-10 px-3 rounded-lg border border-border
              bg-secondary text-muted-foreground text-sm">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>{yearsOfExcellence} year{yearsOfExcellence !== 1 ? 's' : ''}</span>
            </div>
          </Field>
        </Section>

      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2 px-8">
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save All Settings'}
        </Button>
      </div>
    </PageShell>
  );
}