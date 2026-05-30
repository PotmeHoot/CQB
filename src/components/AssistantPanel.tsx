import { useState } from 'react';
import { parseAssistantCommand } from '../game/assistantParser';
import type { AssistantInterpretation, TacticalSettings } from '../game/types';

type Props = {
  settings: TacticalSettings;
  onApply: (patch: Partial<TacticalSettings>) => void;
};

export function AssistantPanel({ settings, onApply }: Props) {
  const [input, setInput] = useState('');
  const [interpretation, setInterpretation] = useState<AssistantInterpretation | null>(null);

  const interpret = () => {
    setInterpretation(parseAssistantCommand(input, settings));
  };

  const apply = () => {
    if (interpretation) {
      onApply(interpretation.patch);
      setInput('');
      setInterpretation(null);
    }
  };

  return (
    <section className="panel assistant-panel">
      <div className="panel-header">
        <span>AI Tactical Assistant</span>
        <small>Local parser</small>
      </div>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Example: Move slow, civilians likely, shield first, prep flash and drone."
        rows={4}
      />
      <div className="button-row">
        <button className="secondary-button" onClick={interpret} type="button">
          Interpret
        </button>
        <button className="ghost-button" onClick={() => setInterpretation(null)} type="button">
          Cancel
        </button>
      </div>
      {interpretation ? (
        <div className="interpretation">
          <strong>Interpreted command</strong>
          <ul>
            {interpretation.summary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <button className="primary-button" onClick={apply} type="button">
            Apply
          </button>
        </div>
      ) : null}
    </section>
  );
}
