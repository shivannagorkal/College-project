import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { topperService } from '@/services/topperService';
import { YEARS } from '@/utils/constants';

const defaultFormData = {
  topperType: 'Board',
  name: '',
  rank: '',
  year: YEARS[0],
  stream: 'Science',
  group: 'PCMB',
  percentage: '',
  score: '',
  outOf: '',
  percentile: '',
  karnatakaRank: '',
};

const getDefaultOutOf = (topperType) => {
  if (topperType === 'NEET') return '720';
  if (topperType === 'JEE') return '300';
  if (topperType === 'KCET') return '120';
  return '';
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const PhotoCell = ({ topper }) => (
  topper.photo ? (
    <img src={topper.photo} alt={topper.name} className="w-10 h-10 rounded-full object-cover" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
      {getInitials(topper.name)}
    </div>
  )
);

export function ManageToppers() {
  const [toppers, setToppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    fetchToppers();
  }, []);

  useEffect(() => {
    setFormData((prev) => {
      if (prev.topperType === 'Board') {
        return {
          ...prev,
          stream: prev.stream || 'Science',
          group: prev.stream === 'Science' ? (prev.group || 'PCMB') : 'Commerce',
          outOf: '',
        };
      }

      return {
        ...prev,
        stream: '',
        group: '',
        percentage: '',
        outOf: getDefaultOutOf(prev.topperType),
      };
    });
  }, [formData.topperType]);

  useEffect(() => {
    if (formData.topperType !== 'Board') {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      group: prev.stream === 'Science' ? (prev.group === 'Commerce' ? 'PCMB' : prev.group || 'PCMB') : 'Commerce',
    }));
  }, [formData.stream, formData.topperType]);

  const fetchToppers = async () => {
    try {
      setLoading(true);
      const data = await topperService.getToppers();
      setToppers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load toppers');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingId(null);
    setPhotoFile(null);
  };

  const handleOpen = (topper = null, type = 'Board') => {
    if (topper) {
      setFormData({
        topperType: topper.topperType || 'Board',
        name: topper.name || '',
        rank: topper.rank || '',
        year: topper.year || YEARS[0],
        stream: topper.stream || 'Science',
        group: topper.group || ((topper.stream || 'Science') === 'Science' ? 'PCMB' : 'Commerce'),
        percentage: topper.percentage || '',
        score: topper.score || '',
        outOf: topper.outOf || getDefaultOutOf(topper.topperType),
        percentile: topper.percentile || '',
        karnatakaRank: topper.karnatakaRank || '',
      });
      setEditingId(topper._id || topper.id);
      setPhotoFile(null);
    } else {
      setFormData({
        ...defaultFormData,
        topperType: type,
        outOf: getDefaultOutOf(type),
        stream: type === 'Board' ? 'Science' : '',
        group: type === 'Board' ? 'PCMB' : '',
      });
      setEditingId(null);
      setPhotoFile(null);
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const buildFormDataPayload = () => {
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('topperType', formData.topperType);
    fd.append('rank', formData.rank);
    fd.append('year', formData.year);
    fd.append('stream', formData.stream || '');
    fd.append('group', formData.group || '');
    fd.append('percentage', formData.percentage || '');
    fd.append('score', formData.score || '');
    fd.append('outOf', formData.outOf || '');
    fd.append('percentile', formData.percentile || '');
    fd.append('karnatakaRank', formData.karnatakaRank || '');
    if (photoFile) fd.append('photo', photoFile);
    return fd;
  };

  const handleSave = async () => {
    if (!formData.name || !formData.rank || !formData.year) return;

    try {
      const fd = buildFormDataPayload();

      if (editingId) {
        await topperService.updateTopper(editingId, fd);
        toast.success('Topper updated successfully');
      } else {
        await topperService.createTopper(fd);
        toast.success('Topper added successfully');
      }

      handleClose();
      fetchToppers();
    } catch (error) {
      toast.error('Failed to save topper');
    }
  };

  const handleDelete = async (id) => {
    try {
      await topperService.deleteTopper(id);
      toast.success('Topper deleted');
      fetchToppers();
    } catch (error) {
      toast.error('Failed to delete topper');
    }
  };

  const boardToppers = toppers.filter((topper) => topper.topperType === 'Board');
  const neetToppers = toppers.filter((topper) => topper.topperType === 'NEET');
  const jeeToppers = toppers.filter((topper) => topper.topperType === 'JEE');
  const kcetToppers = toppers.filter((topper) => topper.topperType === 'KCET');

  const renderActions = (topper) => (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="outline" onClick={() => handleOpen(topper)}>
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleDelete(topper._id || topper.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderBoardTable = (data) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Photo</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Stream</TableHead>
          <TableHead>Group</TableHead>
          <TableHead>Percentage</TableHead>
          <TableHead>Rank</TableHead>
          <TableHead>Year</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((topper) => (
          <TableRow key={topper._id || topper.id}>
            <TableCell><PhotoCell topper={topper} /></TableCell>
            <TableCell className="font-medium">{topper.name}</TableCell>
            <TableCell>{topper.stream}</TableCell>
            <TableCell>{topper.group}</TableCell>
            <TableCell>{topper.percentage}%</TableCell>
            <TableCell>#{topper.rank}</TableCell>
            <TableCell>{topper.year}</TableCell>
            <TableCell className="text-right">{renderActions(topper)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderScoreTable = (data, type) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Photo</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Score</TableHead>
          {type === 'KCET' ? (
            <TableHead>Karnataka Rank</TableHead>
          ) : (
            <TableHead>Percentile</TableHead>
          )}
          <TableHead>Rank</TableHead>
          <TableHead>Year</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((topper) => (
          <TableRow key={topper._id || topper.id}>
            <TableCell><PhotoCell topper={topper} /></TableCell>
            <TableCell className="font-medium">{topper.name}</TableCell>
            <TableCell>{topper.score}/{topper.outOf}</TableCell>
            {type === 'KCET' ? (
              <TableCell>{topper.karnatakaRank ? `#${topper.karnatakaRank}` : '-'}</TableCell>
            ) : (
              <TableCell>{topper.percentile || '-'}</TableCell>
            )}
            <TableCell>#{topper.rank}</TableCell>
            <TableCell>{topper.year}</TableCell>
            <TableCell className="text-right">{renderActions(topper)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderTableCard = (content) => (
    <Card>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">{content}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Toppers</h1>
          <Button onClick={() => handleOpen(null, 'Board')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Topper
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <Tabs defaultValue="Board" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="Board">Board</TabsTrigger>
              <TabsTrigger value="NEET">NEET</TabsTrigger>
              <TabsTrigger value="JEE">JEE</TabsTrigger>
              <TabsTrigger value="KCET">KCET</TabsTrigger>
            </TabsList>

            <TabsContent value="Board" className="mt-6">
              {renderTableCard(renderBoardTable(boardToppers))}
            </TabsContent>

            <TabsContent value="NEET" className="mt-6">
              {renderTableCard(renderScoreTable(neetToppers, 'NEET'))}
            </TabsContent>

            <TabsContent value="JEE" className="mt-6">
              {renderTableCard(renderScoreTable(jeeToppers, 'JEE'))}
            </TabsContent>

            <TabsContent value="KCET" className="mt-6">
              {renderTableCard(renderScoreTable(kcetToppers, 'KCET'))}
            </TabsContent>
          </Tabs>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Topper' : 'Add New Topper'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Topper Type</label>
                <Select
                  value={formData.topperType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      topperType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Board">Board</SelectItem>
                    <SelectItem value="NEET">NEET</SelectItem>
                    <SelectItem value="JEE">JEE</SelectItem>
                    <SelectItem value="KCET">KCET</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Student name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rank</label>
                  <Input
                    type="number"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <Select
                    value={formData.year.toString()}
                    onValueChange={(value) => setFormData({ ...formData, year: Number(value) })}
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Photo</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                />
              </div>

              {formData.topperType === 'Board' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Stream</label>
                      <Select
                        value={formData.stream}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            stream: value,
                            group: value === 'Science' ? 'PCMB' : 'Commerce',
                          })
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
                        <label className="block text-sm font-medium mb-1">Group</label>
                        <Select
                          value={formData.group}
                          onValueChange={(value) =>
                            setFormData({ ...formData, group: value })
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

                  <div>
                    <label className="block text-sm font-medium mb-1">Percentage</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.percentage}
                      onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                      placeholder="98.5"
                    />
                  </div>
                </>
              )}

              {['NEET', 'JEE', 'KCET'].includes(formData.topperType) && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Score</label>
                      <Input
                        type="number"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                        placeholder="650"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Out Of</label>
                      <Input
                        type="number"
                        value={formData.outOf}
                        onChange={(e) => setFormData({ ...formData, outOf: e.target.value })}
                        placeholder={getDefaultOutOf(formData.topperType)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Percentile</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.percentile}
                        onChange={(e) => setFormData({ ...formData, percentile: e.target.value })}
                        placeholder="99.5"
                      />
                    </div>

                    {formData.topperType === 'KCET' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Karnataka Rank</label>
                        <Input
                          type="number"
                          value={formData.karnatakaRank}
                          onChange={(e) => setFormData({ ...formData, karnatakaRank: e.target.value })}
                          placeholder="12"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
