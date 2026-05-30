import type {
  Doctrine,
  FocusChoice,
  Mission,
  OperationEvent,
  Operator,
  TacticalSettings,
} from './types';

export const defaultSettings: TacticalSettings = {
  doctrine: 'Cautious',
  formation: 'Standard Stack',
  roe: 'Balanced',
  civilianPriority: 'Normal',
  droneRecon: false,
  flashbangReady: true,
  fallbackAuthorized: false,
};

export function squadScore(squad: Operator[]) {
  if (squad.length === 0) {
    return 0;
  }

  const total = squad.reduce(
    (sum, operator) =>
      sum + operator.composure * 0.4 + operator.speed * 0.25 + operator.utility * 0.35,
    0,
  );
  return Math.round(total / squad.length);
}

export function doctrineTempo(doctrine: Doctrine) {
  if (doctrine === 'Cautious') return 'Slow';
  if (doctrine === 'Dynamic') return 'Fast';
  return 'High risk';
}

export function openingEvents(
  mission: Mission,
  settings: TacticalSettings,
): OperationEvent[] {
  return [
    {
      id: 'start',
      time: 0,
      type: 'system',
      message: `Operation launched at ${mission.location}.`,
    },
    {
      id: 'doctrine',
      time: 0,
      type: 'info',
      message: `${settings.doctrine} doctrine, ${settings.formation.toLowerCase()}, ${settings.roe.toLowerCase()} ROE.`,
    },
  ];
}

export function focusChoices(settings: TacticalSettings): FocusChoice[] {
  const choices: FocusChoice[] = [
    {
      id: 'hold-scan',
      label: 'Hold and scan',
      detail: 'Pause the stack and force a deeper corner read.',
      result: 'Team holds, scans angles, and clears the immediate threat at a slower tempo.',
    },
    {
      id: 'flash-push',
      label: settings.flashbangReady ? 'Flash and push' : 'Commit dynamic push',
      detail: settings.flashbangReady
        ? 'Use the staged flashbang before entering.'
        : 'Enter quickly without a flashbang advantage.',
      result: settings.flashbangReady
        ? 'Flash detonates cleanly and the room is suppressed.'
        : 'The push gains ground but increases injury risk.',
    },
    {
      id: 'shield-peel',
      label: 'Shield peel',
      detail: 'Move the shield to the front and peel the stack across the threshold.',
      result: 'Shield takes lead and the team stabilizes the doorway.',
    },
  ];

  if (settings.droneRecon) {
    choices.push({
      id: 'drone-peek',
      label: 'Drone peek',
      detail: 'Burn time for a fast drone confirmation.',
      result: 'Drone feed marks the threat and the team enters with better information.',
    });
  }

  if (settings.fallbackAuthorized) {
    choices.push({
      id: 'fallback',
      label: 'Fallback and reset',
      detail: 'Give up tempo to preserve the squad and re-approach.',
      result: 'Team falls back, resets the stack, and avoids a bad threshold fight.',
    });
  }

  return choices.slice(0, 5);
}
