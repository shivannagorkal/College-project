import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { StudentsResultService } from '@/services/StudentsResultService';
import { PageShell, PageHeader, Surface, Field, EmptyState, SkeletonRow, NativeSelect } from '@/components/admin/adminUI';

// ── Constants ─────────────────────────────────────────────
const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

const sectionSubjects = {
  PCMB: ['Kannada','English','Physics','Chemistry','Mathematics','Biology'],
  PCMC: ['Kannada','English','Physics','Chemistry','Mathematics','Computer Science'],
  CEBA: ['Kannada','English','Computer Science','Economics','Business Studies','Accountancy'],
};

const SUBJECT_MAX_MARKS = {
  Kannada:            { theory: 80, practical: 20 },
  English:            { theory: 80, practical: 20 },
  Mathematics:        { theory: 80, practical: 20 },
  Physics:            { theory: 70, practical: 30 },
  Chemistry:          { theory: 70, practical: 30 },
  Biology:            { theory: 70, practical: 30 },
  'Computer Science': { theory: 70, practical: 30 },
  Statistics:         { theory: 70, practical: 30 },
  Economics:          { theory: 80, practical: 20 },
  'Business Studies': { theory: 80, practical: 20 },
  Accountancy:        { theory: 80, practical: 20 },
};

const gradeInfo = (pct) => {
  if (pct >= 90) return { grade: 'A+', color: 'text-green-700',   bg: 'bg-green-100'   };
  if (pct >= 80) return { grade: 'A',  color: 'text-green-600',   bg: 'bg-green-100'   };
  if (pct >= 70) return { grade: 'B+', color: 'text-emerald-600', bg: 'bg-emerald-100' };
  if (pct >= 60) return { grade: 'B',  color: 'text-sky-600',     bg: 'bg-sky-100'     };
  if (pct >= 35) return { grade: 'C',  color: 'text-yellow-600',  bg: 'bg-yellow-100'  };
  return               { grade: 'F',  color: 'text-red-600',     bg: 'bg-red-100'     };
};

const getDefaultSection = s => s === 'Science' ? 'PCMB' : 'CEBA';

const buildEmpty = (section) => {
  const s = {};
  (sectionSubjects[section] || []).forEach(sub => { s[sub] = { theory: '', practical: '' }; });
  return s;
};

const mergeFromDB = (section, dbSubjects) => {
  const s = {};
  const raw = dbSubjects && typeof dbSubjects.toObject === 'function'
    ? dbSubjects.toObject() : dbSubjects || {};
  (sectionSubjects[section] || []).forEach(sub => {
    const stored = raw[sub];
    s[sub] = {
      theory:    stored?.theory    != null ? stored.theory.toString()    : '',
      practical: stored?.practical != null ? stored.practical.toString() : '',
    };
  });
  return s;
};

const defaultForm = () => ({
  studentImage: null, studentName: '', rollNo: '',
  year: new Date().getFullYear(), stream: 'Science', section: 'PCMB',
  subjects: buildEmpty('PCMB'),
});

