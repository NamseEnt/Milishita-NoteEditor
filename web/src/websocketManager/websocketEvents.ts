export namespace WebsocketEvent {
  export const eventTypes = [
    'play',
    'stop',
    'seek',
  ] as const;

  export type EventType = typeof eventTypes[number]

  export interface Base {
    type: EventType;
  }

  export interface Play extends Base {
    type: 'play';
  }

  export interface Stop extends Base {
    type: 'stop';
  }

  export interface Seek extends Base {
    type: 'seek';
    millisecond: number;
  }
}
