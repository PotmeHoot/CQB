import { useState } from 'react';
import { AfterActionReport } from './components/AfterActionReport';
import { LiveOperation } from './components/LiveOperation';
import { MissionBriefing } from './components/MissionBriefing';
import { ScreenNav } from './components/ScreenNav';
import { SquadSelection } from './components/SquadSelection';
import { TacticalSetup } from './components/TacticalSetup';
import { missions } from './data/missions';
import { defaultSettings } from './game/simulation';
import type { EntryPoint, Mission, OperationResult, Operator, ScreenId, TacticalSettings } from './game/types';

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('briefing');
  const [mission, setMission] = useState<Mission>(missions[0]);
  const [squad, setSquad] = useState<Operator[]>([]);
  const [entryPoint, setEntryPoint] = useState<EntryPoint>(missions[0].entryPoints[0]);
  const [settings, setSettings] = useState<TacticalSettings>(defaultSettings);
  const [result, setResult] = useState<OperationResult | null>(null);

  const selectMission = (nextMission: Mission) => {
    setMission(nextMission);
    setEntryPoint(nextMission.entryPoints[0]);
  };

  const toggleOperator = (operator: Operator) => {
    setSquad((current) => {
      if (current.some((member) => member.id === operator.id)) {
        return current.filter((member) => member.id !== operator.id);
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, operator];
    });
  };

  const restart = () => {
    setScreen('briefing');
    setResult(null);
    setSquad([]);
    setSettings(defaultSettings);
    setMission(missions[0]);
    setEntryPoint(missions[0].entryPoints[0]);
  };

  const completeOperation = (operationResult: OperationResult) => {
    setResult(operationResult);
    setScreen('after-action');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="brand-kicker">CQB Command</span>
          <strong>Prototype Console</strong>
        </div>
        <ScreenNav current={screen} />
      </header>

      {screen === 'briefing' ? (
        <MissionBriefing
          onContinue={() => setScreen('squad')}
          onSelectMission={selectMission}
          selectedMission={mission}
        />
      ) : null}

      {screen === 'squad' ? (
        <SquadSelection
          onBack={() => setScreen('briefing')}
          onContinue={() => setScreen('setup')}
          onToggleOperator={toggleOperator}
          squad={squad}
        />
      ) : null}

      {screen === 'setup' ? (
        <TacticalSetup
          entryPoint={entryPoint}
          mission={mission}
          onBack={() => setScreen('squad')}
          onEntryPointChange={setEntryPoint}
          onLaunch={() => setScreen('live')}
          onSettingsChange={setSettings}
          settings={settings}
        />
      ) : null}

      {screen === 'live' ? (
        <LiveOperation
          entryPoint={entryPoint}
          mission={mission}
          onComplete={completeOperation}
          settings={settings}
          squad={squad}
        />
      ) : null}

      {screen === 'after-action' && result ? (
        <AfterActionReport onRestart={restart} result={result} />
      ) : null}
    </div>
  );
}
