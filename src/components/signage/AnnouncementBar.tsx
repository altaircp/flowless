interface Props {
  branchName: string;
  avgWait: number;
}

export default function AnnouncementBar({ branchName, avgWait }: Props) {
  const messages = [
    `Welcome to ${branchName}. Average wait time: ${avgWait} minutes.`,
    'Download the FlowLess app to join the queue remotely.',
    'Remember to have your ID ready for account services.',
  ];

  const text = messages.join('     \u2022     ');
  // Double the text for seamless loop
  const marqueeContent = `${text}     \u2022     ${text}`;

  return (
    <div class="w-full bg-slate-800 border-t border-slate-700 overflow-hidden">
      <div class="marquee-track py-3 text-lg text-slate-300 whitespace-nowrap">
        <span class="inline-block marquee-content">{marqueeContent}</span>
      </div>
      <style>{`
        .marquee-track {
          display: flex;
          width: 100%;
          overflow: hidden;
        }
        .marquee-content {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
