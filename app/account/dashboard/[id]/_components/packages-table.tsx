import { Package } from "@/apis/supabase";
import { Chip, ChipProps } from "@heroui/chip";
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useCallback, useMemo, useState } from "react";
import { Pagination } from "@heroui/pagination";

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

interface PackagesTableProps {
  packages: Package[];
}

export function PackagesTable({ packages }: PackagesTableProps) {
  const [rowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "version",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const pages = Math.ceil(packages.length / rowsPerPage);

  const sortedItems = useMemo(() => {
    return packages.toSorted((a: Package, b: Package) => {
      const column = sortDescriptor.column as keyof Package;
      let first = a[column];
      let second = b[column];

      if (column === "version") {
        if (!first) first = "Up to date";
        if (!second) second = "Up to date";
      }

      const cmp = first?.localeCompare(second ?? "");
      if (!cmp) return 0;

      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
  }, [sortDescriptor, packages]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, rowsPerPage, sortedItems]);

  const renderCell = useCallback((item: Package, columnKey: keyof Package) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "version": {
        let color: ChipProps["color"] = "danger";
        if (cellValue === "patch") color = "success";
        if (cellValue === "minor") color = "warning";

        if (!cellValue) {
          return <p>Up to date</p>;
        }

        return (
          <Chip color={color} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      }
      case "depType":
        if (cellValue === "devDep") return "dev";
        return "prod";

      default:
        return cellValue;
    }
  }, []);

  const bottomContent = useMemo(() => {
    return (
      <Pagination
        className="mx-auto"
        color="primary"
        isCompact
        page={page}
        showControls
        showShadow
        total={pages}
        onChange={setPage}
      />
    );
  }, [page, pages]);

  return (
    <Table
      isHeaderSticky
      aria-label="Packages Table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[480px]",
      }}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} allowsSorting={column.sortable}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={items}>
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as keyof Package)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
const columns: { key: keyof Package; label: string; sortable?: boolean }[] = [
  {
    key: "name",
    label: "NAME",
    sortable: true,
  },
  {
    key: "current",
    label: "CURRENT",
  },
  {
    key: "last",
    label: "LATEST",
  },
  {
    key: "depType",
    label: "TYPE",
    sortable: true,
  },
  {
    key: "version",
    label: "VERSION",
    sortable: true,
  },
];
