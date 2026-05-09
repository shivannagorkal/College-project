import { useState, useEffect } from 'react';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Megaphone, Plus, CalendarDays } from 'lucide-react';
import { toast }    from 'sonner';
import { formatDate } from '@/utils/formatDate';
import { announcementService } from '@/services/announcementService';
import { PageShell, PageHeader, Surface, Field, EmptyState, ActionButtons } from '@/components/admin/adminUI';

const empty = { title: '', description: '', date: '' };

export function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [isOpen,        setIsOpen]        = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [formData,      setFormData]      = useState(empty);
  const [saving,        setSaving]        = useState(false);

  useEffect(() => { fetch(); }, []);

  async function fetch() {
    try {
      setLoading(true);
      const data = await announcementService.getAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load announcements'); }
    finally  { setLoading(false); }
  }

  function openNew()  { setFormData(empty); setEditingId(null); setIsOpen(true); }
  function openEdit(a) { setFormData(a); setEditingId(a._id || a.id); setIsOpen(true); }
  function close()    { setIsOpen(false); setEditingId(null); setFormData(empty); }

  async function handleSave() {
    if (!formData.title || !formData.date) { toast.error('Title and date are required'); return; }
    try {
      setSaving(true);
      if (editingId) {
        await announcementService.updateAnnouncement(editingId, formData);
        toast.success('Announcement updated');
      } else {
        await announcementService.createAnnouncement(formData);
        toast.success('Announcement created');
      }
      close(); fetch();
    } catch { toast.error('Failed to save'); }
    finally  { setSaving(false); }
  }

  async function handleDelete(id) {
    try {
      await announcementService.deleteAnnouncement(id);
      toast.success('Deleted');
      fetch();
    } catch { toast.error('Failed to delete'); }
  }

  return (
    <PageShell>
      <PageHeader
        title="Announcements"
        subtitle={`${announcements.length} announcement${announcements.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={openNew} className="gap-2">
            <Plus className="w-4 h-4" /> Add Announcement
          </Button>
        }
      />

      {loading ? (
        <Surface>
          <div className="p-8 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-16 flex-1 bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        </Surface>
      ) : announcements.length === 0 ? (
        <Surface>
          <EmptyState icon={Megaphone} title="No announcements yet"
            description="Click 'Add Announcement' to create your first one." />
        </Surface>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Surface key={a._id || a.id}
              className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-start min-w-0">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground leading-snug truncate">{a.title}</p>
                  {a.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{a.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {formatDate(a.date)}
                  </div>
                </div>
              </div>
              <ActionButtons
                onEdit={() => openEdit(a)}
                onDelete={() => handleDelete(a._id || a.id)}
              />
            </Surface>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <Field label="Title">
              <Input value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="Announcement title" />
            </Field>
            <Field label="Date">
              <Input type="date" value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} />
            </Field>
            <Field label="Description">
              <Textarea value={formData.description}
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Optional description…" rows={3} />
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