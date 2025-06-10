import { XIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ContentCard({
  title,
  data,
  onClose,
}: {
  title: string;
  data: string[][];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        onClick={onClose}
        className="bg-background/60 fixed inset-0 backdrop-blur-xs"
      />

      <Card className="relative max-h-[90vh] w-11/12 max-w-3xl overflow-y-auto">
        <CardHeader className="mb-4 flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{title} data</CardTitle>
          <CardAction>
            <Button
              variant="secondary"
              onClick={onClose}
              className="cursor-pointer"
            >
              <XIcon /> Close
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {data.map((row, rowIndex) => (
            <p
              key={rowIndex}
              className="hover:bg-muted/50 flex w-full space-x-2 border-t px-3.5 py-3.5 duration-100"
            >
              <b>{formatFieldTitle(row[0])}:</b>
              <span className="ml-auto">{row[1]}</span>
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function formatFieldTitle(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (match) => match.toUpperCase());
}
