import { useEffect, useState } from 'react';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { topperService } from '@/services/topperService';
import { YEARS } from '@/utils/constants';
import { PageShell, PageHeader, Surface, Field, EmptyState, ActionButtons, SkeletonRow } from '@/components/admin/adminUI';

const TOPPER_TYPES = ['Board', 'NEET', 'JEE', 'KCET'];

const getDefaultOutOf = (t) => t === 'NEET' ? '720' : t === 'JEE' ? '300' : t === 'KCET' ? '120' : '';

const defaultForm = {
  topperType: 'Board', name: '', rank: '', year: YEARS[0],
  stream: 'Science', group: 'PCMB', percentage: '',
  score: '', outOf: '', percentile: '', karnatakaRank: '',
};

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function Avatar({ topper }) {
  return topper.photo ? (
    <img src={topper.photo} alt={topper.name}
      className="w-9 h-9 rounded-full object-cover border border-border" />
  ) : (
    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary
      flex items-center justify-center text-xs font-bold shrink-0">
      {getInitials(topper.name)}
    </div>
  );
}

const BADGE = {
  Board: 'bg-blue-100 text-blue-700',
  NEET:  'bg-green-100 text-green-700',
  JEE:   'bg-orange-100 text-orange-700',
  KCET:  'bg-pink-100 text-pink-700',
};

