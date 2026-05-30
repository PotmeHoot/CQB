import { useEffect, useMemo, useState } from 'react';
import { focusChoices, openingEvents } from '../game/simulation';
import type {
  EntryPoint,
  FocusChoice,
  FocusState,
  Mission,
  OperationEvent,
  OperationResult,
  Operator,
  RoomState,
  TacticalSettings,
} from '../game/types';
import { TacticalMap } from './TacticalMap';

type Props = {
  mission: Mission;
  squad: Operator[];
  entryPoint: EntryPoint;
  settings: TacticalSettings;
  onComplete: (result: OperationResult) => void;
};

type Stage = {
  id: string;
  progress: number;
  type: OperationEvent['type'];
  roomIndex: number;
  state: RoomState;
  message: string;
  critical?: boolean;
};

const stages: Stage[] = [
  {
    id: 'entry',
    progress: 12,
    type: 'friendly',
    roomIndex: 0,
    state: 'secured',
    message: 'Entry team has crossed the threshold and locked the first room.',
  },
  {
    id: 'first-contact',
    progress: 31,
    type: 'critical',
    roomIndex: 1,
    state: 'critical',
    message: 'Contact at a blind doorway. Command Focus available.',
    critical: true,
  },
  {
    id: 'mid-clear',
    progress: 48,
    type: 'friendly',
    roomIndex: 1,
    state: 'secured',
    message: 'Second sector secured. Stack is reorganizing.',
  },
  {
    id: 'objective-contact',
    progress: 66,
    type: 'critical',
    roomIndex: 2,
    state: 'critical',
    message: 'Movement near the objective room. Command Focus available.',
    critical: true,
  },
  {
    id: 'objective',
    progress: 82,
    type: 'objective',
    roomIndex: 2,
    state: 'secured',
    message: 'Objective room is secured and evidence is under control.',
  },
  {
    id: 'final',
    progress: 94,
    type: 'friendly',
    roomIndex: 3,
    state: 'secured',
    message: 'Final sweep underway. No further organized resistance.',
  },
];

const tempoStep: Record<TacticalSettings['doctrine'], number> = {
  Cautious: 1.3,
  Dynamic: 1.9,
  Aggressive: 2.3,
};

