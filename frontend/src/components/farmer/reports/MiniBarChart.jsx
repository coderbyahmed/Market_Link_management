const MiniBarChart = ({ data, color = "hsl(220, 70%, 50%)", maxValue, height = 150, labelFormatter = (v) => v, showLabels = true }) => {
  if (!data.length) return <div className="h-40 flex items-center justify-center text-stone-400">No data</div>;

  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.max(12, 600 / data.length);
  const gap = 4;

  return (
    <div className={`flex items-end justify-center gap-1 h-[${height}px] px-2`} style={{ width: "100%" }}>
      {data.map((d, i) => {
        const barHeight = Math.max(2, (d.value / max) * (height - 30));
        return (
          <div key={i} className="flex flex-col items-center" style={{ width: barWidth + gap }}>
            {showLabels && d.value > 0 && (
              <span className="text-xs text-stone-500 dark:text-stone-400 mb-1">{labelFormatter(d.value)}</span>
            )}
            <div
              className="w-full rounded-t transition-all hover:opacity-80"
              style={{
                height: barHeight,
                backgroundColor: color,
                minHeight: d.value > 0 ? 2 : 0,
              }}
              title={`${d.label}: ${labelFormatter(d.value)}`}
            />
            <span className={`text-[10px] text-stone-400 dark:text-stone-500 mt-1 text-center w-[${barWidth}px] truncate`}>{d.label.slice(0, 10)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MiniBarChart;