import { useState, useEffect } from 'react';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays, Plus } from 'lucide-react';
import { toast }       from 'sonner';
import { formatDate }  from '@/utils/formatDate';
import { eventService } from '@/services/eventService';
import { PageShell, PageHeader, Surface, Field, EmptyState, ActionButtons, SkeletonRow } from '@/components/admin/adminUI';

const empty = { title: '', date: '', description: '' };

export function ManageEvents() {
  const [events,    setEvents]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [isOpen,    setIsOpen]    = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData,  setFormData]  = useState(empty);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const data = await eventService.getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load events'); }
    finally  { setLoading(false); }
  }

  function openNew()   { setFormData(empty); setEditingId(null); setIsOpen(true); }
  function openEdit(e) { setFormData(e); setEditingId(e._id || e.id); setIsOpen(true); }
  function close()     { setIsOpen(false); setEditingId(null); setFormData(empty); }

  async function handleSave() {
    if (!formData.title || !formData.date) { toast.error('Title and date are required'); return; }
    try {
      setSaving(true);
      if (editingId) {
        await eventService.updateEvent(editingId, formData);
        toast.success('Event updated');
      } else {
        await eventService.createEvent(formData);
        toast.success('Event created');
      }
      close(); fetchEvents();
    } catch { toast.error('Failed to save event'); }
    finally  { setSaving(false); }
  }

  async function handleDelete(id) {
    try { await eventService.deleteEvent(id); toast.success('Event deleted'); fetchEvents(); }
    catch { toast.error('Failed to delete'); }
  }

  return (
    <PageShell>
      <PageHeader
        title="Events"
        subtitle={`${events.length} event${events.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={openNew} className="gap-2">
            <Plus className="w-4 h-4" /> Add Event
          </Button>
        }
      />

      <Surface>
        <div className="overflow-x-auto rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="font-semibold text-foreground">Title</TableHead>
                <TableHead className="font-semibold text-foreground">Date</TableHead>
                <TableHead className="font-semibold text-foreground hidden md:table-cell">Description</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && [...Array(4)].map((_, i) => <SkeletonRow key={i} cols={4} />)}

              {!loading && events.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <EmptyState icon={CalendarDays} title="No events yet"
                      description="Click 'Add Event' to create your first event." />
                  </TableCell>
                </TableRow>
              )}

              {!loading && events.map(event => (
                <TableRow key={event._id || event.id}
                  className="hover:bg-secondary/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{event.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      {formatDate(event.date)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                      {event.description || '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionButtons
                      onEdit={() => openEdit(event)}
                      onDelete={() => handleDelete(event._id || event.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Surface>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Event' : 'New Event'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <Field label="Title">
              <Input value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="Event title" />
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