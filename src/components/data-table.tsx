'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  ArrowBigLeft,
  ArrowBigRight,
  ArrowUpDown,
  BadgeCheckIcon,
  Home,
  Plus,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import Link from 'next/link';
import { EmptyData } from './empty-data';
import { usePathname } from 'next/navigation';

interface iDataTableProps<TData> {
  data: TData[];
  sortableFields?: (keyof TData)[];
  linkableFields?: (keyof TData)[];
  linkBasePath?: string;
  filterableField?: keyof TData;
  filterPlaceholder?: string;
  ativos?: boolean;
  param?: string;
  insert?: boolean;
}

const formatDisplayValue = (key: string, value: unknown) => {
  if (value === null || value === undefined || value === '') return '—';

  if (value instanceof Date) {
    return value.toLocaleDateString('pt-BR');
  }

  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
    }

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString('pt-BR');
    }
  }

  return String(value);
};

export const DataTable = <TData extends { id: string }>({
  data,
  sortableFields = [],
  linkableFields = [],
  linkBasePath = '',
  filterableField = 'nome' as keyof TData,
  filterPlaceholder = 'Filtrar...',
  ativos = false,
  param,
  insert = true,
}: iDataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [insertButtonClicked, setInsertButtonClicked] = useState(false);
  const pathname = usePathname();

  const containsList = pathname.includes('list');

  const columns: ColumnDef<TData>[] = useMemo(() => {
    if (data.length === 0) return [];

    const sampleItem = data[0];
    const keys = Object.keys(sampleItem) as (keyof TData)[];

    return keys
      .filter((key) => key !== 'id')
      .map((key) => {
        const columnKey = String(key);

        const displayName =
          columnKey === 'data'
            ? 'Data'
            : columnKey === 'created_at'
              ? 'Criado em'
              : columnKey;

        const column: ColumnDef<TData> = {
          accessorKey: columnKey,
          header: ({ column }) => {
            if (sortableFields.includes(key)) {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                  }
                  className="cursor-pointer p-0!"
                >
                  {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              );
            }

            return <div>{displayName}</div>;
          },
          cell: ({ row }) => {
            const value = row.getValue(columnKey);
            const displayedValue =
              columnKey === 'created_at' || columnKey === 'data'
                ? formatDisplayValue(columnKey, value)
                : value;

            if (linkableFields.includes(key) && linkBasePath) {
              const { id } = row.original;
              const linkPath = `${linkBasePath}/form/${id}${param ? `?param=${param}` : ''}`;
              return (
                <Link href={linkPath}>
                  <div className="cursor-pointer capitalize">
                    {String(displayedValue)}
                  </div>
                </Link>
              );
            }

            return <div className="capitalize">{String(displayedValue)}</div>;
          },
        };

        return column;
      });
  }, [data, sortableFields, linkableFields, linkBasePath, param]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex w-full justify-end gap-2">
        {containsList && (
          <Link href={`/${linkBasePath}`}>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-auto cursor-pointer border-2 text-blue-950 transition-shadow duration-300 hover:bg-gray-50"
              title="voltar"
            >
              <ArrowBigLeft />
            </Button>
          </Link>
        )}
        <Link href={`/`}>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-auto cursor-pointer border-2 text-blue-950 transition-shadow duration-300 hover:bg-gray-50"
            title="ir para a home"
          >
            <Home />
          </Button>
        </Link>
        {insert && (
          <Link href={`/${linkBasePath}/form`}>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-auto cursor-pointer border-2 text-blue-950 transition-shadow duration-300 hover:bg-gray-50"
              disabled={insertButtonClicked}
              onClick={() => setInsertButtonClicked(true)}
              title="inserir novo registro"
            >
              <Plus />
            </Button>
          </Link>
        )}
      </div>
      {!data.length ? (
        <EmptyData />
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 py-4">
            <Input
              id="filter-input"
              placeholder={filterPlaceholder}
              value={
                (table
                  .getColumn(String(filterableField))
                  ?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table
                  .getColumn(String(filterableField))
                  ?.setFilterValue(event.target.value)
              }
            />
            {ativos && (
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer bg-blue-500 text-white dark:bg-blue-600"
              >
                <BadgeCheckIcon />
                Ativos
              </Button>
            )}
          </div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="px-6">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-6">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Não há registros...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex flex-1 gap-1 text-sm">
              <span>Exibindo</span>
              <span>{table.getState().pagination.pageIndex * 10 + 1}</span>
              <span> - </span>
              <span>
                {(table.getState().pagination.pageIndex + 1) * 10 >
                table.getRowCount()
                  ? table.getRowCount()
                  : (table.getState().pagination.pageIndex + 1) * 10}
              </span>
              <span>de</span>
              <span>{table.getRowCount()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="cursor-pointer transition-shadow duration-300 hover:bg-gray-200"
              >
                <ArrowBigLeft />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="cursor-pointer transition-shadow duration-300 hover:bg-gray-200"
              >
                <ArrowBigRight />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
