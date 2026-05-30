import type { Operator } from '../game/types';

type Props = {
  operator: Operator;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function OperatorCard({ operator, selected = false, disabled = false, onClick }: Props) {
  return (
    <button
      className={`operator-card ${selected ? 'is-selected' : ''}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <div className="operator-portrait" aria-hidden="true">
        <div className="silhouette-head" />
        <div className="silhouette-body" />
        <span>{operator.portraitLabel}</span>
      </div>
      <div className="operator-meta">
        <div>
          <strong>{operator.callsign}</strong>
          <span>{operator.name}</span>
        </div>
        <small>{operator.role}</small>
      </div>
      <p>{operator.bio}</p>
      <div className="stat-grid">
        <span>COM {operator.composure}</span>
        <span>SPD {operator.speed}</span>
        <span>UTL {operator.utility}</span>
      </div>
    </button>
  );
}
