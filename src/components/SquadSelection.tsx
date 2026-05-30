import { operators } from '../data/operators';
import { squadScore } from '../game/simulation';
import type { Operator } from '../game/types';
import { OperatorCard } from './OperatorCard';

type Props = {
  squad: Operator[];
  onToggleOperator: (operator: Operator) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function SquadSelection({ squad, onToggleOperator, onBack, onContinue }: Props) {
  return (
    <main className="stacked-screen">
      <section className="section-header">
        <div>
          <span className="eyebrow">Squad Selection</span>
          <h1>Choose four operators</h1>
          <p>Build a compact entry team. Squad score updates from composure, speed, and utility.</p>
        </div>
        <div className="readout">
          <span>{squad.length}/4 slots</span>
          <strong>{squadScore(squad)}</strong>
          <small>Squad score</small>
        </div>
      </section>

      <section className="operator-grid">
        {operators.map((operator) => {
          const selected = squad.some((member) => member.id === operator.id);
          const disabled = !selected && squad.length >= 4;
          return (
            <OperatorCard
              disabled={disabled}
              key={operator.id}
              onClick={() => onToggleOperator(operator)}
              operator={operator}
              selected={selected}
            />
          );
        })}
      </section>

      <div className="footer-actions">
        <button className="secondary-button" onClick={onBack} type="button">
          Back
        </button>
        <button className="primary-button" disabled={squad.length !== 4} onClick={onContinue} type="button">
          Tactical Setup
        </button>
      </div>
    </main>
  );
}
