import type { AssistantInterpretation, TacticalSettings } from './types';

const hasAny = (source: string, words: string[]) =>
  words.some((word) => source.includes(word));

export function parseAssistantCommand(
  input: string,
  current: TacticalSettings,
): AssistantInterpretation {
  const text = input.trim().toLowerCase();
  const patch: Partial<TacticalSettings> = {};
  const summary: string[] = [];

  if (!text) {
    return { patch: {}, summary: ['No command entered.'] };
  }

  if (hasAny(text, ['careful', 'cautious', 'slow', 'methodical'])) {
    patch.doctrine = 'Cautious';
    summary.push('Doctrine set to cautious room clearing.');
  }

  if (hasAny(text, ['fast', 'dynamic', 'aggressive', 'hard entry'])) {
    patch.doctrine = text.includes('aggressive') ? 'Aggressive' : 'Dynamic';
    summary.push(`Doctrine set to ${patch.doctrine?.toLowerCase()} entry tempo.`);
  }

  if (hasAny(text, ['civilian', 'civilians', 'hostage', 'patient', 'worker'])) {
    patch.civilianPriority = 'High';
    patch.roe = 'Strict';
    summary.push('Civilian priority raised and ROE tightened.');
  }

  if (text.includes('shield')) {
    patch.formation = 'Shield First';
    summary.push('Formation changed to shield first.');
  }

  if (hasAny(text, ['flash', 'flashbang', 'bang'])) {
    patch.flashbangReady = true;
    summary.push('Flashbang prep authorized for next contested entry.');
  }

  if (hasAny(text, ['drone', 'recon', 'scout'])) {
    patch.droneRecon = true;
    summary.push('Drone reconnaissance enabled before unknown rooms.');
  }

  if (hasAny(text, ['fall back', 'fallback', 'retreat', 'pull back'])) {
    patch.fallbackAuthorized = true;
    summary.push('Fallback command authorized for critical pressure.');
  }

  if (summary.length === 0) {
    summary.push(`No rule matched. Current doctrine remains ${current.doctrine}.`);
  }

  return { patch, summary };
}
