import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { resultService } from '@/services/resultService';
import { YEARS } from '@/utils/constants';

export function Results() {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await resultService.getResults();
        setAllResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const yearResults = allResults.filter((r) => r.year.toString() === selectedYear);
  const boardResults = yearResults.filter((r) => r.resultType === 'Board');
  const neetResults = yearResults.filter((r) => r.resultType === 'NEET');
  const jeeResults = yearResults.filter((r) => r.resultType === 'JEE');
  const kcetResults = yearResults.filter((r) => r.resultType === 'KCET');

  const availableYears = Array.from(
    new Set(allResults.map((r) => r.year.toString()))
  ).sort().reverse();

  const CompetitiveExamCard = ({ result }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{result.year}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Total Appeared</p>
            <p className="text-2xl font-bold text-primary">{result.totalAppeared}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Total Qualified</p>
            <p className="text-2xl font-bold text-primary">{result.totalQualified}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <p className="text-sm text-gray-600">Qualified %</p>
            <p className="text-2xl font-bold text-primary">{result.qualifiedPercentage}%</p>
          </div>
          <div className="bg-orange-50 p-4 rounded">
            <p className="text-sm text-gray-600">Top Score</p>
            <p className="text-2xl font-bold text-primary">{result.topScore}</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded">
            <p className="text-sm text-gray-600">Topper</p>
            <p className="text-sm font-bold text-primary">{result.topperName || 'N/A'}</p>
          </div>
        </div>
        {result.description && (
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-700">{result.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="Results" subtitle="View examination results by year and type" />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex gap-4 items-center">
            <label className="font-semibold">Select Year:</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.length > 0 ? (
                  availableYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))
                ) : (
                  YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading results...</p>
            </div>
          ) : error ? (
            <Card className="bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">Error loading results. Please try again.</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="board" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="board">Board Results</TabsTrigger>
                <TabsTrigger value="neet">NEET</TabsTrigger>
                <TabsTrigger value="jee">JEE</TabsTrigger>
                <TabsTrigger value="kcet">KCET</TabsTrigger>
              </TabsList>

              <TabsContent value="board" className="mt-6">
                {boardResults.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No board results for {selectedYear}
                  </p>
                ) : (
                  <div>
                    {boardResults.map((result, index) => (
                      <div key={result._id}>
                        <h3 className="text-lg font-bold mb-3">
                          {result.stream === 'Science'
                            ? `🔬 Science Stream - ${result.className}`
                            : '📊 Commerce Stream'}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-sm text-gray-600">Total Students</p>
                            <p className="text-3xl font-bold text-primary">{result.totalStudents}</p>
                          </div>
                          <div className="bg-green-50 rounded-xl p-4">
                            <p className="text-sm text-gray-600">College Result</p>
                            <p className="text-3xl font-bold text-primary">{result.passPercentage}%</p>
                          </div>
                          <div className="bg-orange-50 rounded-xl p-4">
                            <p className="text-sm text-gray-600">Highest Score</p>
                            <p className="text-3xl font-bold text-primary">
                              {Math.max(...(result.subjects || []).map((s) => s.highestScore || 0), 0)}
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-xl p-4">
                            <p className="text-sm text-gray-600">Distinction & First Class</p>
                            <p className="text-3xl font-bold text-primary">
                              {(result.distinction || 0) + (result.firstClass || 0)}
                            </p>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold mb-3">
                          <span className="text-primary">📚</span>
                          Subject-wise Performance
                        </h3>

                        <div className="rounded-lg border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Total (Out Of)</TableHead>
                                <TableHead>Highest Score</TableHead>
                                <TableHead>Pass %</TableHead>
                                <TableHead>Avg Marks</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(result.subjects || []).map((sub, rowIndex) => (
                                <TableRow key={rowIndex}>
                                  <TableCell className="font-medium">{sub.subject}</TableCell>
                                  <TableCell>{sub.totalOutOf}</TableCell>
                                  <TableCell>{sub.highestScore}</TableCell>
                                  <TableCell>{sub.passPercentage}%</TableCell>
                                  <TableCell>{sub.avgMarks}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {index < boardResults.length - 1 && <hr className="my-8" />}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="neet" className="mt-6">
                {neetResults.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">
                        No NEET results available for {selectedYear}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div>
                    {neetResults.map((result) => (
                      <CompetitiveExamCard key={result._id} result={result} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="jee" className="mt-6">
                {jeeResults.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">
                        No JEE results available for {selectedYear}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div>
                    {jeeResults.map((result) => (
                      <CompetitiveExamCard key={result._id} result={result} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="kcet" className="mt-6">
                {kcetResults.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">
                        No KCET results available for {selectedYear}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div>
                    {kcetResults.map((result) => (
                      <CompetitiveExamCard key={result._id} result={result} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
