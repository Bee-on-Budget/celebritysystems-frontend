import { FaSyncAlt } from 'react-icons/fa';
import { MultiSearchBar, Button, Loading } from './';

export function DataList({
  title,
  error,
  isLoading,
  label,
  onSearch,
  onResultClick,
  onClearSearch,
  totalElements,
  children,
}) {
  if (isLoading) return <Loading />;

  return (
    <div className="my-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-dark">
          {title}
        </h1>

        {/* Actions: refresh + search in one row */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="icon"
            size="sm"
            onClick={() => window.location.reload()}
            icon={<FaSyncAlt />}
          />
          <div className="flex-1 sm:w-64">
            <MultiSearchBar
              onSearch={onSearch}
              onSelectResult={onResultClick}
              onClear={onClearSearch}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!error && totalElements === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-dark-light">{`No ${label} found with this search.`}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default DataList;
