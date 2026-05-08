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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { StudentsResultService } from '@/services/StudentsResultService';


const YEARS = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);

const sectionSubjects = {
  PCMB: ['Kannada', 'English', 'Physics', 'Chemistry', 'Mathematics', 'Biology'],
  PCMC: ['Kannada', 'English', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
  CEBA: ['Kannada', 'English', 'Computer Science', 'Economics', 'Business Studies', 'Accountancy'],
};

const getDefaultSection = (stream) =>
  stream === 'Science' ? 'PCMB' : 'CEBA';

const buildEmptySubjects = (section) => {
  const subjects = {};
  (sectionSubjects[section] || []).forEach((subject) => {
    subjects[subject] = { theory: '', practical: '' };
  });
  return subjects;
};

// Merges DB subjects onto the canonical subject list for a section.
// Handles plain objects, Mongoose Maps, and toObject() results.
const mergeSubjectsFromDB = (section, dbSubjects) => {
  const subjects = {};
  const raw =
    dbSubjects && typeof dbSubjects.toObject === 'function'
      ? dbSubjects.toObject()
      : dbSubjects || {};

  (sectionSubjects[section] || []).forEach((subject) => {
    const stored = raw[subject];
    subjects[subject] = {
      theory: stored?.theory != null ? stored.theory.toString() : '',
      practical: stored?.practical != null ? stored.practical.toString() : '',
    };
  });
  return subjects;
};

const defaultForm = () => ({
  studentImage: null,
  studentName: '',
  rollNo: '',
  year: new Date().getFullYear(),
  stream: 'Science',
  section: 'PCMB',
  subjects: buildEmptySubjects('PCMB'),
});

// total and maximum marks :
const SUBJECT_MAX_MARKS = {

  Kannada: {
    theory: 80,
    practical: 20
  },

  English: {
    theory: 80,
    practical: 20
  },

  Mathematics: {
    theory: 80,
    practical: 20
  },

  Physics: {
    theory: 70,
    practical: 30
  },

  Chemistry: {
    theory: 70,
    practical: 30
  },

  Biology: {
    theory: 70,
    practical: 30
  },

  "Computer Science": {
    theory: 70,
    practical: 30
  },

  Statistics: {
    theory: 70,
    practical: 30
  },

  Economics: {
    theory: 80,
    practical: 20
  },

  "Business Studies": {
    theory: 80,
    practical: 20
  },

  Accountancy: {
    theory: 80,
    practical: 20
  }
};


const ManageResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(defaultForm());


  // FETCH RESULTS
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

  useEffect(() => {
    fetchResults();
  }, []);


  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file input
    if (name === 'studentImage') {
      setFormData((prev) => ({ ...prev, studentImage: files[0] }));
      return;
    }

    // When stream changes, reset section and subjects together
    if (name === 'stream') {
      const defaultSection = getDefaultSection(value);
      setFormData((prev) => ({
        ...prev,
        stream: value,
        section: defaultSection,
        subjects: buildEmptySubjects(defaultSection),
      }));
      return;
    }

    // When section changes, rebuild subjects (preserve existing values)
    if (name === 'section') {
      setFormData((prev) => {
        const updatedSubjects = {};
        (sectionSubjects[value] || []).forEach((subject) => {
          updatedSubjects[subject] = prev.subjects?.[subject] || {
            theory: '',
            practical: '',
          };
        });
        return { ...prev, section: value, subjects: updatedSubjects };
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // SUBJECT CHANGE
  const handleSubjectChange = (subject, field, value) => {
    setFormData((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          // Keep as string while typing so the input stays controlled;
          // converted to Number on submit
          [field]: value,
        },
      },
    }));
  };


  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const cleanedSubjects = {};
      Object.keys(formData.subjects).forEach((subject) => {
        cleanedSubjects[subject] = {
          theory: Number(formData.subjects[subject].theory || 0),
          practical: Number(formData.subjects[subject].practical || 0),
        };
      });

      const submitData = {
        ...formData,
        rollNo: Number(formData.rollNo),
        year: Number(formData.year),
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


  // DELETE
  const handleDelete = async (id) => {
    if (window.confirm('Delete this result?')) {
      await StudentsResultService.deleteStudentsResult(id);
      fetchResults();
    }
  };


  // EDIT
  const handleEdit = (result) => {
    setEditingId(result._id);

    // Always rebuild from the canonical section list so every subject row
    // is guaranteed to appear, then overlay whatever the DB returned.
    const normalisedSubjects = mergeSubjectsFromDB(result.section, result.subjects);

    setFormData({
      studentImage: null,
      studentName: result.studentName,
      rollNo: result.rollNo,
      year: result.year,
      stream: result.stream,
      section: result.section,
      subjects: normalisedSubjects,
    });

    setOpenDialog(true);
  };


  // RESET
  const resetForm = () => {
    setEditingId(null);
    setFormData(defaultForm());
  };


  return (
    <div className="space-y-6 p-4">

      {successMessage && (
        <Card className="bg-green-50">
          <CardContent className="pt-6">{successMessage}</CardContent>
        </Card>
      )}

      <Button
        onClick={() => {
          resetForm();
          setOpenDialog(true);
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Student Result
      </Button>


      {/* TABLE */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
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
            {results.map((result) => (
              <TableRow key={result._id}>
                <TableCell>
                  <img
                    src={result.studentImage}
                    alt=""
                    className="w-12 h-12 rounded object-cover"
                  />
                </TableCell>
                <TableCell>{result.studentName}</TableCell>
                <TableCell>{result.rollNo}</TableCell>
                <TableCell>{result.year}</TableCell>
                <TableCell>{result.stream}</TableCell>
                <TableCell>{result.section}</TableCell>
                <TableCell>{result.percentage}%</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(result)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(result._id)}
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


      {/* DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Result' : 'Add Result'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* BASIC INFO */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <Label>Student Image</Label>
                <Input
                  type="file"
                  name="studentImage"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Student Name</Label>
                <Input
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Roll No</Label>
                <Input
                  type="number"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Year</Label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Stream</Label>
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>

              <div>
                <Label>Section</Label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >
                  {formData.stream === 'Science' ? (
                    <>
                      <option value="PCMB">PCMB</option>
                      <option value="PCMC">PCMC</option>
                    </>
                  ) : (
                    <>
                      <option value="CEBA">CEBA</option>
                    </>
                  )}
                </select>
              </div>

            </div>


            {/* SUBJECTS */}
            <div>
              <h2 className="font-bold mb-4">Subjects</h2>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead rowSpan={2} className="text-center border">Subject</TableHead>
                      <TableHead colSpan={2} className="text-center border">Theory</TableHead>
                      <TableHead colSpan={2} className="text-center border">Practical</TableHead>
                    </TableRow>
                    <TableRow>
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

                        <TableCell className="text-center border min-w-20">
                          {maxMarks?.theory ?? ''}
                        </TableCell>

                        <TableCell className="text-center border">
                          <Input
                            type="number"
                            min={0}
                            value={formData.subjects[subject]?.theory ?? ''}
                            onChange={(e) =>
                              handleSubjectChange(subject, 'theory', e.target.value)
                            }
                          />
                        </TableCell>

                        <TableCell className="text-center border">
                          {maxMarks?.practical ?? ''}
                        </TableCell>

                        <TableCell className="text-center border">
                          <Input
                            type="number"
                            min={0}
                            value={formData.subjects[subject]?.practical ?? ''}
                            onChange={(e) =>
                              handleSubjectChange(subject, 'practical', e.target.value)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  </TableBody>
                </Table>
              </div>
            </div>


            {/* BUTTONS */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>

              <Button type="submit">
                {loading ? 'Saving...' : 'Save'}
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