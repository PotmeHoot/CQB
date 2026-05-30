import type { Mission } from '../game/types';

export const missions: Mission[] = [
  {
    id: 'warehouse',
    name: 'Cold Storage',
    location: 'Riverside Logistics Block',
    summary: 'A crew is holding evidence and one worker inside a segmented warehouse office.',
    objective: 'Secure the manager office and recover the drive.',
    threat: 'Three to five armed suspects with improvised barricades.',
    difficulty: 'Low',
    entryPoints: [
      {
        id: 'rollup',
        name: 'Roll-up Door',
        risk: 'Medium',
        description: 'Wide approach with direct access to storage aisles.',
      },
      {
        id: 'side',
        name: 'Side Office',
        risk: 'Low',
        description: 'Quiet entry into the admin corridor near civilians.',
      },
      {
        id: 'roof',
        name: 'Roof Ladder',
        risk: 'High',
        description: 'Slow insertion but gives early view into the objective room.',
      },
    ],
    rooms: [
      { id: 'receiving', name: 'Receiving', x: 8, y: 12, width: 28, height: 26 },
      { id: 'storage', name: 'Storage', x: 36, y: 12, width: 34, height: 44 },
      { id: 'office', name: 'Office', x: 70, y: 12, width: 22, height: 22, objective: true },
      { id: 'break', name: 'Break Room', x: 70, y: 34, width: 22, height: 22 },
      { id: 'loading', name: 'Loading Bay', x: 8, y: 38, width: 28, height: 18 },
    ],
  },
  {
    id: 'clinic',
    name: 'Night Clinic',
    location: 'South Market Medical Annex',
    summary: 'Armed suspects fled into a closed clinic with patients still inside.',
    objective: 'Evacuate civilians and detain the armed suspects.',
    threat: 'Mobile suspects, low visibility, high civilian density.',
    difficulty: 'Moderate',
    entryPoints: [
      {
        id: 'lobby',
        name: 'Front Lobby',
        risk: 'Medium',
        description: 'Shortest path to triage but visible from the waiting area.',
      },
      {
        id: 'service',
        name: 'Service Hall',
        risk: 'Low',
        description: 'Controlled access near exam rooms and utility closets.',
      },
      {
        id: 'ambulance',
        name: 'Ambulance Bay',
        risk: 'High',
        description: 'Aggressive entry close to likely suspect movement.',
      },
    ],
    rooms: [
      { id: 'lobby', name: 'Lobby', x: 7, y: 16, width: 25, height: 24 },
      { id: 'triage', name: 'Triage', x: 32, y: 16, width: 22, height: 24, objective: true },
      { id: 'exam-a', name: 'Exam A', x: 54, y: 8, width: 18, height: 20 },
      { id: 'exam-b', name: 'Exam B', x: 72, y: 8, width: 20, height: 20 },
      { id: 'pharmacy', name: 'Pharmacy', x: 54, y: 28, width: 38, height: 28, objective: true },
      { id: 'service', name: 'Service Hall', x: 7, y: 40, width: 47, height: 16 },
    ],
  },
  {
    id: 'townhouse',
    name: 'Stacked House',
    location: 'Old Quarter Row Homes',
    summary: 'A barricaded cell occupies a two-floor townhouse with unknown occupants.',
    objective: 'Clear the ground floor and secure the rear study.',
    threat: 'Prepared defenders, tight rooms, probable traps.',
    difficulty: 'High',
    entryPoints: [
      {
        id: 'front',
        name: 'Front Door',
        risk: 'High',
        description: 'Fastest route, likely watched by suspects.',
      },
      {
        id: 'rear',
        name: 'Rear Kitchen',
        risk: 'Medium',
        description: 'Controlled breach into the kitchen and stairwell.',
      },
      {
        id: 'alley',
        name: 'Alley Window',
        risk: 'Low',
        description: 'Quiet window access into the side parlor.',
      },
    ],
    rooms: [
      { id: 'foyer', name: 'Foyer', x: 10, y: 12, width: 24, height: 20 },
      { id: 'parlor', name: 'Parlor', x: 34, y: 12, width: 26, height: 24 },
      { id: 'study', name: 'Study', x: 60, y: 12, width: 28, height: 24, objective: true },
      { id: 'kitchen', name: 'Kitchen', x: 10, y: 32, width: 24, height: 24 },
      { id: 'stairs', name: 'Stairs', x: 34, y: 36, width: 18, height: 20 },
      { id: 'rear', name: 'Rear Hall', x: 52, y: 36, width: 36, height: 20 },
    ],
  },
];
