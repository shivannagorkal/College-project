import { useEffect, useState, useRef } from 'react';

import { Card, CardContent } from '@/components/ui/card';

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

import { StudentsResultService } from '@/services/StudentsResultService';

const SUBJECT_MAX_MARKS = {
  Kannada:          { theory: 80, practical: 20 },
  English:          { theory: 80, practical: 20 },
  Mathematics:      { theory: 80, practical: 20 },
  Physics:          { theory: 70, practical: 30 },
  Chemistry:        { theory: 70, practical: 30 },
  Biology:          { theory: 70, practical: 30 },
  'Computer Science': { theory: 70, practical: 30 },
  Statistics:       { theory: 70, practical: 30 },
  Economics:        { theory: 80, practical: 20 },
  'Business Studies': { theory: 80, practical: 20 },
  Accountancy:      { theory: 80, practical: 20 },
};

const gradeInfo = (pct) => {
  if (pct >= 90) return { grade: 'A+', color: 'text-green-800',   bg: 'bg-green-200/70'  };
  if (pct >= 80) return { grade: 'A',  color: 'text-green-600',   bg: 'bg-green-200/70'  };
  if (pct >= 70) return { grade: 'B+', color: 'text-emerald-500', bg: 'bg-emerald-200/70'};
  if (pct >= 60) return { grade: 'B',  color: 'text-sky-600',     bg: 'bg-sky-200/70'    };
  if (pct >= 35) return { grade: 'C',  color: 'text-yellow-600',  bg: 'bg-yellow-200/70' };
  return              { grade: 'F',  color: 'text-red-600',     bg: 'bg-red-200/70'    };
};