function formatTime(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function LiveOperation({ mission, squad, entryPoint, settings, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [log, setLog] = useState<OperationEvent[]>(() => [
    ...openingEvents(mission, settings),
    {
      id: 'entry-point',
      time: 0,
      type: 'info',
      message: `Entry point selected: ${entryPoint.name}.`,
    },
  ]);
  const [roomStates, setRoomStates] = useState<Record<string, RoomState>>(() =>
    Object.fromEntries(mission.rooms.map((room) => [room.id, room.objective ? 'objective' : 'unknown'])),
  );
  const [focus, setFocus] = useState<FocusState | null>(null);
  const [firedStages, setFiredStages] = useState<string[]>([]);
  const [risk, setRisk] = useState(settings.doctrine === 'Aggressive' ? 1 : 0);
  const [now, setNow] = useState(Date.now());
  const [completed, setCompleted] = useState(false);

  const nextStage = useMemo(
    () => stages.find((stage) => !firedStages.includes(stage.id)),
    [firedStages],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const focusMultiplier = focus ? 0.2 : 1;
      setElapsed((value) => value + 1);
      setProgress((value) => Math.min(100, value + tempoStep[settings.doctrine] * focusMultiplier));
    }, 850);

    return () => window.clearInterval(interval);
  }, [focus, settings.doctrine]);

  useEffect(() => {
    if (!nextStage || progress < nextStage.progress) {
      return;
    }

    const room = mission.rooms[nextStage.roomIndex % mission.rooms.length];
    const event: OperationEvent = {
      id: nextStage.id,
      time: elapsed,
      type: nextStage.type,
      roomId: room.id,
      message: `${room.name}: ${nextStage.message}`,
    };

    setFiredStages((items) => [...items, nextStage.id]);
    setRoomStates((states) => ({ ...states, [room.id]: nextStage.state }));
    setLog((items) => [event, ...items]);

    if (nextStage.critical) {
      const durationSeconds = nextStage.id === 'first-contact' ? 6 : 8;
      setFocus({
        eventId: event.id,
        roomId: room.id,
        roomName: room.name,
        prompt: event.message,
        expiresAt: Date.now() + durationSeconds * 1000,
        choices: focusChoices(settings),
      });
    }
  }, [elapsed, focus, mission.rooms, nextStage, progress, settings]);

  const resolveFocus = (choice?: FocusChoice) => {
    if (!focus) {
      return;
    }

    const autoResult = `No command issued. Team continues ${settings.doctrine.toLowerCase()} doctrine.`;
    const message = choice ? choice.result : autoResult;
    const roomState: RoomState = choice?.id === 'fallback' ? 'contact' : 'secured';

    setLog((items) => [
      {
        id: `focus-${focus.eventId}-${choice?.id ?? 'timeout'}`,
        time: elapsed,
        type: choice ? 'system' : 'info',
        roomId: focus.roomId,
        message,
      },
      ...items,
    ]);
    setRoomStates((states) => ({ ...states, [focus.roomId]: roomState }));

    if (!choice || choice.id === 'flash-push' || settings.doctrine === 'Aggressive') {
      setRisk((value) => value + (choice?.id === 'flash-push' && settings.flashbangReady ? 0 : 1));
    }

    setFocus(null);
  };

  useEffect(() => {
    if (focus && now >= focus.expiresAt) {
      resolveFocus();
    }
  });

  useEffect(() => {
    if (completed || progress < 100) {
      return;
    }

    setCompleted(true);
    const securedRooms = Object.values(roomStates).filter((state) => state === 'secured').length;
    const injuries = Math.min(3, risk + (settings.roe === 'Weapons Free' ? 1 : 0));
    const success = securedRooms >= Math.min(4, mission.rooms.length) && injuries < 3;

    onComplete({
      mission,
      squad,
      settings,
      success,
      elapsed,
      securedRooms,
      injuries,
      civiliansSafe: settings.roe === 'Strict' || settings.civilianPriority === 'High',
      evidenceRecovered: success,
      log,
    });
  }, [completed, elapsed, log, mission, onComplete, progress, risk, roomStates, settings, squad]);

  const countdown = focus ? Math.max(0, Math.ceil((focus.expiresAt - now) / 1000)) : 0;

  return (
    <main className="live-grid">
      <section className="live-map-panel">
        <div className="live-header">
          <div>
            <span className="eyebrow">Live Operation</span>
            <h1>{mission.name}</h1>
          </div>
          <div className="live-readouts">
            <span>{formatTime(elapsed)}</span>
            <span>{Math.round(progress)}%</span>
            <span>{focus ? '20% speed' : settings.doctrine}</span>
          </div>
        </div>
        <TacticalMap
          activeRoomId={focus?.roomId}
          dimmed={Boolean(focus)}
          mission={mission}
          roomStates={roomStates}
        />
      </section>

      <aside className="panel event-panel">
        <div className="panel-header">
          <span>Event Log</span>
          <small>{entryPoint.name}</small>
        </div>
        <div className="event-log">
          {log.map((event) => (
            <article className={`event-item event-${event.type}`} key={event.id}>
              <time>{formatTime(event.time)}</time>
              <p>{event.message}</p>
            </article>
          ))}
        </div>
      </aside>

      {focus ? (
        <section className="focus-overlay" aria-live="assertive">
          <div className="focus-card">
            <div className="focus-topline">
              <span>Command Focus</span>
              <strong>{countdown}</strong>
            </div>
            <h2>{focus.roomName}</h2>
            <p>{focus.prompt}</p>
            <div className="focus-choice-grid">
              {focus.choices.map((choice) => (
                <button key={choice.id} onClick={() => resolveFocus(choice)} type="button">
                  <strong>{choice.label}</strong>
                  <span>{choice.detail}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
