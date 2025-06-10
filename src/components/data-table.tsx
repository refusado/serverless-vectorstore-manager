import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';
import { EyeIcon } from 'lucide-react';

export interface TableData {
  fileName: string;
  isVectorized: boolean;
  updatedAt: string | null;
  actions: {
    onVectorize: (doc: string) => void;
    onDetail: (doc: string) => void;
    onDeleteVectors: (doc: string) => void;
  };
}

interface DataTableProps {
  data: TableData[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>File Name</TableHead>
            {/* <TableHead>Vectorized</TableHead> */}
            <TableHead>Vectorized At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(
            ({
              fileName,
              isVectorized,
              updatedAt,
              actions: { onVectorize, onDetail, onDeleteVectors },
            }) => (
              <TableRow key={fileName}>
                <TableCell>{fileName}</TableCell>
                <TableCell>
                  {updatedAt ? (
                    <span>{updatedAt}</span>
                  ) : (
                    <i className="text-muted-foreground text-xs">
                      Not vetorized
                    </i>
                  )}
                </TableCell>
                <TableCell className="flex space-x-2 text-sm">
                  {!isVectorized ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onVectorize(fileName)}
                      className="cursor-pointer"
                    >
                      Vectorize
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDetail(fileName)}
                        className="cursor-pointer"
                      >
                        <EyeIcon /> Details
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteVectors(fileName)}
                        className="ml-auto cursor-pointer"
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
}
