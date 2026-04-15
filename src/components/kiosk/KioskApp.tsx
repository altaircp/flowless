import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import type { Service, Queue } from '../../data/types';
import KioskIdleScreen from './KioskIdleScreen';
import KioskServicePicker from './KioskServicePicker';
import KioskConfirm from './KioskConfirm';

type Screen = 'idle' | 'service_picker' | 'confirm';

interface TicketInfo {
  ticketNumber: string;
  serviceName: string;
  estimatedWait: number;
  position: number;
}

interface Props {
  branchId: string;
  branchName: string;
  services: string;
  queues: string;
}

const INACTIVITY_TIMEOUT = 30000; // 30 seconds

export default function KioskApp({ branchId: _branchId, branchName, services: servicesJson, queues: queuesJson }: Props) {
  const services: Service[] = JSON.parse(servicesJson);
  const queues: Queue[] = JSON.parse(queuesJson);

  const [screen, setScreen] = useState<Screen>('idle');
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const inactivityTimer = useRef<number | null>(null);

  const resetToIdle = useCallback(() => {
    setScreen('idle');
    setTicketInfo(null);
  }, []);

  // Inactivity timeout for service_picker screen
  useEffect(() => {
    if (screen === 'service_picker') {
      const resetTimer = () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        inactivityTimer.current = window.setTimeout(resetToIdle, INACTIVITY_TIMEOUT);
      };

      resetTimer();

      const events = ['touchstart', 'mousedown', 'mousemove'] as const;
      events.forEach((e) => document.addEventListener(e, resetTimer));

      return () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        events.forEach((e) => document.removeEventListener(e, resetTimer));
      };
    }
  }, [screen, resetToIdle]);

  const handleStart = () => {
    setScreen('service_picker');
  };

  const handleServiceSelect = (serviceId: string) => {
    // Find the queue for this service
    const queue = queues.find((q) => q.serviceId === serviceId);
    const service = services.find((s) => s.id === serviceId);

    if (!queue || !service) return;

    // Generate a mock ticket
    const nextNumber = queue.currentNumber + 1;
    const ticketNumber = `${queue.prefix}-${String(nextNumber).padStart(3, '0')}`;
    const position = queue.activeTicketIds.length + 1;
    const estimatedWait = position * queue.averageServiceMinutes;

    setTicketInfo({
      ticketNumber,
      serviceName: service.name,
      estimatedWait,
      position,
    });
    setScreen('confirm');
  };

  if (screen === 'idle') {
    return <KioskIdleScreen branchName={branchName} onStart={handleStart} />;
  }

  if (screen === 'service_picker') {
    return (
      <KioskServicePicker
        services={services}
        queues={queues}
        onSelect={handleServiceSelect}
      />
    );
  }

  if (screen === 'confirm' && ticketInfo) {
    return (
      <KioskConfirm
        ticketNumber={ticketInfo.ticketNumber}
        serviceName={ticketInfo.serviceName}
        estimatedWait={ticketInfo.estimatedWait}
        position={ticketInfo.position}
        onReset={resetToIdle}
      />
    );
  }

  return null;
}
