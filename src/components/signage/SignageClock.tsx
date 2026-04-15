import { useState, useEffect } from 'preact/hooks';

export default function SignageClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div class="text-right">
      <div class="text-4xl font-mono font-bold text-white tracking-wider">
        {hours}:{minutes}
        <span class="text-2xl text-slate-400">:{seconds}</span>
      </div>
      <div class="text-sm text-slate-400 mt-1">{dateStr}</div>
    </div>
  );
}
