import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { boardResultService } from '@/services/boardResultService';
import { competitiveResultService } from '@/services/competitiveResultService';

const YEARS = Array.from({ length: 20 }, (_, i) =>
  new Date().getFullYear() - i
);

const PCMB = ['Kannada', 'English', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];
const PCMC = ['Kannada', 'English', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science'];
const COMMERCE = ['Kannada', 'English', 'Business Studies', 'Accountancy', 'Economics', 'Statistics'];

const getSubjects = (stream, group) => {
  let list = [];
  if (stream === 'Science') {
    list = group === 'PCMB' ? PCMB : PCMC;
  } else {
    list = COMMERCE;
  }
  return list.map((subject) => ({
    subject,
    totalOutOf: 100,
    highestScore: 0,
    passPercentage: 0,
  }));
};

const ManageResults = () => {
  const [boardResults, setBoardResults] = useState([]);
  const [competitiveResults, setCompetitiveResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('board');
  const [subjects, setSubjects] = useState([]);

  const [boardFormData, setBoardFormData] = useState({
    year: new Date().getFullYear(),
    stream: 'Science',
    className: 'PCMB',
    highestPercentageInStream: '',
    totalStudents: '',
    passedStudents: '',
    firstClass: '',
    distinction: '',
    subjects: [],
  });

  const [competitiveFormData, setCompetitiveFormData] = useState({
    year: new Date().getFullYear(),
    resultType: 'NEET',
    totalAppeared: '',
    totalQualified: '',
    highestScore: '',
    description: '',
  });

  const fetchBoardResults = async () => {
    try {
      setLoading(true);
      const data = await boardResultService.getBoardResults();
      setBoardResults(data);
    } catch (error) {
      console.error('Error fetching board results:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitiveResults = async () => {
    try {
      setLoading(true);
      const data = await competitiveResultService.getCompetitiveResults();
      setCompetitiveResults(data);
    } catch (error) {
      console.error('Error fetching competitive results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'board') {
      fetchBoardResults();
    } else {
      fetchCompetitiveResults();
    }
  }, [activeTab]);

  useEffect(() => {
    const newSubjects = getSubjects(boardFormData.stream, boardFormData.className);
    setSubjects(newSubjects);
    setBoardFormData(prev => ({ ...prev, subjects: newSubjects }));
  }, [boardFormData.stream, boardFormData.className]);

  const handleBoardInputChange = (e) => {
    const { name, value } = e.target;
    setBoardFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompetitiveInputChange = (e) => {
    const { name, value } = e.target;
    setCompetitiveFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
    setBoardFormData(prev => ({ ...prev, subjects: newSubjects }));
  };

  const handleBoardSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        ...boardFormData,
        year: Number(boardFormData.year),
        totalStudents: Number(boardFormData.totalStudents || 0),
        passedStudents: Number(boardFormData.passedStudents || 0),
        firstClass: Number(boardFormData.firstClass || 0),
        distinction: Number(boardFormData.distinction || 0),
        highestPercentageInStream: Number(boardFormData.highestPercentageInStream || 0),
        subjects: JSON.stringify(boardFormData.subjects),
      };

      if (editingId) {
        await boardResultService.updateBoardResult(editingId, data);
      } else {
        await boardResultService.createBoardResult(data);
      }
      setSuccessMessage('Board result saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setOpenDialog(false);
      resetBoardForm();
      fetchBoardResults();
    } catch (error) {
      console.error('Error saving board result:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitiveSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        ...competitiveFormData,
        year: Number(competitiveFormData.year),
        totalAppeared: Number(competitiveFormData.totalAppeared || 0),
        totalQualified: Number(competitiveFormData.totalQualified || 0),
        highestScore: Number(competitiveFormData.highestScore || 0),
      };

      if (editingId) {
        await competitiveResultService.updateCompetitiveResult(editingId, data);
      } else {
        await competitiveResultService.createCompetitiveResult(data);
      }
      setSuccessMessage('Result saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setOpenDialog(false);
      resetCompetitiveForm();
      fetchCompetitiveResults();
    } catch (error) {
      console.error('Error saving competitive result:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetBoardForm = () => {
    setBoardFormData({
      year: new Date().getFullYear(),
      stream: 'Science',
      className: 'PCMB',
      highestPercentageInStream: '',
      totalStudents: '',
      passedStudents: '',
      firstClass: '',
      distinction: '',
      subjects: getSubjects('Science', 'PCMB'),
    });
    setEditingId(null);
  };

  const resetCompetitiveForm = () => {
    setCompetitiveFormData({
      year: new Date().getFullYear(),
      resultType: 'NEET',
      totalAppeared: '',
      totalQualified: '',
      highestScore: '',
      description: '',
    });
    setEditingId(null);
  };

  const handleAddBoardResult = () => {
    resetBoardForm();
    setEditingId(null);
    setOpenDialog(true);
  };

  const handleAddCompetitiveResult = (type) => {
    resetCompetitiveForm();
    setCompetitiveFormData(prev => ({ ...prev, resultType: type }));
    setEditingId(null);
    setOpenDialog(true);
  };

  const handleEditBoardResult = (result) => {
    setBoardFormData({
      year: result.year,
      stream: result.stream,
      className: result.className,
      highestPercentageInStream: result.highestPercentageInStream,
      totalStudents: result.totalStudents,
      passedStudents: result.passedStudents,
      firstClass: result.firstClass,
      distinction: result.distinction,
      subjects: result.subjects || [],
    });
    setSubjects(result.subjects || []);
    setEditingId(result._id);
    setOpenDialog(true);
  };

  const handleEditCompetitiveResult = (result) => {
    setCompetitiveFormData({
      year: result.year,
      resultType: result.resultType,
      totalAppeared: result.totalAppeared,
      totalQualified: result.totalQualified,
      highestScore: result.highestScore,
      description: result.description,
    });
    setEditingId(result._id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleDeleteBoardResult = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await boardResultService.deleteBoardResult(id);
        setSuccessMessage('Result deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchBoardResults();
      } catch (error) {
        console.error('Error deleting result:', error);
      }
    }
  };

  const handleDeleteCompetitiveResult = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await competitiveResultService.deleteCompetitiveResult(id);
        setSuccessMessage('Result deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCompetitiveResults();
      } catch (error) {
        console.error('Error deleting result:', error);
      }
    }
  };

  const BoardResultTable = ({ data }) => (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Stream</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Total Students</TableHead>
            <TableHead>Passed</TableHead>
            <TableHead>Pass %</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan="7" className="text-center text-gray-500 py-4">
                No board results available
              </TableCell>
            </TableRow>
          ) : (
            data.map((result) => (
              <TableRow key={result._id}>
                <TableCell>{result.year}</TableCell>
                <TableCell>{result.stream}</TableCell>
                <TableCell>{result.className}</TableCell>
                <TableCell>{result.totalStudents}</TableCell>
                <TableCell>{result.passedStudents}</TableCell>
                <TableCell>{result.passPercentage}%</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBoardResult(result)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBoardResult(result._id)}
                    >
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

  const CompetitiveResultTable = ({ data, type }) => (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Total Appeared</TableHead>
            <TableHead>Qualified</TableHead>
            <TableHead>Qualified %</TableHead>
            <TableHead>Highest Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan="6" className="text-center text-gray-500 py-4">
                No {type} results available
              </TableCell>
            </TableRow>
          ) : (
            data.map((result) => (
              <TableRow key={result._id}>
                <TableCell>{result.year}</TableCell>
                <TableCell>{result.totalAppeared}</TableCell>
                <TableCell>{result.totalQualified}</TableCell>
                <TableCell>{result.qualifiedPercentage}%</TableCell>
                <TableCell>{result.highestScore}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCompetitiveResult(result)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCompetitiveResult(result._id)}
                    >
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
    <div className="space-y-6">
      {successMessage && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-green-600">{successMessage}</p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="board">Board Results</TabsTrigger>
          <TabsTrigger value="neet">NEET</TabsTrigger>
          <TabsTrigger value="jee">JEE</TabsTrigger>
          <TabsTrigger value="kcet">KCET</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-6 space-y-4">
          <Button onClick={handleAddBoardResult} className="mb-4">
            <Plus className="w-4 h-4 mr-2" /> Add Board Result
          </Button>
          <BoardResultTable data={boardResults} />
        </TabsContent>

        <TabsContent value="neet" className="mt-6 space-y-4">
          <Button onClick={() => handleAddCompetitiveResult('NEET')} className="mb-4">
            <Plus className="w-4 h-4 mr-2" /> Add NEET Result
          </Button>
          <CompetitiveResultTable
            data={competitiveResults.filter(r => r.resultType === 'NEET')}
            type="NEET"
          />
        </TabsContent>

        <TabsContent value="jee" className="mt-6 space-y-4">
          <Button onClick={() => handleAddCompetitiveResult('JEE')} className="mb-4">
            <Plus className="w-4 h-4 mr-2" /> Add JEE Result
          </Button>
          <CompetitiveResultTable
            data={competitiveResults.filter(r => r.resultType === 'JEE')}
            type="JEE"
          />
        </TabsContent>

        <TabsContent value="kcet" className="mt-6 space-y-4">
          <Button onClick={() => handleAddCompetitiveResult('KCET')} className="mb-4">
            <Plus className="w-4 h-4 mr-2" /> Add KCET Result
          </Button>
          <CompetitiveResultTable
            data={competitiveResults.filter(r => r.resultType === 'KCET')}
            type="KCET"
          />
        </TabsContent>
      </Tabs>

      {/* Board Result Dialog */}
      <Dialog open={openDialog && activeTab === 'board'} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Board Result' : 'Add Board Result'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBoardSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Year</Label>
                <Select
                  value={boardFormData.year.toString()}
                  onValueChange={(value) =>
                    setBoardFormData(prev => ({ ...prev, year: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Stream</Label>
                <Select
                  value={boardFormData.stream}
                  onValueChange={(value) =>
                    setBoardFormData(prev => ({
                      ...prev,
                      stream: value,
                      className: value === 'Commerce' ? 'Commerce' : 'PCMB',
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
              {boardFormData.stream === 'Science' && (
                <div>
                  <Label>Group</Label>
                  <Select
                    value={boardFormData.className}
                    onValueChange={(value) =>
                      setBoardFormData(prev => ({ ...prev, className: value }))
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
              <div>
                <Label>Highest % in Stream</Label>
                <Input
                  type="number"
                  step="0.1"
                  name="highestPercentageInStream"
                  value={boardFormData.highestPercentageInStream}
                  onChange={handleBoardInputChange}
                />
              </div>
              <div>
                <Label>Total Students</Label>
                <Input
                  type="number"
                  name="totalStudents"
                  value={boardFormData.totalStudents}
                  onChange={handleBoardInputChange}
                />
              </div>
              <div>
                <Label>Passed Students</Label>
                <Input
                  type="number"
                  name="passedStudents"
                  value={boardFormData.passedStudents}
                  onChange={handleBoardInputChange}
                />
              </div>
              <div>
                <Label>First Class Students</Label>
                <Input
                  type="number"
                  name="firstClass"
                  value={boardFormData.firstClass}
                  onChange={handleBoardInputChange}
                />
              </div>
              <div>
                <Label>Distinction Students</Label>
                <Input
                  type="number"
                  name="distinction"
                  value={boardFormData.distinction}
                  onChange={handleBoardInputChange}
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Subject wise Performance</h3>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Total Out Of</TableHead>
                      <TableHead>Highest Score</TableHead>
                      <TableHead>Pass %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((sub, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{sub.subject}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={sub.totalOutOf}
                            onChange={(e) =>
                              handleSubjectChange(index, 'totalOutOf', e.target.value)
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={sub.highestScore}
                            onChange={(e) =>
                              handleSubjectChange(index, 'highestScore', e.target.value)
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={sub.passPercentage}
                            onChange={(e) =>
                              handleSubjectChange(index, 'passPercentage', e.target.value)
                            }
                            className="w-20"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Competitive Result Dialog */}
      <Dialog
        open={openDialog && activeTab !== 'board'}
        onOpenChange={handleCloseDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Result' : 'Add Result'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCompetitiveSubmit} className="space-y-4">
            <div>
              <Label>Year</Label>
              <Select
                value={competitiveFormData.year.toString()}
                onValueChange={(value) =>
                  setCompetitiveFormData(prev => ({ ...prev, year: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Total Appeared</Label>
              <Input
                type="number"
                name="totalAppeared"
                value={competitiveFormData.totalAppeared}
                onChange={handleCompetitiveInputChange}
              />
            </div>
            <div>
              <Label>Total Qualified</Label>
              <Input
                type="number"
                name="totalQualified"
                value={competitiveFormData.totalQualified}
                onChange={handleCompetitiveInputChange}
              />
            </div>
            <div>
              <Label>Highest Score</Label>
              <Input
                type="number"
                name="highestScore"
                value={competitiveFormData.highestScore}
                onChange={handleCompetitiveInputChange}
              />
            </div>
            <div>
              <Label>Description (Optional)</Label>
              <Input
                type="text"
                name="description"
                value={competitiveFormData.description}
                onChange={handleCompetitiveInputChange}
                placeholder="Add any additional information"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageResults;
export { ManageResults };
