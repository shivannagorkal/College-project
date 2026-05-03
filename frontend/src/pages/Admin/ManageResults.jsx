import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { resultService } from '@/services/resultService';

const PCMB = ['Kannada', 'English', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];
const PCMC = ['Kannada', 'English', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science'];
const COMMERCE = ['Kannada', 'English', 'Business Studies', 'Accountancy', 'Economics', 'Statistics'];

const getSubjects = (stream, group, existingSubjects = []) => {
  let list = [];

  if (stream === 'Science') {
    list = group === 'PCMB' ? PCMB : PCMC;
  } else {
    list = COMMERCE;
  }

  return list.map((subject) => {
    const existing = existingSubjects.find((item) => item.subject === subject);

    return {
      subject,
      totalOutOf: existing?.totalOutOf ?? '',
      highestScore: existing?.highestScore ?? '',
      passPercentage: existing?.passPercentage ?? '',
      avgMarks: existing?.avgMarks ?? '',
    };
  });
};

const defaultBoardForm = () => ({
  year: new Date().getFullYear(),
  stream: 'Science',
  className: 'PCMB',
  totalStudents: '',
  passedStudents: '',
  passPercentage: '',
  firstClass: '',
  distinction: '',
  totalAppeared: '',
  totalQualified: '',
  topScore: '',
  topperName: '',
  description: '',
});

const defaultCompetitiveForm = () => ({
  year: new Date().getFullYear(),
  stream: 'Science',
  className: '',
  totalStudents: '',
  passedStudents: '',
  passPercentage: '',
  firstClass: '',
  distinction: '',
  totalAppeared: '',
  totalQualified: '',
  topScore: '',
  topperName: '',
  description: '',
});

const ManageResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [resultType, setResultType] = useState('Board');
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState(defaultBoardForm());

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await resultService.getResults();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch results');
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (resultType !== 'Board') {
      return;
    }

    setSubjects((prevSubjects) => getSubjects(formData.stream, formData.className, prevSubjects));
  }, [formData.stream, formData.className, resultType]);

  useEffect(() => {
    if (resultType !== 'Board') {
      return;
    }

    const totalStudents = Number(formData.totalStudents) || 0;
    const passedStudents = Number(formData.passedStudents) || 0;
    const nextPassPercentage = totalStudents
      ? Math.round((passedStudents / totalStudents) * 100).toString()
      : '0';

    setFormData((prev) => (
      prev.passPercentage === nextPassPercentage
        ? prev
        : { ...prev, passPercentage: nextPassPercentage }
    ));
  }, [formData.totalStudents, formData.passedStudents, resultType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    setSubjects((prev) =>
      prev.map((subject, subjectIndex) =>
        subjectIndex === index ? { ...subject, [field]: value } : subject
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const submitData = {
        ...formData,
        className: formData.stream === 'Commerce' ? 'Commerce' : formData.className,
        resultType,
        subjects: resultType === 'Board' ? subjects : undefined,
      };

      if (editingId) {
        await resultService.updateResult(editingId, submitData);
        toast.success('Result updated successfully');
      } else {
        await resultService.createResult(submitData);
        toast.success('Result created successfully');
      }

      await fetchResults();
      handleCloseDialog();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save result';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResult = (type) => {
    setResultType(type);
    setEditingId(null);
    setSuccessMessage('');
    setError('');

    if (type === 'Board') {
      const nextForm = defaultBoardForm();
      setFormData(nextForm);
      setSubjects(getSubjects(nextForm.stream, nextForm.className));
    } else {
      setFormData(defaultCompetitiveForm());
      setSubjects([]);
    }

    setOpenDialog(true);
  };

  const handleEditResult = (result) => {
    setEditingId(result._id);
    setResultType(result.resultType);

    if (result.resultType === 'Board') {
      const nextStream = result.stream || 'Science';
      const nextClassName = result.className || (nextStream === 'Commerce' ? 'Commerce' : 'PCMB');
      setFormData({
        year: result.year,
        stream: nextStream,
        className: nextClassName,
        totalStudents: result.totalStudents || '',
        passedStudents: result.passedStudents || '',
        passPercentage: result.passPercentage || '',
        firstClass: result.firstClass || '',
        distinction: result.distinction || '',
        totalAppeared: '',
        totalQualified: '',
        topScore: '',
        topperName: '',
        description: '',
      });
      setSubjects(getSubjects(nextStream, nextClassName, result.subjects || []));
    } else {
      setFormData({
        year: result.year,
        stream: result.stream || 'Science',
        className: result.className || '',
        totalStudents: '',
        passedStudents: '',
        passPercentage: '',
        firstClass: '',
        distinction: '',
        totalAppeared: result.totalAppeared || '',
        totalQualified: result.totalQualified || '',
        topScore: result.topScore || '',
        topperName: result.topperName || '',
        description: result.description || '',
      });
      setSubjects([]);
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setSubjects([]);
  };

  const handleDeleteResult = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await resultService.deleteResult(id);
        toast.success('Result deleted successfully');
        await fetchResults();
      } catch (err) {
        toast.error('Failed to delete result');
      }
    }
  };

  const boardResults = results.filter((r) => r.resultType === 'Board');
  const neetResults = results.filter((r) => r.resultType === 'NEET');
  const jeeResults = results.filter((r) => r.resultType === 'JEE');
  const kcetResults = results.filter((r) => r.resultType === 'KCET');

  const ResultTable = ({ data, type, onEdit, onDelete }) => (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            {type === 'Board' && (
              <>
                <TableHead>Stream</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Passed</TableHead>
                <TableHead>Pass%</TableHead>
              </>
            )}
            {type !== 'Board' && (
              <>
                <TableHead>Appeared</TableHead>
                <TableHead>Qualified</TableHead>
                <TableHead>Qualified %</TableHead>
                <TableHead>Top Score</TableHead>
              </>
            )}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan="7" className="text-center text-gray-500 py-4">
                No results available
              </TableCell>
            </TableRow>
          ) : (
            data.map((result) => (
              <TableRow key={result._id}>
                <TableCell>{result.year}</TableCell>
                {type === 'Board' && (
                  <>
                    <TableCell>{result.stream}</TableCell>
                    <TableCell>{result.className}</TableCell>
                    <TableCell>{result.totalStudents}</TableCell>
                    <TableCell>{result.passedStudents}</TableCell>
                    <TableCell>{result.passPercentage}%</TableCell>
                  </>
                )}
                {type !== 'Board' && (
                  <>
                    <TableCell>{result.totalAppeared}</TableCell>
                    <TableCell>{result.totalQualified}</TableCell>
                    <TableCell>{result.qualifiedPercentage}%</TableCell>
                    <TableCell>{result.topScore}</TableCell>
                  </>
                )}
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(result)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(result._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Manage Results</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="board" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="board">Board Results</TabsTrigger>
          <TabsTrigger value="neet">NEET</TabsTrigger>
          <TabsTrigger value="jee">JEE</TabsTrigger>
          <TabsTrigger value="kcet">KCET</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Board Results</h2>
            <Button onClick={() => handleAddResult('Board')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </Button>
          </div>
          <ResultTable
            data={boardResults}
            type="Board"
            onEdit={handleEditResult}
            onDelete={handleDeleteResult}
          />
        </TabsContent>

        <TabsContent value="neet" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">NEET Results</h2>
            <Button onClick={() => handleAddResult('NEET')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </Button>
          </div>
          <ResultTable
            data={neetResults}
            type="NEET"
            onEdit={handleEditResult}
            onDelete={handleDeleteResult}
          />
        </TabsContent>

        <TabsContent value="jee" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">JEE Results</h2>
            <Button onClick={() => handleAddResult('JEE')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </Button>
          </div>
          <ResultTable
            data={jeeResults}
            type="JEE"
            onEdit={handleEditResult}
            onDelete={handleDeleteResult}
          />
        </TabsContent>

        <TabsContent value="kcet" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">KCET Results</h2>
            <Button onClick={() => handleAddResult('KCET')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </Button>
          </div>
          <ResultTable
            data={kcetResults}
            type="KCET"
            onEdit={handleEditResult}
            onDelete={handleDeleteResult}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Result' : 'Add New Result'} ({resultType})
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {resultType === 'Board' && (
              <>
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Overall Result</Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stream">Stream</Label>
                      <Select
                        value={formData.stream}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            stream: value,
                            className: value === 'Science' ? 'PCMB' : 'Commerce',
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Commerce">Commerce</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.stream === 'Science' && (
                      <div>
                        <Label htmlFor="scienceGroup">Group</Label>
                        <Select
                          value={formData.className}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, className: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PCMB">PCMB</SelectItem>
                            <SelectItem value="PCMC">PCMC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="className">Class Name</Label>
                      <Input id="className" name="className" value={formData.className} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="passPercentage">Pass %</Label>
                      <Input
                        id="passPercentage"
                        name="passPercentage"
                        type="number"
                        value={formData.passPercentage}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="totalStudents">Total Students</Label>
                      <Input
                        id="totalStudents"
                        name="totalStudents"
                        type="number"
                        value={formData.totalStudents}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="passedStudents">Passed Students</Label>
                      <Input
                        id="passedStudents"
                        name="passedStudents"
                        type="number"
                        value={formData.passedStudents}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstClass">First Class Students</Label>
                      <Input
                        id="firstClass"
                        name="firstClass"
                        type="number"
                        value={formData.firstClass}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="distinction">Distinction Students</Label>
                      <Input
                        id="distinction"
                        name="distinction"
                        type="number"
                        value={formData.distinction}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Subject Wise</Label>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Total Out Of</TableHead>
                          <TableHead>Highest Score</TableHead>
                          <TableHead>Pass %</TableHead>
                          <TableHead>Avg Marks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjects.map((subject, index) => (
                          <TableRow key={subject.subject}>
                            <TableCell className="font-medium">{subject.subject}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={subject.totalOutOf}
                                onChange={(e) =>
                                  handleSubjectChange(index, 'totalOutOf', e.target.value)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={subject.highestScore}
                                onChange={(e) =>
                                  handleSubjectChange(index, 'highestScore', e.target.value)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={subject.passPercentage}
                                onChange={(e) =>
                                  handleSubjectChange(index, 'passPercentage', e.target.value)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                value={subject.avgMarks}
                                onChange={(e) =>
                                  handleSubjectChange(index, 'avgMarks', e.target.value)
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}

            {['NEET', 'JEE', 'KCET'].includes(resultType) && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalAppeared">Total Appeared</Label>
                    <Input
                      id="totalAppeared"
                      name="totalAppeared"
                      type="number"
                      value={formData.totalAppeared}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalQualified">Total Qualified</Label>
                    <Input
                      id="totalQualified"
                      name="totalQualified"
                      type="number"
                      value={formData.totalQualified}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="topScore">Top Score</Label>
                    <Input
                      id="topScore"
                      name="topScore"
                      type="number"
                      step="0.01"
                      value={formData.topScore}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="topperName">Topper Name</Label>
                    <Input
                      id="topperName"
                      name="topperName"
                      value={formData.topperName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add any additional information..."
                    rows="4"
                  />
                </div>
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Result' : 'Create Result'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageResults;

export { ManageResults };
