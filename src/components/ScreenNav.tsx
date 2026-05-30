import type { ScreenId } from '../game/types';

type Props = {
  current: ScreenId;
};

const steps: Array<{ id: ScreenId; label: string }> = [
  { id: 'briefing', label: 'Briefing' },
  { id: 'squad', label: 'Squad' },
  { id: 'setup', label: 'Setup' },
  { id: 'live', label: 'Live Ops' },
  { id: 'after-action', label: 'AAR' },
];

export function ScreenNav({ current }: Props) {
  const activeIndex = steps.findIndex((step) => step.id === current);

  return (
    <nav className="screen-nav" aria-label="Operation flow">
      {steps.map((step, index) => (
        <div
          className={`nav-step ${index <= activeIndex ? 'is-active' : ''} ${
            step.id === current ? 'is-current' : ''
          }`}
          key={step.id}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          {step.label}
        </div>
      ))}
    </nav>
  );
}
