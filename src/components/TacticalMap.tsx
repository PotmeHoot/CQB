import type { Mission, RoomState } from '../game/types';

type Props = {
  mission: Mission;
  roomStates: Record<string, RoomState>;
  activeRoomId?: string;
  dimmed?: boolean;
};

export function TacticalMap({ mission, roomStates, activeRoomId, dimmed = false }: Props) {
  return (
    <div className={`map-shell ${dimmed ? 'is-dimmed' : ''}`}>
      <svg viewBox="0 0 100 68" role="img" aria-label={`${mission.name} tactical map`}>
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(105, 139, 170, 0.15)" strokeWidth="0.25" />
          </pattern>
        </defs>
        <rect width="100" height="68" fill="url(#grid)" />
        {mission.rooms.map((room) => {
          const state = roomStates[room.id] ?? (room.objective ? 'objective' : 'unknown');
          const isActive = room.id === activeRoomId;
          return (
            <g className={`map-room room-${state} ${isActive ? 'is-pulsing' : ''}`} key={room.id}>
              <rect
                x={room.x}
                y={room.y}
                width={room.width}
                height={room.height}
                rx="1"
              />
              <text x={room.x + 2} y={room.y + 5}>
                {room.name}
              </text>
              {room.objective ? (
                <circle cx={room.x + room.width - 4} cy={room.y + 4} r="1.6" className="objective-dot" />
              ) : null}
            </g>
          );
        })}
        <path d="M 6 60 H 94" className="map-route" />
        <circle cx="8" cy="60" r="1.8" className="friendly-marker" />
      </svg>
    </div>
  );
}
