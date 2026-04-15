import { useState, useEffect } from 'preact/hooks';

interface Props {
  startTime: string;
}

export default function ServiceTimer({ startTime }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startTime).getTime();

    function tick() {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = minutes >= 5 && minutes < 15;
  const isDanger = minutes >= 15;

  let colorClass = 'text-emerald-600';
  if (isWarning) colorClass = 'text-amber-600';
  if (isDanger) colorClass = 'text-red-600';

  return (
    <div class={`font-mono text-3xl font-bold tabular-nums ${colorClass} ${isDanger ? 'animate-pulse' : ''}`}>
      {display}
    </div>
  );
}
