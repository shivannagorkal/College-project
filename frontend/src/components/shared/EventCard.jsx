import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { formatDateShort } from '@/utils/formatDate';

export function EventCard({ title, date, description, image }) {
  return (
    <Card className="hover:shadow-lg transition overflow-hidden">
      <div className="bg-secondary h-48 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-primary-foreground text-4xl opacity-50">📅</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDateShort(date)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
      </CardContent>
    </Card>
  );
}