export function ManageToppers() {
  const [toppers,   setToppers]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [isOpen,    setIsOpen]    = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [formData,  setFormData]  = useState(defaultForm);
  const [saving,    setSaving]    = useState(false);
  const [activeTab, setActiveTab] = useState('Board');

  useEffect(() => { fetchToppers(); }, []);

  // Sync stream→group
  useEffect(() => {
    if (formData.topperType !== 'Board') return;
    setFormData(p => ({
      ...p,
      group: p.stream === 'Science'
        ? (p.group === 'Commerce' ? 'PCMB' : p.group || 'PCMB')
        : 'Commerce',
    }));
  }, [formData.stream, formData.topperType]);

  // Sync type→outOf
  useEffect(() => {
    setFormData(p => ({
      ...p,
      outOf: getDefaultOutOf(p.topperType),
      ...(p.topperType === 'Board'
        ? {}
        : { stream: '', group: '', percentage: '' }),
    }));
  }, [formData.topperType]);

  async function fetchToppers() {
    try {
      setLoading(true);
      const data = await topperService.getToppers();
      setToppers(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load toppers'); }
    finally  { setLoading(false); }
  }

  function resetForm() { setFormData(defaultForm); setEditingId(null); setPhotoFile(null); }

  function openNew(type = activeTab) {
    resetForm();
    setFormData(p => ({
      ...p, topperType: type, outOf: getDefaultOutOf(type),
      stream: type === 'Board' ? 'Science' : '',
      group:  type === 'Board' ? 'PCMB'    : '',
    }));
    setIsOpen(true);
  }

  function openEdit(t) {
    setFormData({
      topperType:     t.topperType || 'Board',
      name:           t.name || '',
      rank:           t.rank || '',
      year:           t.year || YEARS[0],
      stream:         t.stream || 'Science',
      group:          t.group || 'PCMB',
      percentage:     t.percentage || '',
      score:          t.score || '',
      outOf:          t.outOf || getDefaultOutOf(t.topperType),
      percentile:     t.percentile || '',
      karnatakaRank:  t.karnatakaRank || '',
    });
    setEditingId(t._id || t.id);
    setPhotoFile(null);
    setIsOpen(true);
  }

  function close() { setIsOpen(false); resetForm(); }

  async function handleSave() {
    if (!formData.name || !formData.rank || !formData.year) {
      toast.error('Name, rank and year are required'); return;
    }
    try {
      setSaving(true);
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (photoFile) fd.append('photo', photoFile);
      if (editingId) { await topperService.updateTopper(editingId, fd); toast.success('Updated'); }
      else           { await topperService.createTopper(fd);            toast.success('Added'); }
      close(); fetchToppers();
    } catch { toast.error('Failed to save'); }
    finally  { setSaving(false); }
  }

  async function handleDelete(id) {
    try { await topperService.deleteTopper(id); toast.success('Deleted'); fetchToppers(); }
    catch { toast.error('Failed to delete'); }
  }

  function renderTable(data, type) {
    const isBoard = type === 'Board';
    return (
      <div className="overflow-x-auto rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="font-semibold text-foreground">Student</TableHead>
              {isBoard ? (
                <>
                  <TableHead className="font-semibold text-foreground hidden sm:table-cell">Stream</TableHead>
                  <TableHead className="font-semibold text-foreground hidden md:table-cell">Group</TableHead>
                  <TableHead className="font-semibold text-foreground">Percentage</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="font-semibold text-foreground">Score</TableHead>
                  <TableHead className="font-semibold text-foreground hidden sm:table-cell">
                    {type === 'KCET' ? 'KA Rank' : 'Percentile'}
                  </TableHead>
                </>
              )}
              <TableHead className="font-semibold text-foreground">Rank</TableHead>
              <TableHead className="font-semibold text-foreground hidden md:table-cell">Year</TableHead>
              <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && [...Array(3)].map((_, i) => <SkeletonRow key={i} cols={isBoard ? 7 : 6} />)}

            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={isBoard ? 7 : 6}>
                  <EmptyState icon={GraduationCap}
                    title={`No ${type} toppers yet`}
                    description={`Click "Add Topper" to add a ${type} topper.`} />
                </TableCell>
              </TableRow>
            )}

            {!loading && data.map(t => (
              <TableRow key={t._id || t.id} className="hover:bg-secondary/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar topper={t} />
                    <span className="font-medium text-foreground">{t.name}</span>
                  </div>
                </TableCell>
                {isBoard ? (
                  <>
                    <TableCell className="hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${BADGE[type]}`}>
                        {t.stream}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{t.group}</TableCell>
                    <TableCell className="font-semibold text-foreground">{t.percentage}%</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-semibold text-foreground">
                      {t.score}<span className="text-muted-foreground font-normal">/{t.outOf}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {type === 'KCET'
                        ? (t.karnatakaRank ? `#${t.karnatakaRank}` : '—')
                        : (t.percentile || '—')}
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full
                    text-xs font-bold bg-primary/10 text-primary">
                    #{t.rank}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{t.year}</TableCell>
                <TableCell className="text-right">
                  <ActionButtons onEdit={() => openEdit(t)}
                    onDelete={() => handleDelete(t._id || t.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  const byType = (type) => toppers.filter(t => t.topperType === type);

  return (
    <PageShell>
      <PageHeader
        title="Toppers"
        subtitle={`${toppers.length} topper${toppers.length !== 1 ? 's' : ''} across all categories`}
        action={
          <Button onClick={() => openNew(activeTab)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Topper
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Surface className="p-1 mb-4">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1">
            {TOPPER_TYPES.map(type => (
              <TabsTrigger key={type} value={type}
                className="rounded-xl data-[state=active]:bg-primary
                  data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm
                  text-muted-foreground font-medium text-sm">
                {type}
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold
                  ${activeTab === type ? 'bg-primary-foreground/20' : 'bg-muted'}`}>
                  {byType(type).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Surface>

        {TOPPER_TYPES.map(type => (
          <TabsContent key={type} value={type}>
            <Surface>{renderTable(byType(type), type)}</Surface>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add/Edit dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Topper' : 'Add Topper'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">

            <Field label="Topper Type">
              <Select value={formData.topperType}
                onValueChange={v => setFormData(p => ({ ...p, topperType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TOPPER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Name">
              <Input value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="Student name" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Rank">
                <Input type="number" value={formData.rank}
                  onChange={e => setFormData(p => ({ ...p, rank: e.target.value }))}
                  placeholder="1" />
              </Field>
              <Field label="Year">
                <Select value={formData.year.toString()}
                  onValueChange={v => setFormData(p => ({ ...p, year: Number(v) }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {YEARS.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Photo">
              <Input type="file" accept="image/*"
                onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
            </Field>

            {/* Board-specific */}
            {formData.topperType === 'Board' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Stream">
                    <Select value={formData.stream}
                      onValueChange={v => setFormData(p => ({
                        ...p, stream: v, group: v === 'Science' ? 'PCMB' : 'Commerce',
                      }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  {formData.stream === 'Science' && (
                    <Field label="Group">
                      <Select value={formData.group}
                        onValueChange={v => setFormData(p => ({ ...p, group: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PCMB">PCMB</SelectItem>
                          <SelectItem value="PCMC">PCMC</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                </div>
                <Field label="Percentage">
                  <Input type="number" step="0.01" value={formData.percentage}
                    onChange={e => setFormData(p => ({ ...p, percentage: e.target.value }))}
                    placeholder="98.5" />
                </Field>
              </>
            )}

            {/* Entrance-specific */}
            {['NEET','JEE','KCET'].includes(formData.topperType) && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Score">
                    <Input type="number" value={formData.score}
                      onChange={e => setFormData(p => ({ ...p, score: e.target.value }))}
                      placeholder="650" />
                  </Field>
                  <Field label="Out Of">
                    <Input type="number" value={formData.outOf}
                      onChange={e => setFormData(p => ({ ...p, outOf: e.target.value }))}
                      placeholder={getDefaultOutOf(formData.topperType)} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Percentile">
                    <Input type="number" step="0.01" value={formData.percentile}
                      onChange={e => setFormData(p => ({ ...p, percentile: e.target.value }))}
                      placeholder="99.5" />
                  </Field>
                  {formData.topperType === 'KCET' && (
                    <Field label="Karnataka Rank">
                      <Input type="number" value={formData.karnatakaRank}
                        onChange={e => setFormData(p => ({ ...p, karnatakaRank: e.target.value }))}
                        placeholder="12" />
                    </Field>
                  )}
                </div>
              </>
            )}

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