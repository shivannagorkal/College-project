import React, {
  useEffect,
  useState
} from 'react';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent
} from '@/components/ui/card';

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

import {
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';

import {
  StudentsResultService
} from '@/services/StudentsResultService';


const YEARS = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);


const sectionSubjects = {

  PCMB: [
    'Kannada',
    'English',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology'
  ],

  PCMC: [
    'Kannada',
    'English',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Computer Science'
  ],

  SEBA: [
    'Kannada',
    'English',
    'Statistics',
    'Economics',
    'Business Studies',
    'Accountancy'
  ],

  CEBA: [
    'Kannada',
    'English',
    'Computer Science',
    'Economics',
    'Business Studies',
    'Accountancy'
  ]
};


const ManageResults = () => {

  const [results, setResults] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [openDialog, setOpenDialog] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState('');


  const [formData, setFormData] =
    useState({

      studentImage: null,

      studentName: '',

      rollNo: '',

      year: new Date().getFullYear(),

      stream: 'Science',

      section: 'PCMB',

      subjects: {}
    });


  // FETCH RESULTS
  const fetchResults = async () => {

    try {

      setLoading(true);

      const data =
        await StudentsResultService
          .getStudentsResult();

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


  // AUTO SUBJECTS
  useEffect(() => {

  const subjectsList =
    sectionSubjects[formData.section] || [];

  setFormData((prev) => {

    const updatedSubjects = {};

    subjectsList.forEach((subject) => {

      updatedSubjects[subject] =

        prev.subjects?.[subject]

        ||

        {
          theory: 0,
          practical: 0
        };
    });

    return {
      ...prev,
      subjects: updatedSubjects
    };
  });

}, [formData.section]);


  // INPUT CHANGE
  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (name === 'studentImage') {

      setFormData((prev) => ({
        ...prev,
        studentImage: files[0]
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  // SUBJECT CHANGE
  const handleSubjectChange = (
    subject,
    field,
    value
  ) => {

    setFormData((prev) => ({

      ...prev,

      subjects: {

        ...prev.subjects,

        [subject]: {

          ...prev.subjects[subject],

          [field]: value
        }
      }
    }));
  };


  // SUBMIT
const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    setLoading(true);

    const cleanedSubjects = {};

    Object.keys(formData.subjects)
      .forEach((subject) => {

        cleanedSubjects[subject] = {

          theory: Number(
            formData.subjects[subject]
              .theory || 0
          ),

          practical: Number(
            formData.subjects[subject]
              .practical || 0
          )
        };
      });

    const submitData = {

      ...formData,

      rollNo: Number(formData.rollNo),

      year: Number(formData.year),

      subjects: cleanedSubjects
    };

    if (editingId) {

      await StudentsResultService
        .updateStudentsResult(
          editingId,
          submitData
        );

    } else {

      await StudentsResultService
        .createStudentsResult(
          submitData
        );
    }

    setSuccessMessage(
      'Saved Successfully'
    );

    setTimeout(() => {

      setSuccessMessage('');

    }, 3000);

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

    if (
      window.confirm(
        'Delete this result?'
      )
    ) {

      await StudentsResultService
        .deleteStudentsResult(id);

      fetchResults();
    }
  };


  // EDIT
  const handleEdit = (result) => {

    setEditingId(result._id);

    setFormData({

      studentImage: null,

      studentName:
        result.studentName,

      rollNo:
        result.rollNo,

      year:
        result.year,

      stream:
        result.stream,

      section:
        result.section,

      subjects:
        result.subjects || {}
    });

    setOpenDialog(true);
  };


  // RESET
  const resetForm = () => {

    setEditingId(null);

    setFormData({

      studentImage: null,

      studentName: '',

      rollNo: '',

      year:
        new Date().getFullYear(),

      stream: 'Science',

      section: 'PCMB',

      subjects: {}
    });
  };


  return (

    <div className="space-y-6">


      {successMessage && (

        <Card className="bg-green-50">

          <CardContent className="pt-6">

            {successMessage}

          </CardContent>

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

              <TableHead>
                Image
              </TableHead>

              <TableHead>
                Name
              </TableHead>

              <TableHead>
                Roll No
              </TableHead>

              <TableHead>
                Year
              </TableHead>

              <TableHead>
                Stream
              </TableHead>

              <TableHead>
                Section
              </TableHead>

              <TableHead>
                Percentage
              </TableHead>

              <TableHead>
                Actions
              </TableHead>

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

                <TableCell>
                  {result.studentName}
                </TableCell>

                <TableCell>
                  {result.rollNo}
                </TableCell>

                <TableCell>
                  {result.year}
                </TableCell>

                <TableCell>
                  {result.stream}
                </TableCell>

                <TableCell>
                  {result.section}
                </TableCell>

                <TableCell>
                  {result.percentage}%
                </TableCell>

                <TableCell>

                  <div className="flex gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleEdit(result)
                      }
                    >

                      <Edit2 className="w-4 h-4" />

                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleDelete(
                          result._id
                        )
                      }
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

      <Dialog
        open={openDialog}
        onOpenChange={setOpenDialog}
      >

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">

          <DialogHeader>

            <DialogTitle>

              {editingId
                ? 'Edit Result'
                : 'Add Result'}

            </DialogTitle>

          </DialogHeader>


          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >


            {/* BASIC */}

            <div className="grid grid-cols-2 gap-4">


              <div>

                <Label>
                  Student Image
                </Label>

                <Input
                  type="file"
                  name="studentImage"
                  accept="image/*"
                  onChange={handleChange}
                />

              </div>


              <div>

                <Label>
                  Student Name
                </Label>

                <Input
                  name="studentName"
                  value={
                    formData.studentName
                  }
                  onChange={handleChange}
                />

              </div>


              <div>

                <Label>
                  Roll No
                </Label>

                <Input
                  type="number"
                  name="rollNo"
                  value={
                    formData.rollNo
                  }
                  onChange={handleChange}
                />

              </div>


              <div>

                <Label>
                  Year
                </Label>

                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >

                  {YEARS.map((year) => (

                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>

                  ))}

                </select>

              </div>


              <div>

                <Label>
                  Stream
                </Label>

                <select
                  name="stream"
                  value={
                    formData.stream
                  }
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >

                  <option value="Science">
                    Science
                  </option>

                  <option value="Commerce">
                    Commerce
                  </option>

                </select>

              </div>


              <div>

                <Label>
                  Section
                </Label>

                <select
                  name="section"
                  value={
                    formData.section
                  }
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >

                  {formData.stream ===
                  'Science' ? (
                    <>
                      <option value="PCMB">
                        PCMB
                      </option>

                      <option value="PCMC">
                        PCMC
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="SEBA">
                        SEBA
                      </option>

                      <option value="CEBA">
                        CEBA
                      </option>
                    </>
                  )}

                </select>

              </div>

            </div>


            {/* SUBJECTS */}

            <div>

              <h2 className="font-bold mb-4">

                Subjects

              </h2>


              <div className="border rounded-lg overflow-hidden">

                <Table>

                  <TableHeader>

                    <TableRow>

                      <TableHead>
                        Subject
                      </TableHead>

                      <TableHead>
                        Theory
                      </TableHead>

                      <TableHead>
                        Practical
                      </TableHead>

                    </TableRow>

                  </TableHeader>


                  <TableBody>

                    {Object.keys(
                      formData.subjects
                    ).map((subject) => (

                      <TableRow key={subject}>

                        <TableCell>
                          {subject}
                        </TableCell>

                        <TableCell>

                          <Input
                            type="number"
                            value={
                              formData
                                .subjects[
                                  subject
                                ]
                                ?.theory || 0
                            }
                            onChange={(e) =>
                              handleSubjectChange(
                                subject,
                                'theory',
                                e.target.value
                              )
                            }
                          />

                        </TableCell>

                        <TableCell>

                          <Input
                            type="number"
                            value={
                              formData
                                .subjects[
                                  subject
                                ]
                                ?.practical || 0
                            }
                            onChange={(e) =>
                              handleSubjectChange(
                                subject,
                                'practical',
                                e.target.value
                              )
                            }
                          />

                        </TableCell>

                      </TableRow>

                    ))}

                  </TableBody>

                </Table>

              </div>

            </div>


            {/* BUTTONS */}

            <div className="flex justify-end gap-3">

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setOpenDialog(false)
                }
              >

                Cancel

              </Button>

              <Button
                type="submit"
              >

                {loading
                  ? 'Saving...'
                  : 'Save'}

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