export function Results() {

  const [results,         setResults]         = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [selectedYear,    setSelectedYear]    = useState(new Date().getFullYear().toString());
  const [suggestions,     setSuggestions]     = useState([]);   // dropdown list
  const [showDropdown,    setShowDropdown]    = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // clicked student
  const wrapperRef = useRef(null);


  // FETCH
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await StudentsResultService.getStudentsResult();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // LIVE SEARCH — fires on every keystroke
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedStudent(null); // clear detail card on new input

    const q = query.trim().toLowerCase();

    if (!q) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const matched = results.filter(
      (s) =>
        s.year?.toString() === selectedYear &&
        (
          s.studentName?.toLowerCase().includes(q) ||
          s.rollNo?.toString().includes(q)
        )
    );

    setSuggestions(matched);
    setShowDropdown(true);
  };


  // Year change — reset everything
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSearchQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedStudent(null);
  };


  // Click a suggestion row
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.studentName);
    setShowDropdown(false);
    setSuggestions([]);
  };


  // All students for the selected year (bottom table)
  const yearResults = results.filter(
    (s) => s.year?.toString() === selectedYear
  );


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="Results" page="results" subtitle="Search Student Results" />

      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10">


          {/* YEAR SELECT */}
          <div className="mb-6 flex items-center gap-3">
            <label className="font-semibold">Select Year:</label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border rounded-md px-3 py-2"
            >
              {[2026, 2025, 2024, 2023].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>


          {/* SEARCH CARD */}
          <Card className="mb-8">
            <CardContent className="pt-6">

              <div className="text-center mb-8">
                <h2 className="text-xl font-bold">Find Your Result</h2>
                <p className="text-sm text-gray-600">
                  Enter your Roll No or Name to search
                </p>
              </div>

              {/* Input + dropdown wrapper */}
              <div className="relative" ref={wrapperRef}>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter Roll No or Student Name"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    onFocus={() => suggestions.length && setShowDropdown(true)}
                    className="flex-1 border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSuggestions([]);
                        setShowDropdown(false);
                        setSelectedStudent(null);
                      }}
                      className="border px-4 py-2 rounded-md text-gray-500 hover:bg-gray-100"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* DROPDOWN SUGGESTIONS */}
                {showDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">

                    {suggestions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No students found
                      </div>
                    ) : (
                      suggestions.map((student) => (
                        <div
                          key={student._id}
                          onClick={() => handleSelectStudent(student)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        >
                          <img
                            src={student.studentImage}
                            alt={student.studentName}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{student.studentName}</p>
                            <p className="text-xs text-gray-500">
                              Roll No: {student.rollNo} &nbsp;|&nbsp;
                              {student.stream} - {student.section}
                            </p>
                          </div>
                          <span className={`text-sm font-bold ${gradeInfo(parseFloat(student.percentage)).color}`}>
                            {student.percentage}%
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {/* SELECTED STUDENT DETAIL CARD */}
          {!loading && selectedStudent && (() => {
            const { grade, color, bg } = gradeInfo(parseFloat(selectedStudent.percentage));
            return (
              <Card className="mb-8">
                <CardContent className="pt-6 mb-5">

                  {/* STUDENT INFO */}
                  <div className="flex flex-row items-center justify-between mb-6">

                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                      <img
                        src={selectedStudent.studentImage}
                        alt={selectedStudent.studentName}
                        className="w-40 h-40 object-cover rounded-lg border"
                      />
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold">{selectedStudent.studentName}</h2>
                        <p><span className="font-semibold">Roll No:</span> {selectedStudent.rollNo}</p>
                        <p><span className="font-semibold">Stream:</span> {selectedStudent.stream} - {selectedStudent.section}</p>
                        <p><span className="font-semibold">Year:</span> {selectedStudent.year}</p>
                        <p><span className="font-semibold">Total:</span> {selectedStudent.totalMarks}/600</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`flex flex-col items-center px-3 py-1 rounded-full text-sm font-semibold mb-2 backdrop-blur-lg ${bg} ${color}`}>
                        <span className="font-bold text-4xl mb-1">{grade}</span>
                      </div>
                      <p className={`font-bold text-4xl mb-2 ${color}`}>
                        {selectedStudent.percentage}%
                      </p>
                    </div>

                  </div>

                  {/* MARKS TABLE */}
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead rowSpan={2} className="text-center border">Subject</TableHead>
                          <TableHead colSpan={2} className="text-center border">Theory</TableHead>
                          <TableHead colSpan={2} className="text-center border">Practical</TableHead>
                          <TableHead colSpan={2} className="text-center border">Total</TableHead>
                          <TableHead rowSpan={2} className="text-center border">Result</TableHead>
                        </TableRow>
                        <TableRow>
                          <TableHead className="text-center border">Max</TableHead>
                          <TableHead className="text-center border">Obtained</TableHead>
                          <TableHead className="text-center border">Max</TableHead>
                          <TableHead className="text-center border">Obtained</TableHead>
                          <TableHead className="text-center border">Max</TableHead>
                          <TableHead className="text-center border">Obtained</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {Object.entries(selectedStudent.subjects || {}).map(([subject, marks]) => (
                          <TableRow key={subject}>
                            <TableCell className="font-medium">{subject}</TableCell>
                            <TableCell className="border text-center">{SUBJECT_MAX_MARKS[subject]?.theory || 0}</TableCell>
                            <TableCell className="border text-center">{marks.theory}</TableCell>
                            <TableCell className="border text-center">{SUBJECT_MAX_MARKS[subject]?.practical || 0}</TableCell>
                            <TableCell className="border text-center">{marks.practical}</TableCell>
                            <TableCell className="border text-center">
                              {(SUBJECT_MAX_MARKS[subject]?.theory || 0) + (SUBJECT_MAX_MARKS[subject]?.practical || 0)}
                            </TableCell>
                            <TableCell className="border text-center">{marks.total}</TableCell>
                            <TableCell className="border text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${marks.total >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {marks.total >= 40 ? 'Pass' : 'Fail'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                </CardContent>
              </Card>
            );
          })()}


          {/* NO RESULT */}
          {!loading && searchQuery && !showDropdown && !selectedStudent && (
            <div className="text-center text-red-500 py-6">
              Student Result Not Found
            </div>
          )}


          {/* ALL RESULTS TABLE */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">
                All Students Results — {selectedYear}
              </h2>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Photo</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Stream</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    {/* LOADING */}
                    {loading && (
                      <div className="text-center py-10 m-auto">Loading Results...</div>
                    )}

                    {yearResults.map((student) => (
                      <TableRow
                        key={student._id}
                        onClick={() => handleSelectStudent(student)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <TableCell>
                          <img
                            src={student.studentImage}
                            alt={student.studentName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>{student.stream}</TableCell>
                        <TableCell>{student.section}</TableCell>
                        <TableCell>{student.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>

      <Footer />
    </div>
  );
}