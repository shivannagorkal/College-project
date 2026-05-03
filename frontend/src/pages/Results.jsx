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
import { boardResultService } from '@/services/boardResultService';
import { competitiveResultService } from '@/services/competitiveResultService';
import { topperService } from '@/services/topperService';
import { YEARS } from '@/utils/constants';

const PhotoCell = ({ topper }) => (
  topper.photo ? (
    <img src={topper.photo} alt={topper.name} className="w-10 h-10 rounded-full object-cover" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
      {getInitials(topper.name)}
    </div>
  )
);

export function Results() {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [boardResults, setBoardResults] = useState([]);
  const [competitiveResults, setCompetitiveResults] = useState([]);
  const [toppers, setToppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//    const [searchQuery, setSearchQuery] = useState('');
//    const [searchedStudent, setSearchedStudent] = useState(null);
//    const [searchClicked, setSearchClicked] = useState(false);

// const handleSearch = () => {
//   setSearchClicked(true);

//   const found = boardResults.find(
//     (r) =>
//       r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       r.rollNo?.toString() === searchQuery
//   );

//   setSearchedStudent(found || null);
// };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [boardResult, competitiveResult, toppersData] = await Promise.allSettled([
          boardResultService.getBoardResults(),
          competitiveResultService.getCompetitiveResults(),
          topperService.getToppers(),
        ]);

        if (boardResult.status === 'rejected' && competitiveResult.status === 'rejected') {
          throw boardResult.reason;
        }

        const board =
          boardResult.status === 'fulfilled' && Array.isArray(boardResult.value)
            ? boardResult.value
            : [];
        const competitive =
          competitiveResult.status === 'fulfilled' && Array.isArray(competitiveResult.value)
            ? competitiveResult.value
            : [];
        const toppersArray =
          toppersData.status === 'fulfilled' && Array.isArray(toppersData.value)
            ? toppersData.value
            : [];

        setBoardResults(board);
        setCompetitiveResults(competitive);
        setToppers(toppersArray);

        const years = Array.from(
          new Set([
            ...board.map((r) => r.year?.toString()).filter(Boolean),
            ...competitive.map((r) => r.year?.toString()).filter(Boolean),
          ])
        ).sort((a, b) => Number(b) - Number(a));

        if (years.length > 0) {
          setSelectedYear((currentYear) =>
            years.includes(currentYear) ? currentYear : years[0]
          );
        }
      } catch (err) {
        setError(err?.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const yearBoardResults = boardResults.filter(
    r => r.year?.toString() === selectedYear
  );
  const neetResults = competitiveResults.filter(
    r => r.resultType === 'NEET' && r.year?.toString() === selectedYear
  );
  const jeeResults = competitiveResults.filter(
    r => r.resultType === 'JEE' && r.year?.toString() === selectedYear
  );
  const kcetResults = competitiveResults.filter(
    r => r.resultType === 'KCET' && r.year?.toString() === selectedYear
  );

  const availableYears = Array.from(
    new Set([
      ...boardResults.map((r) => r.year?.toString()).filter(Boolean),
      ...competitiveResults.map((r) => r.year?.toString()).filter(Boolean),
    ])
  ).sort((a, b) => Number(b) - Number(a));

  const yearBoardToppers = toppers.filter(
    (t) => t.topperType === 'Board' && t.year?.toString() === selectedYear
  );

  const sortedToppers = [...yearBoardToppers].sort((a, b) => {
    const rankA = parseInt(a.rank) || 0;
    const rankB = parseInt(b.rank) || 0;
    return rankA - rankB;
  });

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

{/* 🔍 Result Search Section
<Card className="mb-8 max-w-2xl mx-auto">
  <CardHeader>
    <CardTitle className="text-center text-xl font-bold">
      🔍 Find Your Result
    </CardTitle>
    <p className="text-center text-sm text-gray-500">
      Enter your Roll Number or Name to search
    </p>
  </CardHeader>

  <CardContent>
    {/* Search Input 
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Search by name or roll no..."
        className="flex-1 border rounded-md px-3 py-2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-primary text-white px-4 py-2 rounded-md"
      >
        Search
      </button>
    </div>

    {/* Result Display 
    {searchedStudent && (
      <div className="border rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold">{searchedStudent.name}</h3>
            <p className="text-sm text-gray-500">
              Class {searchedStudent.className} • Roll No: {searchedStudent.rollNo}
            </p>
          </div>

          <div className="text-right">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
              {searchedStudent.grade}
            </span>
            <p className="text-xl font-bold text-primary">
              {searchedStudent.percentage}%
            </p>
          </div>
        </div>

        {/* Marks Table 
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Max</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {searchedStudent.subjects.map((sub, i) => (
              <TableRow key={i}>
                <TableCell>{sub.name}</TableCell>
                <TableCell>{sub.marks}</TableCell>
                <TableCell>{sub.max}</TableCell>
                <TableCell>
                  <span className="text-green-600 text-sm">
                    {sub.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}

            {/* Total Row 
            <TableRow className="font-bold">
              <TableCell>Total</TableCell>
              <TableCell>{searchedStudent.total}</TableCell>
              <TableCell>{searchedStudent.maxTotal}</TableCell>
              <TableCell className="text-green-600">PASS</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="text-right mt-4">
          <button className="border px-3 py-1 rounded-md text-sm">
            ⬇ Download Report Card
          </button>
        </div>
      </div>
    )}

    {/* No Result 
    {searchClicked && !searchedStudent && (
      <p className="text-center text-red-500 mt-4">
        No result found
      </p>
    )}
  </CardContent>
</Card> */}

          {!loading && !error && sortedToppers.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">🏆 Year-wise College Toppers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">S.No</TableHead>
                        <TableHead>Profile</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Stream</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedToppers.map((topper) => (
                        <TableRow key={topper._id || topper.id}>
                          <TableCell className="text-center font-bold text-primary">
                            {topper.rank}
                          </TableCell>
                          <TableCell><PhotoCell topper={topper} /></TableCell>
                          <TableCell className="font-medium">{topper.name}</TableCell>
                          <TableCell>
                            {topper.stream}
                            {topper.group && topper.stream === 'Science' ? ` - ${topper.group}` : ''}
                          </TableCell>
                          <TableCell className="text-right">{topper.percentage}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

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
                {yearBoardResults.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No board results for {selectedYear}
                  </p>
                ) : (
                  <div>
                    {yearBoardResults.map((result, index) => (
                      <div key={result._id}>
                        <h3 className="text-lg font-bold mb-3">
                          {result.stream === 'Science'
                            ? `🔬 Science Stream - ${result.className}`
                            : '📊 Commerce Stream'}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="rounded-xl p-5 text-center bg-blue-50">
                            <p className="text-sm text-gray-500 mb-2">Total Students</p>
                            <p className="text-4xl font-bold text-primary">{result.totalStudents}</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-green-50">
                            <p className="text-sm text-gray-500 mb-2">College Result</p>
                            <p className="text-4xl font-bold text-primary">{result.passPercentage}%</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-orange-50">
                            <p className="text-sm text-gray-500 mb-2">Highest % in Stream</p>
                            <p className="text-4xl font-bold text-primary">
                              {result.highestPercentageInStream}%
                            </p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-purple-50">
                            <p className="text-sm text-gray-500 mb-2">Distinction & First Class</p>
                            <p className="text-4xl font-bold text-primary">
                              {(result.distinction || 0) + (result.firstClass || 0)}
                            </p>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold mb-3">
                          <span className="text-primary">📚</span> Subject-wise Performance
                        </h3>

                        <div className="rounded-lg border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Total (Out Of)</TableHead>
                                <TableHead>Highest Score</TableHead>
                                <TableHead>Pass %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(result.subjects || []).map((sub, rowIndex) => (
                                <TableRow key={rowIndex}>
                                  <TableCell className="font-medium">{sub.subject}</TableCell>
                                  <TableCell>{sub.totalOutOf}</TableCell>
                                  <TableCell>{sub.highestScore}</TableCell>
                                  <TableCell>{sub.passPercentage}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {index < yearBoardResults.length - 1 && <hr className="my-8" />}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="neet" className="mt-6">
                {neetResults.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No NEET results for {selectedYear}
                  </p>
                ) : (
                  <div>
                    {neetResults.map((result) => (
                      <div key={result._id} className="mb-8">
                        <h3 className="text-lg font-bold mb-4">{result.year}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="rounded-xl p-5 text-center bg-blue-50">
                            <p className="text-sm text-gray-500 mb-2">Total Appeared</p>
                            <p className="text-4xl font-bold text-primary">{result.totalAppeared}</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-green-50">
                            <p className="text-sm text-gray-500 mb-2">Total Qualified</p>
                            <p className="text-4xl font-bold text-primary">{result.totalQualified}</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-orange-50">
                            <p className="text-sm text-gray-500 mb-2">Qualified %</p>
                            <p className="text-4xl font-bold text-primary">{result.qualifiedPercentage}%</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-yellow-50">
                            <p className="text-sm text-gray-500 mb-2">Highest Score</p>
                            <p className="text-4xl font-bold text-primary">{result.highestScore}</p>
                          </div>
                        </div>
                        {result.description && (
                          <p className="text-gray-600 mt-4 text-sm">{result.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="jee" className="mt-6">
                {jeeResults.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No JEE results for {selectedYear}
                  </p>
                ) : (
                  <div>
                    {jeeResults.map((result) => (
                      <div key={result._id} className="mb-8">
                        <h3 className="text-lg font-bold mb-4">{result.year}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="rounded-xl p-5 text-center bg-blue-50">
                            <p className="text-sm text-gray-500 mb-2">Total Appeared</p>
                            <p className="text-4xl font-bold text-primary">{result.totalAppeared}</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-green-50">
                            <p className="text-sm text-gray-500 mb-2">Total Qualified</p>
                            <p className="text-4xl font-bold text-primary">{result.totalQualified}</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-orange-50">
                            <p className="text-sm text-gray-500 mb-2">Qualified %</p>
                            <p className="text-4xl font-bold text-primary">{result.qualifiedPercentage}%</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-yellow-50">
                            <p className="text-sm text-gray-500 mb-2">Highest Score</p>
                            <p className="text-4xl font-bold text-primary">{result.highestScore}</p>
                          </div>
                        </div>
                        {result.description && (
                          <p className="text-gray-600 mt-4 text-sm">{result.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="kcet" className="mt-6">
                {kcetResults.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No KCET results for {selectedYear}
                  </p>
                ) : (
                  <div>
                    {kcetResults.map((result) => (
                      <div key={result._id} className="mb-8">
                        <h3 className="text-lg font-bold mb-4">{result.year}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="rounded-xl p-5 text-center bg-blue-50">
                            <p className="text-sm text-gray-500 mb-2">Total Appeared</p>
                            <p className="text-4xl font-bold text-primary">{result.totalAppeared}</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-green-50">
                            <p className="text-sm text-gray-500 mb-2">Total Qualified</p>
                            <p className="text-4xl font-bold text-primary">{result.totalQualified}</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-orange-50">
                            <p className="text-sm text-gray-500 mb-2">Qualified %</p>
                            <p className="text-4xl font-bold text-primary">{result.qualifiedPercentage}%</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-yellow-50">
                            <p className="text-sm text-gray-500 mb-2">Highest Score</p>
                            <p className="text-4xl font-bold text-primary">{result.highestScore}</p>
                          </div>
                        </div>
                        {result.description && (
                          <p className="text-gray-600 mt-4 text-sm">{result.description}</p>
                        )}
                      </div>
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
