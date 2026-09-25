const StackedBarChart = ({ data, height = 180 }) => {
  if (!data.length) return <div className="h-48 flex items-center justify-center text-stone-400">No data</div>;

  const maxTotal = Math.max(...data.map((d) => d.completed + d.pending + d.cancelled), 1);
  const barWidth = Math.max(20, 700 / data.length);
  const gap = 4;

  const colors = {
    completed: "hsl(145, 65%, 42%)",
    pending: "hsl(38, 92%, 50%)",
    cancelled: "hsl(0, 75%, 55%)",
  };

  return (
    <div className="space-y-2">
      <div className={`flex items-end justify-center gap-1 h-[${height}px] px-2`} style={{ width: "100%" }}>
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center" style={{ width: barWidth + gap }}>
            <div className="flex flex-col items-center w-full" style={{ height: ((d.completed + d.pending + d.cancelled) / maxTotal) * (height - 40) }}>
              {d.completed > 0 && (
                <div
                  className="w-full rounded-t"
                  style={{
                    height: (d.completed / maxTotal) * (height - 40),
                    backgroundColor: colors.completed,
                    minHeight: 2,
                  }}
                  title={`Completed: ${d.completed}`}
                />
              )}
              {d.pending > 0 && (
                <div
                  className="w-full"
                  style={{
                    height: (d.pending / maxTotal) * (height - 40),
                    backgroundColor: colors.pending,
                    minHeight: 2,
                  }}
                  title={`Pending: ${d.pending}`}
                />
              )}
              {d.cancelled > 0 && (
                <div
                  className="w-full rounded-b"
                  style={{
                    height: (d.cancelled / maxTotal) * (height - 40),
                    backgroundColor: colors.cancelled,
                    minHeight: 2,
                  }}
                  title={`Cancelled: ${d.cancelled}`}
                />
              )}
            </div>
            <span className={`text-[10px] text-stone-400 dark:text-stone-500 mt-1 text-center w-[${barWidth}px] truncate`}>{d.label.slice(0, 10)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6 text-xs text-stone-600 dark:text-stone-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: colors.completed }} /> Completed</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: colors.pending }} /> Pending</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: colors.cancelled }} /> Cancelled</span>
      </div>
    </div>
  );
};

export default StackedBarChart;