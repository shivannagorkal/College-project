import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Edit2, Trash2, Plus, X, Eye } from 'lucide-react';
import { StudentsResultService } from '@/services/StudentsResultService';

// ── Constants ─────────────────────────────────────────────
const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

const sectionSubjects = {
  PCMB: ['Kannada', 'English', 'Physics', 'Chemistry', 'Mathematics', 'Biology'],
  PCMC: ['Kannada', 'English', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
  CEBA: ['Kannada', 'English', 'Computer Science', 'Economics', 'Business Studies', 'Accountancy'],
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
  if (pct >= 90) return { grade: 'A+', color: 'text-green-800',   bg: 'bg-green-200/70'   };
  if (pct >= 80) return { grade: 'A',  color: 'text-green-600',   bg: 'bg-green-200/70'   };
  if (pct >= 70) return { grade: 'B+', color: 'text-emerald-500', bg: 'bg-emerald-200/70' };
  if (pct >= 60) return { grade: 'B',  color: 'text-sky-600',     bg: 'bg-sky-200/70'     };
  if (pct >= 35) return { grade: 'C',  color: 'text-yellow-600',  bg: 'bg-yellow-200/70'  };
  return               { grade: 'F',  color: 'text-red-600',     bg: 'bg-red-200/70'     };
};

const getDefaultSection = (stream) => (stream === 'Science' ? 'PCMB' : 'CEBA');

const buildEmptySubjects = (section) => {
  const subjects = {};
  (sectionSubjects[section] || []).forEach((s) => { subjects[s] = { theory: '', practical: '' }; });
  return subjects;
};

const mergeSubjectsFromDB = (section, dbSubjects) => {
  const subjects = {};
  const raw = dbSubjects && typeof dbSubjects.toObject === 'function'
    ? dbSubjects.toObject() : dbSubjects || {};
  (sectionSubjects[section] || []).forEach((subject) => {
    const stored = raw[subject];
    subjects[subject] = {
      theory:    stored?.theory    != null ? stored.theory.toString()    : '',
      practical: stored?.practical != null ? stored.practical.toString() : '',
    };
  });
  return subjects;
};

const defaultForm = () => ({
  studentImage: null,
  studentName:  '',
  rollNo:       '',
  year:         new Date().getFullYear(),
  stream:       'Science',
  section:      'PCMB',
  subjects:     buildEmptySubjects('PCMB'),
});

// ── Detail overlay component ──────────────────────────────
function StudentDetailModal({ student, onClose }) {
  if (!student) return null;

  const { grade, color, bg } = gradeInfo(parseFloat(student.percentage));

  const totalMaxMarks = Object.keys(student.subjects || {}).reduce(
    (sum, subj) =>
      sum + (SUBJECT_MAX_MARKS[subj]?.theory || 0) + (SUBJECT_MAX_MARKS[subj]?.practical || 0),
    0
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Student Result</DialogTitle>
        </DialogHeader>

        {/* ── Student info row ── */}
        <div className="flex flex-row items-center justify-between gap-4 mb-6 sm:mr-3">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <img
              src={student.studentImage}
              alt={student.studentName}
              className="w-32 h-32 object-cover rounded-xl border shadow-sm shrink-0"
            />
            <div className="space-y-1.5 text-sm">
              <h2 className="text-xl font-bold text-gray-800">{student.studentName}</h2>
              <p><span className="font-semibold">Roll No:</span> {student.rollNo}</p>
              <p><span className="font-semibold">Stream:</span> {student.stream} — {student.section}</p>
              <p><span className="font-semibold">Year:</span> {student.year}</p>
              <p>
                <span className="font-semibold">Total Marks:</span>{' '}
                {student.totalMarks} / {totalMaxMarks}
              </p>
            </div>
          </div>

          {/* Grade badge */}
          <div className="flex flex-col items-center shrink-0">
            <div className={`flex flex-col items-center px-5 py-2 rounded-2xl font-semibold ${bg} ${color} mb-1`}>
              <span className="font-extrabold text-4xl leading-none">{grade}</span>
            </div>
            <p className={`font-extrabold text-3xl mt-1 ${color}`}>
              {student.percentage}%
            </p>
          </div>
        </div>

        {/* ── Marks table ── */}
        <div className="border rounded-xl overflow-hidden text-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead rowSpan={2} className="text-center border font-bold">Subject</TableHead>
                <TableHead colSpan={2} className="text-center border font-bold">Theory</TableHead>
                <TableHead colSpan={2} className="text-center border font-bold">Practical</TableHead>
                <TableHead colSpan={2} className="text-center border font-bold">Total</TableHead>
                <TableHead rowSpan={2} className="text-center border font-bold">Result</TableHead>
              </TableRow>
              <TableRow className="bg-gray-50">
                <TableHead className="text-center border">Max</TableHead>
                <TableHead className="text-center border">Obtained</TableHead>
                <TableHead className="text-center border">Max</TableHead>
                <TableHead className="text-center border">Obtained</TableHead>
                <TableHead className="text-center border">Max</TableHead>
                <TableHead className="text-center border">Obtained</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(student.subjects || {}).map(([subject, marks]) => {
                const maxT = SUBJECT_MAX_MARKS[subject]?.theory    || 0;
                const maxP = SUBJECT_MAX_MARKS[subject]?.practical || 0;
                const pass = marks.total >= 40;
                return (
                  <TableRow key={subject} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium border">{subject}</TableCell>
                    <TableCell className="border text-center text-gray-500">{maxT}</TableCell>
                    <TableCell className="border text-center font-semibold">{marks.theory}</TableCell>
                    <TableCell className="border text-center text-gray-500">{maxP}</TableCell>
                    <TableCell className="border text-center font-semibold">{marks.practical}</TableCell>
                    <TableCell className="border text-center text-gray-500">{maxT + maxP}</TableCell>
                    <TableCell className="border text-center font-semibold">{marks.total}</TableCell>
                    <TableCell className="border text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
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

        {/* Close button */}
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
  const [successMessage, setSuccessMessage] = useState('');
  const [formData,       setFormData]       = useState(defaultForm());

  // ← NEW: which student to show in the detail overlay
  const [viewingStudent, setViewingStudent] = useState(null);

  // ── Fetch ──────────────────────────────────────────────
  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await StudentsResultService.getStudentsResult();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, []);

  // ── Handlers ───────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'studentImage') {
      setFormData(prev => ({ ...prev, studentImage: files[0] }));
      return;
    }
    if (name === 'stream') {
      const defaultSection = getDefaultSection(value);
      setFormData(prev => ({
        ...prev, stream: value, section: defaultSection,
        subjects: buildEmptySubjects(defaultSection),
      }));
      return;
    }
    if (name === 'section') {
      setFormData(prev => {
        const updatedSubjects = {};
        (sectionSubjects[value] || []).forEach(subject => {
          updatedSubjects[subject] = prev.subjects?.[subject] || { theory: '', practical: '' };
        });
        return { ...prev, section: value, subjects: updatedSubjects };
      });
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subject, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: { ...prev.subjects, [subject]: { ...prev.subjects[subject], [field]: value } },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const cleanedSubjects = {};
      Object.keys(formData.subjects).forEach(subject => {
        cleanedSubjects[subject] = {
          theory:    Number(formData.subjects[subject].theory    || 0),
          practical: Number(formData.subjects[subject].practical || 0),
        };
      });
      const submitData = {
        ...formData,
        rollNo: Number(formData.rollNo),
        year:   Number(formData.year),
        subjects: cleanedSubjects,
      };
      if (editingId) {
        await StudentsResultService.updateStudentsResult(editingId, submitData);
      } else {
        await StudentsResultService.createStudentsResult(submitData);
      }
      setSuccessMessage('Saved Successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setOpenDialog(false);
      resetForm();
      fetchResults();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    try {
      await StudentsResultService.deleteStudentsResult(id);
      fetchResults();
    } catch (error) {
      console.error(error);
      alert('Failed to delete result.');
    }
  };

  const handleEdit = (result) => {
    setEditingId(result._id);
    setFormData({
      studentImage: null,
      studentName:  result.studentName,
      rollNo:       result.rollNo,
      year:         result.year,
      stream:       result.stream,
      section:      result.section,
      subjects:     mergeSubjectsFromDB(result.section, result.subjects),
    });
    setOpenDialog(true);
  };

  const resetForm = () => { setEditingId(null); setFormData(defaultForm()); };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="space-y-6 p-4">

      {successMessage && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4 pb-4 text-green-700 font-semibold">{successMessage}</CardContent>
        </Card>
      )}

      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Results</h1>
        <Button
          className="gap-2"
          onClick={() => { resetForm(); setOpenDialog(true); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Student Result
        </Button>
      </div>

      {/* ── Results table ── */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Roll No</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Stream</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-400">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!loading && results.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-400">
                  No results yet. Click "Add Student Result" to get started.
                </TableCell>
              </TableRow>
            )}
            {results.map((result) => (
              <TableRow
                key={result._id}
                // ← click row → open detail overlay
                onClick={() => setViewingStudent(result)}
                className="cursor-pointer hover:bg-purple-50/60 transition-colors"
              >
                <TableCell onClick={e => e.stopPropagation()}>
                  <img
                    src={result.studentImage}
                    alt={result.studentName}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                </TableCell>
                <TableCell className="font-medium">{result.studentName}</TableCell>
                <TableCell>{result.rollNo}</TableCell>
                <TableCell>{result.year}</TableCell>
                <TableCell>{result.stream}</TableCell>
                <TableCell>{result.section}</TableCell>
                <TableCell>
                  <span className={`font-semibold ${gradeInfo(parseFloat(result.percentage)).color}`}>
                    {result.percentage}%
                  </span>
                </TableCell>

                {/* Actions — stop propagation so row click doesn't fire */}
                <TableCell onClick={e => e.stopPropagation()}>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      title="View details"
                      onClick={() => setViewingStudent(result)}
                      className="text-purple-600 hover:bg-purple-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      title="Edit"
                      onClick={() => handleEdit(result)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      title="Delete"
                      onClick={() => handleDelete(result._id)}
                      className="text-red-500 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Student detail overlay ── */}
      {viewingStudent && (
        <StudentDetailModal
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
        />
      )}

      {/* ── Add / Edit dialog ── */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Result' : 'Add Result'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Student Image</Label>
                <Input type="file" name="studentImage" accept="image/*" onChange={handleChange} />
              </div>
              <div>
                <Label>Student Name</Label>
                <Input name="studentName" value={formData.studentName} onChange={handleChange} />
              </div>
              <div>
                <Label>Roll No</Label>
                <Input type="number" name="rollNo" value={formData.rollNo} onChange={handleChange} />
              </div>
              <div>
                <Label>Year</Label>
                <select name="year" value={formData.year} onChange={handleChange}
                  className="w-full border rounded-md p-2">
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <Label>Stream</Label>
                <select name="stream" value={formData.stream} onChange={handleChange}
                  className="w-full border rounded-md p-2">
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>
              <div>
                <Label>Section</Label>
                <select name="section" value={formData.section} onChange={handleChange}
                  className="w-full border rounded-md p-2">
                  {formData.stream === 'Science' ? (
                    <>
                      <option value="PCMB">PCMB</option>
                      <option value="PCMC">PCMC</option>
                    </>
                  ) : (
                    <option value="CEBA">CEBA</option>
                  )}
                </select>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <h2 className="font-bold mb-4">Subjects</h2>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead rowSpan={2} className="text-center border">Subject</TableHead>
                      <TableHead colSpan={2} className="text-center border">Theory</TableHead>
                      <TableHead colSpan={2} className="text-center border">Practical</TableHead>
                    </TableRow>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-center border">Max</TableHead>
                      <TableHead className="text-center border">Obtained</TableHead>
                      <TableHead className="text-center border">Max</TableHead>
                      <TableHead className="text-center border">Obtained</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(formData.subjects).map((subject) => {
                      const maxMarks = SUBJECT_MAX_MARKS[subject];
                      return (
                        <TableRow key={subject}>
                          <TableCell className="text-center border">{subject}</TableCell>
                          <TableCell className="text-center border text-gray-500">
                            {maxMarks?.theory ?? ''}
                          </TableCell>
                          <TableCell className="border">
                            <Input
                              type="number" min={0}
                              value={formData.subjects[subject]?.theory ?? ''}
                              onChange={e => handleSubjectChange(subject, 'theory', e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-center border text-gray-500">
                            {maxMarks?.practical ?? ''}
                          </TableCell>
                          <TableCell className="border">
                            <Input
                              type="number" min={0}
                              value={formData.subjects[subject]?.practical ?? ''}
                              onChange={e => handleSubjectChange(subject, 'practical', e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Save'}
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export { ManageResults };
export default ManageResults;