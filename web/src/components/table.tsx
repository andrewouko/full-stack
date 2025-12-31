interface Identifiable {
  id: number;
}

interface PaginationProps {
  setLimit: (limit: number) => void;
  limit: number;
  goToNextPage: (lastItemId: number | null) => void;
  goToPreviousPage: () => void;
  cursor: number | null;
  pageSizeOptions: number[];
}

interface Props<T extends Identifiable> {
  title: string;
  columnNames: string[];
  data: T[];
  loading: boolean;
  hasError: boolean;
  pagination?: PaginationProps;
  onRowClick?: (item: T) => void;
  actions?: React.ReactNode[];
}

export function Table<T extends Identifiable>({
  title,
  columnNames,
  data,
  loading,
  hasError,
  pagination,
  onRowClick,
  actions,
}: Readonly<Props<T>>) {
  const {
    setLimit,
    limit,
    goToNextPage,
    goToPreviousPage,
    cursor,
    pageSizeOptions,
  } = pagination || {};
  return (
    <div>
      {pagination && setLimit && pageSizeOptions && (
        <div className="pagination-controls">
          <label>
            <p>{title} per page:</p>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {data.length ? (
        <table className="loans-table">
          <thead>
            <tr>
              {columnNames.map((colName, idx) => (
                <th key={`header-${idx}-${title}`}>{colName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr
                  key={`item-${index}-${title}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {Object.values(item).map((value, idx) => (
                    <td key={`item-${index}-${title}-value-${idx}`}>
                      {String(value)}
                    </td>
                  ))}
                </tr>
              );
            })}
            {actions && (
              <tr>
                <td colSpan={columnNames.length}>{actions}</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div>No data</div>
      )}
      {pagination && goToPreviousPage && goToNextPage && limit && (
        <div className="pagination-buttons">
          <button
            disabled={!cursor || loading || hasError}
            onClick={goToPreviousPage}
          >
            Previous
          </button>
          <button
            disabled={data.length < limit || loading || hasError}
            onClick={() => {
              goToNextPage(data.at(-1)?.id ?? null);
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
