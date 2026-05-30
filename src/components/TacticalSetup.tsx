import { gadgets, primaryWeapons, secondaryWeapons } from '../data/loadouts';
import type { EntryPoint, Mission, TacticalSettings } from '../game/types';
import { AssistantPanel } from './AssistantPanel';

type Props = {
  mission: Mission;
  entryPoint: EntryPoint;
  settings: TacticalSettings;
  onEntryPointChange: (entryPoint: EntryPoint) => void;
  onSettingsChange: (settings: TacticalSettings) => void;
  onBack: () => void;
  onLaunch: () => void;
};

export function TacticalSetup({
  mission,
  entryPoint,
  settings,
  onEntryPointChange,
  onSettingsChange,
  onBack,
  onLaunch,
}: Props) {
  const update = (patch: Partial<TacticalSettings>) => onSettingsChange({ ...settings, ...patch });

  return (
    <main className="setup-grid">
      <section className="panel">
        <div className="panel-header">
          <span>Entry Point</span>
          <small>{mission.name}</small>
        </div>
        <div className="entry-list">
          {mission.entryPoints.map((point) => (
            <button
              className={`entry-card ${entryPoint.id === point.id ? 'is-selected' : ''}`}
              key={point.id}
              onClick={() => onEntryPointChange(point)}
              type="button"
            >
              <strong>{point.name}</strong>
              <span>{point.risk} risk</span>
              <p>{point.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <span>Doctrine</span>
          <small>Command settings</small>
        </div>
        <label>
          Tempo
          <select value={settings.doctrine} onChange={(event) => update({ doctrine: event.target.value as TacticalSettings['doctrine'] })}>
            <option>Cautious</option>
            <option>Dynamic</option>
            <option>Aggressive</option>
          </select>
        </label>
        <label>
          Formation
          <select value={settings.formation} onChange={(event) => update({ formation: event.target.value as TacticalSettings['formation'] })}>
            <option>Standard Stack</option>
            <option>Shield First</option>
            <option>Split Pair</option>
          </select>
        </label>
        <label>
          Rules of engagement
          <select value={settings.roe} onChange={(event) => update({ roe: event.target.value as TacticalSettings['roe'] })}>
            <option>Strict</option>
            <option>Balanced</option>
            <option>Weapons Free</option>
          </select>
        </label>
        <div className="toggle-grid">
          <label>
            <input
              checked={settings.civilianPriority === 'High'}
              onChange={(event) => update({ civilianPriority: event.target.checked ? 'High' : 'Normal' })}
              type="checkbox"
            />
            High civilian priority
          </label>
          <label>
            <input
              checked={settings.droneRecon}
              onChange={(event) => update({ droneRecon: event.target.checked })}
              type="checkbox"
            />
            Use drone
          </label>
          <label>
            <input
              checked={settings.flashbangReady}
              onChange={(event) => update({ flashbangReady: event.target.checked })}
              type="checkbox"
            />
            Flashbang ready
          </label>
          <label>
            <input
              checked={settings.fallbackAuthorized}
              onChange={(event) => update({ fallbackAuthorized: event.target.checked })}
              type="checkbox"
            />
            Fallback authorized
          </label>
        </div>
      </section>

      <AssistantPanel settings={settings} onApply={update} />

      <section className="panel loadout-panel">
        <div className="panel-header">
          <span>Loadout Cards</span>
          <small>Team pool</small>
        </div>
        <div className="loadout-columns">
          {[primaryWeapons, secondaryWeapons, gadgets].map((items, index) => (
            <div className="loadout-column" key={index}>
              {items.map((item) => (
                <div className="loadout-card" key={item.id}>
                  <div className="weapon-glyph" />
                  <strong>{item.name}</strong>
                  <span>{item.trait}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="footer-actions setup-actions">
        <button className="secondary-button" onClick={onBack} type="button">
          Back
        </button>
        <button className="primary-button" onClick={onLaunch} type="button">
          Launch Operation
        </button>
      </div>
    </main>
  );
}
