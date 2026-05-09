import { useState, useEffect } from 'react';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserCheck, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { facultyService } from '@/services/facultyService';
import { DEPARTMENTS } from '@/utils/constants';
import { PageShell, PageHeader, Surface, Field, EmptyState, ActionButtons, SkeletonRow } from '@/components/admin/adminUI';

const empty = { name: '', subject: '', qualification: '', department: 'Science', experience: '' };

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase();
}

const DEPT_COLORS = [
  'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700', 'bg-yellow-100 text-yellow-700',
];

export function ManageFaculty() {
  const [faculty,   setFaculty]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [isOpen,    setIsOpen]    = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData,  setFormData]  = useState(empty);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => { fetchFaculty(); }, []);

  async function fetchFaculty() {
    try {
      setLoading(true);
      const data = await facultyService.getFaculty();
      setFaculty(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load faculty'); }
    finally  { setLoading(false); }
  }

  function openNew()   { setFormData(empty); setEditingId(null); setIsOpen(true); }
  function openEdit(m) { setFormData(m); setEditingId(m._id || m.id); setIsOpen(true); }
  function close()     { setIsOpen(false); setEditingId(null); setFormData(empty); }

  async function handleSave() {
    if (!formData.name || !formData.subject) { toast.error('Name and subject are required'); return; }
    try {
      setSaving(true);
      if (editingId) { await facultyService.updateFaculty(editingId, formData); toast.success('Faculty updated'); }
      else           { await facultyService.createFaculty(formData);            toast.success('Faculty added'); }
      close(); fetchFaculty();
    } catch { toast.error('Failed to save'); }
    finally  { setSaving(false); }
  }

  async function handleDelete(id) {
    try { await facultyService.deleteFaculty(id); toast.success('Deleted'); fetchFaculty(); }
    catch { toast.error('Failed to delete'); }
  }

  return (
    <PageShell>
      <PageHeader
        title="Faculty"
        subtitle={`${faculty.length} member${faculty.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={openNew} className="gap-2">
            <Plus className="w-4 h-4" /> Add Faculty
          </Button>
        }
      />

      <Surface>
        <div className="overflow-x-auto rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="font-semibold text-foreground">Member</TableHead>
                <TableHead className="font-semibold text-foreground">Subject</TableHead>
                <TableHead className="font-semibold text-foreground hidden sm:table-cell">Qualification</TableHead>
                <TableHead className="font-semibold text-foreground hidden md:table-cell">Department</TableHead>
                <TableHead className="font-semibold text-foreground hidden lg:table-cell">Experience</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && [...Array(4)].map((_, i) => <SkeletonRow key={i} cols={6} />)}

              {!loading && faculty.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState icon={UserCheck} title="No faculty members yet"
                      description="Click 'Add Faculty' to add your first member." />
                  </TableCell>
                </TableRow>
              )}

              {!loading && faculty.map((m, idx) => {
                const colorClass = DEPT_COLORS[idx % DEPT_COLORS.length];
                return (
                  <TableRow key={m._id || m.id} className="hover:bg-secondary/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center
                          font-bold text-xs shrink-0 ${colorClass}`}>
                          {getInitials(m.name)}
                        </div>
                        <span className="font-medium text-foreground">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.subject}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{m.qualification || '—'}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
                        {m.department}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {m.experience ? `${m.experience} yr${m.experience !== '1' ? 's' : ''}` : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButtons
                        onEdit={() => openEdit(m)}
                        onDelete={() => handleDelete(m._id || m.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Surface>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Faculty' : 'Add Faculty'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <Field label="Name">
              <Input value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="Faculty name" />
            </Field>
            <Field label="Subject">
              <Input value={formData.subject}
                onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                placeholder="Subject name" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Qualification">
                <Input value={formData.qualification}
                  onChange={e => setFormData(p => ({ ...p, qualification: e.target.value }))}
                  placeholder="PhD, M.Sc…" />
              </Field>
              <Field label="Experience (yrs)">
                <Input type="number" value={formData.experience}
                  onChange={e => setFormData(p => ({ ...p, experience: e.target.value }))}
                  placeholder="5" />
              </Field>
            </div>
            <Field label="Department">
              <Select value={formData.department}
                onValueChange={v => setFormData(p => ({ ...p, department: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
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