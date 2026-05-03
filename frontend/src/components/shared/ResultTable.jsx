import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ResultTable({ results = [] }) {
  if (!results.length) {
    return <p className="text-center text-gray-500 py-8">No results available</p>;
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary">
            <TableHead>Subject</TableHead>
            <TableHead>Pass %</TableHead>
            <TableHead>Avg Marks</TableHead>
            <TableHead>Topper Marks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{result.subject}</TableCell>
              <TableCell>{result.passPercentage}%</TableCell>
              <TableCell>{result.avgMarks}</TableCell>
              <TableCell>{result.topperMarks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
