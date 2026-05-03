import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function FacultyCard({ name, subject, qualification, department }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="hover:shadow-lg transition text-center">
      <CardHeader className="pb-3">
        <Avatar className="w-20 h-20 mx-auto">
          <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-sm text-primary font-medium">{subject}</p>
        </div>
        <div className="space-y-2">
          {department && <Badge variant="outline">{department}</Badge>}
          {qualification && <p className="text-xs text-gray-600">{qualification}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
