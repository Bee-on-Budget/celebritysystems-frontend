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
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="flex items-center justify-end gap-2 flex-wrap">
          <Button
            variant='icon'
            size='sm'
            onClick={() => window.location.reload()}
            icon={<FaSyncAlt />}>
          </Button>
          <div className="w-full sm:w-64">
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
          <p className="text-dark-light">
            {`No ${label} found with this search.`}
          </p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default DataList;
