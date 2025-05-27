// components/dashboard/activity-table.tsx
import { formatTime } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { ActivityItem } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface ActivityTableProps {
  data: ActivityItem[];
}

export default function ActivityTable({ data }: ActivityTableProps) {
  const getBadgeVariant = (classification: string) => {
    switch (classification) {
      case 'Neutral':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Offensive':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'Hate Speech':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return '';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50%]">Tweet Content</TableHead>
          <TableHead>Classification</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6 text-gray-500">
              No recent activity to display
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.content}</TableCell>
              <TableCell>
                <Badge 
                  className={getBadgeVariant(item.classification)}
                  variant="outline"
                >
                  {item.classification}
                </Badge>
              </TableCell>
              <TableCell>{item.confidence}%</TableCell>
              <TableCell className="text-right text-sm text-gray-500">
                {formatTime(item.time)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
