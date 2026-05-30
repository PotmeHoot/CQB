import type { OperationResult } from '../game/types';

type Props = {
  result: OperationResult;
  onRestart: () => void;
};

function formatTime(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function AfterActionReport({ result, onRestart }: Props) {
  return (
    <main className="aar-grid">
      <section className="hero-panel background-aar">
        <div>
          <span className="eyebrow">After Action Report</span>
          <h1>{result.success ? 'Mission secured' : 'Mission incomplete'}</h1>
          <p>{result.mission.name} concluded in {formatTime(result.elapsed)} with {result.securedRooms} rooms secured.</p>
        </div>
        <button className="primary-button" onClick={onRestart} type="button">
          New Operation
        </button>
      </section>

      <section className="panel score-panel">
        <div className="panel-header">
          <span>Outcome</span>
          <small>{result.settings.doctrine}</small>
        </div>
        <div className="score-grid">
          <div>
            <strong>{result.injuries}</strong>
            <span>Injuries</span>
          </div>
          <div>
            <strong>{result.civiliansSafe ? 'Yes' : 'No'}</strong>
            <span>Civilians safe</span>
          </div>
          <div>
            <strong>{result.evidenceRecovered ? 'Yes' : 'No'}</strong>
            <span>Evidence</span>
          </div>
          <div>
            <strong>{result.securedRooms}</strong>
            <span>Rooms secured</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span>Squad</span>
          <small>{result.squad.length} operators</small>
        </div>
        <div className="aar-squad">
          {result.squad.map((operator) => (
            <div key={operator.id}>
              <strong>{operator.callsign}</strong>
              <span>{operator.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel aar-log-panel">
        <div className="panel-header">
          <span>Timeline</span>
          <small>Latest first</small>
        </div>
        <div className="event-log">
          {result.log.map((event) => (
            <article className={`event-item event-${event.type}`} key={event.id}>
              <time>{formatTime(event.time)}</time>
              <p>{event.message}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
