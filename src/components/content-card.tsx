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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-11/12 max-w-3xl overflow-y-auto rounded bg-neutral-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title} data</h2>
          <button onClick={onClose} className="btn bg-red-700/50">
            Close
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border-b px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
