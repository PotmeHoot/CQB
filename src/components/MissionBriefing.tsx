import { missions } from '../data/missions';
import type { Mission } from '../game/types';

type Props = {
  selectedMission: Mission;
  onSelectMission: (mission: Mission) => void;
  onContinue: () => void;
};

export function MissionBriefing({ selectedMission, onSelectMission, onContinue }: Props) {
  return (
    <main className="screen-grid briefing-screen">
      <section className="hero-panel background-briefing">
        <div>
          <span className="eyebrow">Mission Briefing</span>
          <h1>{selectedMission.name}</h1>
          <p>{selectedMission.summary}</p>
        </div>
        <button className="primary-button" onClick={onContinue} type="button">
          Select Squad
        </button>
      </section>

      <aside className="panel">
        <div className="panel-header">
          <span>Mission Packet</span>
          <small>{selectedMission.difficulty}</small>
        </div>
        <dl className="brief-list">
          <div>
            <dt>Location</dt>
            <dd>{selectedMission.location}</dd>
          </div>
          <div>
            <dt>Objective</dt>
            <dd>{selectedMission.objective}</dd>
          </div>
          <div>
            <dt>Threat</dt>
            <dd>{selectedMission.threat}</dd>
          </div>
        </dl>
      </aside>

      <section className="mission-list">
        {missions.map((mission) => (
          <button
            className={`mission-card ${mission.id === selectedMission.id ? 'is-selected' : ''}`}
            key={mission.id}
            onClick={() => onSelectMission(mission)}
            type="button"
          >
            <span>{mission.difficulty}</span>
            <strong>{mission.name}</strong>
            <small>{mission.location}</small>
          </button>
        ))}
      </section>
    </main>
  );
}
