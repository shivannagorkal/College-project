import { useEffect, useState } from 'react';

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

// total marks for each subject
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


export function Results() {

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  const [searchedStudent, setSearchedStudent] =
    useState(null);

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );


  // FETCH RESULTS
  useEffect(() => {

    const fetchResults = async () => {

      try {

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

    fetchResults();

  }, []);


  // SEARCH STUDENT
  const handleSearch = () => {

    const query =
      searchQuery.trim().toLowerCase();

    if (!query) return;

    const found = results.find((student) =>

      student.year?.toString() === selectedYear

      &&

      (
        student.studentName
          ?.toLowerCase()
          .includes(query)

        ||

        student.rollNo
          ?.toString() === query
      )
    );

    setSearchedStudent(found || null);
  };


  return (

    <div className="min-h-screen flex flex-col">

      <Navbar />

      <PageHeader
        title="Results"
        page="results"
        subtitle="Search Student Results"
      />


      <div className="flex-1">

        <div className="max-w-6xl mx-auto px-4 py-10">


          {/* YEAR SELECT */}

          <div className="mb-6 flex items-center gap-3">

            <label className="font-semibold">
              Select Year:
            </label>

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value)
              }
              className="border rounded-md px-3 py-2"
            >

              {[2026, 2025, 2024, 2023].map((year) => (

                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>

              ))}

            </select>

          </div>


          {/* SEARCH CARD */}

          <Card className="mb-8">

            <CardContent className="pt-6">
              <div className='text-center mb-8'>
              <h2 className="text-xl font-bold">
                Find Your Result
              </h2>
              <p className="text-sm text-gray-600">Enter your Roll No or Name to search</p>
              </div>

              <div className="flex gap-3">

                <input
                  type="text"
                  placeholder="Enter Roll No or Student Name"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="flex-1 border rounded-md px-4 py-2"
                />

                <button
                  onClick={handleSearch}
                  className="bg-primary text-white px-6 py-2 rounded-md"
                >
                  Search
                </button>

              </div>

            </CardContent>

          </Card>


          {/* LOADING */}

          {loading && (

            <div className="text-center py-10">

              Loading Results...

            </div>
          )}


          {/* STUDENT RESULT */}

          {!loading && searchedStudent && (

            <Card>

              <CardContent className="pt-6 mb-5">


                {/* STUDENT INFO */}

                <div className="flex flex-row items-center justify-between">

                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center md:items-center mb-4">
                  <img
                    src={searchedStudent.studentImage}
                    alt={searchedStudent.studentName}
                    className="w-40 h-40 object-cover rounded-lg border"
                  />

                  <div className="space-y-0">

                    <h2 className="text-2xl font-bold">
                      {searchedStudent.studentName}
                    </h2>

                    <p>
                      <span className="font-semibold">
                        Roll No:
                      </span>{' '}
                      {searchedStudent.rollNo}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Stream:
                      </span>{' '}
                      {searchedStudent.stream}-{searchedStudent.section}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Year:
                      </span>{' '}
                      {searchedStudent.year}
                    </p>

                    <p className='font-semibold'>
                      <span className="font-semibold">
                        Total:
                      </span>{' '}
                      {searchedStudent.totalMarks}/600
                    </p>
                  </div>
                  </div>

                  <div className='flex flex-col items-center'>
                    <div className={`flex flex-col items-center px-3 py-1 rounded-full text-sm font-semibold mb-2 backdrop-blur-lg ${
                      searchedStudent.percentage >= 90
                        ? 'bg-green-200/70 text-green-800'
                        : searchedStudent.percentage >= 80
                          ? 'bg-green-200/70 text-green-600'
                          : searchedStudent.percentage >= 70
                            ? 'bg-emerald-200/70 text-emerald-500'
                            : searchedStudent.percentage >= 60
                              ? 'bg-sky-200/70 text-sky-600'
                              : searchedStudent.percentage >= 35
                                ? 'bg-yellow-200/70 text-yellow-600'
                                : 'bg-red-200/70 text-red-600'
                    }`}>
                      <span className='font-bold text-4xl mb-1'>{searchedStudent.percentage >= 90 ? 'A+' : searchedStudent.percentage >= 80 ? 'A' : searchedStudent.percentage >= 70 ? 'B+' : searchedStudent.percentage >= 60 ? 'B' : searchedStudent.percentage >= 35 ? 'C' : "F"}</span>
                    </div>
                    <p className={`font-bold font-sans font-stretch-90% text-4xl mb-2 ${searchedStudent.percentage >= 90
                      ? 'text-green-800'
                      : searchedStudent.percentage >= 80 ? 'text-green-600' : searchedStudent.percentage >= 70 ? 'text-emerald-500' : searchedStudent.percentage >= 60 ? 'text-sky-600' : searchedStudent.percentage >= 35 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {searchedStudent.percentage}%
                    </p>
                  </div>

                </div>


                {/* RESULT TABLE */}

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

                      {Object.entries(
                        searchedStudent.subjects || {}
                      ).map(([subject, marks]) => (

                        <TableRow key={subject}>

                          <TableCell className="font-medium border-accent">
                            {subject}
                          </TableCell>

                          <TableCell className="border text-center">
                            {SUBJECT_MAX_MARKS[subject]?.theory || 0}
                          </TableCell>

                          <TableCell className="border text-center">
                            {marks.theory}
                          </TableCell>

                          <TableCell className="border text-center">
                            {SUBJECT_MAX_MARKS[subject]?.practical || 0}
                          </TableCell>

                          <TableCell className="border text-center">
                            {marks.practical}
                          </TableCell>

                          <TableCell className="border text-center">
                            {(SUBJECT_MAX_MARKS[subject]?.theory || 0) +
                              (SUBJECT_MAX_MARKS[subject]?.practical || 0)}
                          </TableCell>

                          <TableCell className="border text-center">
                            {marks.total}
                          </TableCell>

                          <TableCell>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                marks.total >= 40
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {marks.total >= 40 ? 'Pass' : 'Fail'}
                            </span>

                          </TableCell>

                        </TableRow>

                      ))}

                    </TableBody>

                  </Table>

                </div>

                <div>
                  
                </div>

              </CardContent>

            </Card>
          )}


          {/* NO RESULT */}

          {!loading &&
            searchQuery &&
            !searchedStudent && (

            <div className="text-center text-red-500 py-6">

              Student Result Not Found

            </div>
          )}

          {/* ALL RESULTS */}
        
          <Card className="mb-8">

            <CardContent className="pt-6">

              <h2 className="text-xl font-bold mb-4">

                All Students Results

              </h2>

              <div className="border rounded-lg overflow-hidden">

                <Table>

                  <TableHeader>

                    <TableRow>

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

                    </TableRow>

                  </TableHeader>

                  <TableBody>

                    {results.map((student) => (
                    
                      <TableRow key={student._id}>
                      
                        <TableCell>
                    
                          {student.studentName}
                    
                        </TableCell>
                    
                        <TableCell>
                    
                          {student.rollNo}
                    
                        </TableCell>
                    
                        <TableCell>
                    
                          {student.year}
                    
                        </TableCell>
                    
                        <TableCell>
                    
                          {student.stream}
                    
                        </TableCell>
                    
                        <TableCell>
                    
                          {student.section}
                    
                        </TableCell>
                    
                        <TableCell>
                    
                          {student.percentage}%
                    
                        </TableCell>
                    
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