// ── Student detail modal ──────────────────────────────────
function DetailModal({ student, onClose }) {
  if (!student) return null;
  const { grade, color, bg } = gradeInfo(parseFloat(student.percentage));
  const totalMax = Object.keys(student.subjects || {}).reduce(
    (sum, s) => sum + (SUBJECT_MAX_MARKS[s]?.theory || 0) + (SUBJECT_MAX_MARKS[s]?.practical || 0), 0
  );
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Result</DialogTitle>
        </DialogHeader>

        {/* Info row */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-5 mb-5">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <img src={student.studentImage} alt={student.studentName}
              className="w-28 h-28 object-cover rounded-2xl border border-border shadow-sm shrink-0" />
            <div className="space-y-1.5 text-sm">
              <h2 className="text-lg font-bold text-foreground">{student.studentName}</h2>
              {[
                ['Roll No',      student.rollNo],
                ['Stream',       `${student.stream} — ${student.section}`],
                ['Year',         student.year],
                ['Total Marks',  `${student.totalMarks} / ${totalMax}`],
              ].map(([label, val]) => (
                <p key={label} className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{label}:</span> {val}
                </p>
              ))}
            </div>
          </div>
          <div className={`flex flex-col items-center px-6 py-4 rounded-2xl ${bg} shrink-0`}>
            <span className={`text-5xl font-black leading-none ${color}`}>{grade}</span>
            <span className={`text-xl font-bold mt-1 ${color}`}>{student.percentage}%</span>
          </div>
        </div>

        {/* Marks table */}
        <div className="border border-border rounded-xl overflow-hidden text-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead rowSpan={2} className="font-semibold text-foreground border-r border-border">Subject</TableHead>
                <TableHead colSpan={2} className="text-center font-semibold text-foreground border-r border-border">Theory</TableHead>
                <TableHead colSpan={2} className="text-center font-semibold text-foreground border-r border-border">Practical</TableHead>
                <TableHead colSpan={2} className="text-center font-semibold text-foreground border-r border-border">Total</TableHead>
                <TableHead rowSpan={2} className="text-center font-semibold text-foreground">Result</TableHead>
              </TableRow>
              <TableRow className="bg-secondary hover:bg-secondary">
                {['Max','Got','Max','Got','Max','Got'].map((h, i) => (
                  <TableHead key={i} className={`text-center text-xs text-muted-foreground
                    ${i % 2 === 1 ? 'border-r border-border' : ''}`}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(student.subjects || {}).map(([subj, marks]) => {
                const maxT = SUBJECT_MAX_MARKS[subj]?.theory    || 0;
                const maxP = SUBJECT_MAX_MARKS[subj]?.practical || 0;
                const pass = marks.total >= 40;
                return (
                  <TableRow key={subj} className="hover:bg-secondary/50">
                    <TableCell className="font-medium border-r border-border">{subj}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{maxT}</TableCell>
                    <TableCell className="text-center font-semibold border-r border-border">{marks.theory}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{maxP}</TableCell>
                    <TableCell className="text-center font-semibold border-r border-border">{marks.practical}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{maxT + maxP}</TableCell>
                    <TableCell className="text-center font-semibold border-r border-border">{marks.total}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                        ${pass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {pass ? 'Pass' : 'Fail'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── ManageResults ─────────────────────────────────────────
const ManageResults = () => {
  const [results,        setResults]        = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [openDialog,     setOpenDialog]     = useState(false);
  const [editingId,      setEditingId]      = useState(null);
  const [formData,       setFormData]       = useState(defaultForm());
  const [viewingStudent, setViewingStudent] = useState(null);
  const [saving,         setSaving]         = useState(false);

  async function fetchResults() {
    try {
      setLoading(true);
      const data = await StudentsResultService.getStudentsResult();
      setResults(data);
    } catch { toast.error('Failed to load results'); }
    finally  { setLoading(false); }
  }

  useEffect(() => { fetchResults(); }, []);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'studentImage') {
      setFormData(p => ({ ...p, studentImage: files[0] })); return;
    }
    if (name === 'stream') {
      const sec = getDefaultSection(value);
      setFormData(p => ({ ...p, stream: value, section: sec, subjects: buildEmpty(sec) })); return;
    }
    if (name === 'section') {
      setFormData(p => {
        const s = {};
        (sectionSubjects[value] || []).forEach(sub => {
          s[sub] = p.subjects?.[sub] || { theory: '', practical: '' };
        });
        return { ...p, section: value, subjects: s };
      }); return;
    }
    setFormData(p => ({ ...p, [name]: value }));
  }

  function handleSubjectChange(subject, field, value) {
    setFormData(p => ({
      ...p, subjects: { ...p.subjects, [subject]: { ...p.subjects[subject], [field]: value } },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      const cleaned = {};
      Object.keys(formData.subjects).forEach(s => {
        cleaned[s] = {
          theory:    Number(formData.subjects[s].theory    || 0),
          practical: Number(formData.subjects[s].practical || 0),
        };
      });
      const payload = { ...formData, rollNo: Number(formData.rollNo), year: Number(formData.year), subjects: cleaned };
      if (editingId) {
        await StudentsResultService.updateStudentsResult(editingId, payload);
        toast.success('Result updated');
      } else {
        await StudentsResultService.createStudentsResult(payload);
        toast.success('Result added');
      }
      setOpenDialog(false); resetForm(); fetchResults();
    } catch { toast.error('Failed to save'); }
    finally  { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this result?')) return;
    try { await StudentsResultService.deleteStudentsResult(id); toast.success('Deleted'); fetchResults(); }
    catch { toast.error('Failed to delete'); }
  }

  function handleEdit(r) {
    setEditingId(r._id);
    setFormData({
      studentImage: null, studentName: r.studentName, rollNo: r.rollNo,
      year: r.year, stream: r.stream, section: r.section,
      subjects: mergeFromDB(r.section, r.subjects),
    });
    setOpenDialog(true);
  }

  function resetForm() { setEditingId(null); setFormData(defaultForm()); }

  return (
    <PageShell>
      <PageHeader
        title="Student Results"
        subtitle={`${results.length} result${results.length !== 1 ? 's' : ''} — click any row to view details`}
        action={
          <Button className="gap-2" onClick={() => { resetForm(); setOpenDialog(true); }}>
            <Plus className="w-4 h-4" /> Add Result
          </Button>
        }
      />

      <Surface>
        <div className="overflow-x-auto rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="font-semibold text-foreground">Student</TableHead>
                <TableHead className="font-semibold text-foreground hidden sm:table-cell">Roll No</TableHead>
                <TableHead className="font-semibold text-foreground hidden md:table-cell">Year</TableHead>
                <TableHead className="font-semibold text-foreground hidden md:table-cell">Stream</TableHead>
                <TableHead className="font-semibold text-foreground hidden lg:table-cell">Section</TableHead>
                <TableHead className="font-semibold text-foreground">Grade</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && [...Array(4)].map((_, i) => <SkeletonRow key={i} cols={7} />)}

              {!loading && results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <EmptyState icon={Trophy} title="No results yet"
                      description="Click 'Add Result' to enter your first student result." />
                  </TableCell>
                </TableRow>
              )}

              {!loading && results.map(r => {
                const { grade, color, bg } = gradeInfo(parseFloat(r.percentage));
                return (
                  <TableRow key={r._id}
                    onClick={() => setViewingStudent(r)}
                    className="cursor-pointer hover:bg-secondary/50 transition-colors">
                    <TableCell onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <img src={r.studentImage} alt={r.studentName}
                          className="w-9 h-9 rounded-xl object-cover border border-border shrink-0" />
                        <span className="font-medium text-foreground">{r.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{r.rollNo}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{r.year}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{r.stream}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{r.section}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${bg}`}>
                        <span className={`text-xs font-bold ${color}`}>{grade}</span>
                        <span className={`text-xs font-semibold ${color}`}>{r.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell onClick={e => e.stopPropagation()} className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewingStudent(r)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEdit(r)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(r._id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Surface>

      {/* Detail modal */}
      {viewingStudent && (
        <DetailModal student={viewingStudent} onClose={() => setViewingStudent(null)} />
      )}

      {/* Add / Edit dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Result' : 'Add Result'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-1">

            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Student Image">
                <Input type="file" name="studentImage" accept="image/*" onChange={handleChange} />
              </Field>
              <Field label="Student Name">
                <Input name="studentName" value={formData.studentName} onChange={handleChange}
                  placeholder="Full name" />
              </Field>
              <Field label="Roll No">
                <Input type="number" name="rollNo" value={formData.rollNo} onChange={handleChange}
                  placeholder="101" />
              </Field>
              <Field label="Year">
                <NativeSelect name="year" value={formData.year} onChange={handleChange}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </NativeSelect>
              </Field>
              <Field label="Stream">
                <NativeSelect name="stream" value={formData.stream} onChange={handleChange}>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                </NativeSelect>
              </Field>
              <Field label="Section">
                <NativeSelect name="section" value={formData.section} onChange={handleChange}>
                  {formData.stream === 'Science' ? (
                    <>
                      <option value="PCMB">PCMB</option>
                      <option value="PCMC">PCMC</option>
                    </>
                  ) : (
                    <option value="CEBA">CEBA</option>
                  )}
                </NativeSelect>
              </Field>
            </div>

            {/* Subjects */}
            <div>
              <p className="font-semibold text-foreground mb-3">Subject Marks</p>
              <div className="border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary hover:bg-secondary">
                      <TableHead rowSpan={2} className="font-semibold text-foreground border-r border-border">Subject</TableHead>
                      <TableHead colSpan={2} className="text-center font-semibold text-foreground border-r border-border">Theory</TableHead>
                      <TableHead colSpan={2} className="text-center font-semibold text-foreground">Practical</TableHead>
                    </TableRow>
                    <TableRow className="bg-secondary hover:bg-secondary">
                      {['Max','Obtained','Max','Obtained'].map((h, i) => (
                        <TableHead key={i} className={`text-center text-xs text-muted-foreground
                          ${i === 1 ? 'border-r border-border' : ''}`}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(formData.subjects).map(subject => {
                      const max = SUBJECT_MAX_MARKS[subject];
                      return (
                        <TableRow key={subject} className="hover:bg-secondary/30">
                          <TableCell className="font-medium border-r border-border">{subject}</TableCell>
                          <TableCell className="text-center text-muted-foreground text-sm">{max?.theory ?? ''}</TableCell>
                          <TableCell className="border-r border-border py-1.5 px-2">
                            <Input type="number" min={0} className="h-8 text-center"
                              value={formData.subjects[subject]?.theory ?? ''}
                              onChange={e => handleSubjectChange(subject, 'theory', e.target.value)} />
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground text-sm">{max?.practical ?? ''}</TableCell>
                          <TableCell className="py-1.5 px-2">
                            <Input type="number" min={0} className="h-8 text-center"
                              value={formData.subjects[subject]?.practical ?? ''}
                              onChange={e => handleSubjectChange(subject, 'practical', e.target.value)} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export { ManageResults };
export default ManageResults;