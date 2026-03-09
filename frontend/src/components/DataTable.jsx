export default function DataTable({ columns, data, emptyMessage = 'No data', renderRow }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/80">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium text-slate-300">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (renderRow ? renderRow(row, i) : (
                <tr key={row.id ?? i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-300">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              )))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
