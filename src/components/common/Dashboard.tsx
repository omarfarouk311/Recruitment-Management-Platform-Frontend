import React, { useEffect, useRef } from "react";

type BaseColumnDef = {
  key: string;
  header: string;
  headerClassName?: string;
  cellClassName?: string;
};

export type ColumnDef<T> =
  | (BaseColumnDef & {
      key: keyof T;
      render?: never;
    })
  | (BaseColumnDef & {
      key: string;
      render: (row: T) => React.ReactNode;
    });

interface DashboardProps<T> {
  columns: ColumnDef<T>[];
  useData: () => T[];
  useHasMore: () => boolean;
  useIsLoading: () => boolean;
  useFetchData: () => () => Promise<void>;
}

function Dashboard<T>({
  columns,
  useData,
  useHasMore,
  useIsLoading,
  useFetchData,
}: DashboardProps<T>) {
  const observerTarget = useRef<HTMLTableRowElement>(null);
  const rows = useData();
  const hasMore = useHasMore();
  const isLoading = useIsLoading();
  const fetchData = useFetchData();
  console.log("innnnnnnnnnnn")
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchData();
        }
      },
      { threshold: 0.9 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading]);

  return (
    
      <table className="w-full">
        <thead className="sticky top-0 bg-white">
          <tr className="text-gray-500">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`pb-4 px-10 text-center ${column.headerClassName || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-y-auto hide-scrollbar">
          {rows.length === 0 && !isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 px-4 text-gray-500"
              >
                No data found.
              </td>
            </tr>
          ) : (
            <>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  {columns.map((column) => {
                    const cellClassName = column.cellClassName || "py-6 px-6";

                    if ("render" in column) {
                      return (
                        <td key={column.key} className={`text-center ${cellClassName}`}>
                          {column.render?.(row)}
                        </td>
                      );
                    }

                    const key = column.key as keyof T;
                    return (
                      <td key={column.key} className={`text-center ${cellClassName}`}>
                        {
                          (key === "country"
                            ? `${row[key]}, ${row["city" as keyof T]}`
                            : row[key]) as React.ReactNode
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}

              {isLoading && (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  </td>
                </tr>
              )}

              {!hasMore && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-4 text-gray-500"
                  >
                    No more data to show
                  </td>
                </tr>
              )}

              <tr ref={observerTarget} className="h-2" />
            </>
          )}
        </tbody>
      </table>
    
  );
}

export default Dashboard;
