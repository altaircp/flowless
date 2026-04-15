import { useState, useEffect, useRef } from 'preact/hooks';

interface Props {
  position: number;
  status: 'on_time' | 'delayed' | 'critical';
}

export default function QueuePositionBadge({ position, status }: Props) {
  const [pulse, setPulse] = useState(false);
  const prevPosition = useRef(position);

  useEffect(() => {
    if (prevPosition.current !== position) {
      setPulse(true);
      prevPosition.current = position;
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [position]);

  const colorMap = {
    on_time: 'bg-emerald-500 text-white',
    delayed: 'bg-amber-500 text-white',
    critical: 'bg-red-500 text-white',
  };

  const ringMap = {
    on_time: 'ring-emerald-200',
    delayed: 'ring-amber-200',
    critical: 'ring-red-200',
  };

  return (
    <div
      class={`
        inline-flex items-center justify-center
        w-24 h-24 rounded-full text-4xl font-bold
        ring-4 ${ringMap[status]}
        ${colorMap[status]}
        transition-transform duration-300
        ${pulse ? 'scale-110' : 'scale-100'}
      `}
    >
      #{position}
    </div>
  );
}
