import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { TopperCard } from '@/components/shared/TopperCard';
import { Spinner } from '@/components/ui/spinner';
import { topperService } from '@/services/topperService';
import { YEARS } from '@/utils/constants';

export function Toppers() {
  const [allToppers, setAllToppers] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [activeTab, setActiveTab] = useState('Board');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await topperService.getToppers();
        setAllToppers(Array.isArray(data) ? data : []);
      } catch (err) {
        setAllToppers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const yearToppers = allToppers.filter(
    (t) => t.year.toString() === selectedYear
  );
  const boardToppers = yearToppers.filter((t) => t.topperType === 'Board');
  const neetToppers = yearToppers.filter((t) => t.topperType === 'NEET');
  const jeeToppers = yearToppers.filter((t) => t.topperType === 'JEE');
  const kcetToppers = yearToppers.filter((t) => t.topperType === 'KCET');

  const scienceToppers = boardToppers.filter((t) => t.stream === 'Science');
  const commerceToppers = boardToppers.filter((t) => t.stream === 'Commerce');

  const renderGrid = (toppers) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {toppers.map((topper) => (
        <TopperCard key={topper._id} topper={topper} />
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className="text-center py-12">
      <p className="text-gray-500">
        No {activeTab} toppers found for {selectedYear}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="Hall of Fame" subtitle="Celebrating our top performers" />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex gap-4 items-center">
            <label className="font-semibold">Year:</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
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

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="Board">Board</TabsTrigger>
                <TabsTrigger value="NEET">NEET</TabsTrigger>
                <TabsTrigger value="JEE">JEE</TabsTrigger>
                <TabsTrigger value="KCET">KCET</TabsTrigger>
              </TabsList>

              <TabsContent value="Board" className="mt-6">
                {boardToppers.length === 0 ? (
                  renderEmpty()
                ) : (
                  <div className="space-y-10">
                    {scienceToppers.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold mb-4">
                          {'\u{1F52C}'} Science Stream
                        </h3>
                        {renderGrid(scienceToppers)}
                      </div>
                    )}

                    {commerceToppers.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold mb-4">
                          {'\u{1F4CA}'} Commerce Stream
                        </h3>
                        {renderGrid(commerceToppers)}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="NEET" className="mt-6">
                {neetToppers.length === 0 ? renderEmpty() : renderGrid(neetToppers)}
              </TabsContent>

              <TabsContent value="JEE" className="mt-6">
                {jeeToppers.length === 0 ? renderEmpty() : renderGrid(jeeToppers)}
              </TabsContent>

              <TabsContent value="KCET" className="mt-6">
                {kcetToppers.length === 0 ? renderEmpty() : renderGrid(kcetToppers)}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
