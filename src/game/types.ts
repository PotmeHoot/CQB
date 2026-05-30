export type ScreenId =
  | 'briefing'
  | 'squad'
  | 'setup'
  | 'live'
  | 'after-action';

export type OperatorRole =
  | 'Point'
  | 'Shield'
  | 'Breacher'
  | 'Marksman'
  | 'Tech'
  | 'Medic';

export type Operator = {
  id: string;
  name: string;
  callsign: string;
  role: OperatorRole;
  bio: string;
  composure: number;
  speed: number;
  utility: number;
  portraitLabel: string;
};

export type EntryPoint = {
  id: string;
  name: string;
  risk: 'Low' | 'Medium' | 'High';
  description: string;
};

export type RoomState = 'unknown' | 'contact' | 'critical' | 'secured' | 'objective';

export type MapRoom = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  objective?: boolean;
};

export type Mission = {
  id: string;
  name: string;
  location: string;
  summary: string;
  objective: string;
  threat: string;
  difficulty: 'Low' | 'Moderate' | 'High';
  entryPoints: EntryPoint[];
  rooms: MapRoom[];
};

export type Doctrine = 'Cautious' | 'Dynamic' | 'Aggressive';
export type Formation = 'Standard Stack' | 'Shield First' | 'Split Pair';
export type Roe = 'Strict' | 'Balanced' | 'Weapons Free';

export type TacticalSettings = {
  doctrine: Doctrine;
  formation: Formation;
  roe: Roe;
  civilianPriority: 'Normal' | 'High';
  droneRecon: boolean;
  flashbangReady: boolean;
  fallbackAuthorized: boolean;
};

export type AssistantInterpretation = {
  summary: string[];
  patch: Partial<TacticalSettings>;
};

export type OperationEvent = {
  id: string;
  time: number;
  type: 'info' | 'friendly' | 'threat' | 'objective' | 'critical' | 'system';
  roomId?: string;
  message: string;
};

export type FocusChoice = {
  id: string;
  label: string;
  detail: string;
  result: string;
};

export type FocusState = {
  eventId: string;
  roomId: string;
  roomName: string;
  prompt: string;
  expiresAt: number;
  choices: FocusChoice[];
};

export type OperationResult = {
  mission: Mission;
  squad: Operator[];
  settings: TacticalSettings;
  success: boolean;
  elapsed: number;
  securedRooms: number;
  injuries: number;
  civiliansSafe: boolean;
  evidenceRecovered: boolean;
  log: OperationEvent[];
};
