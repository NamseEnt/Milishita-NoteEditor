import { EventEmitter } from 'events';
import ws from 'ws';
import { WebsocketEvent } from './websocketEvents';
import { ElectronMigration } from '~ElectronMigration/ElectronMigration';

export declare interface WebsocketManager {
  on(event: 'play', listener: Function): this;
  on(event: 'stop', listener: Function): this;
  on(event: 'seek', listener: (millisecond: number) => void): this;
}

export class WebsocketManager extends EventEmitter {
  constructor() {
    super();
    ElectronMigration.websocketServer.on('connection', connection => {
      console.log(`Websocket client connected`);
      this.connections.add(connection);
      connection.on('message', data => this.handleMessage(data));
      connection.on('close', () => this.connections.delete(connection));
      connection.on('error', error => console.error(error));
    });

    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.seek = this.seek.bind(this);
  }

  private connections: Set<ws> = new Set();

  private handleMessage(data: ws.Data): void {
    if (typeof data !== 'string') {
      return;
    }
    const event = JSON.parse(data) as WebsocketEvent.Base;

    switch (event.type) {
      case 'play': {
        this.emit('play')
      } break;

      case 'stop': {
        this.emit('stop')
      } break;

      case 'seek': {
        const seekEvent = event as WebsocketEvent.Seek;
        const position = seekEvent.millisecond;
        this.emit('seek', position)
      } break;

      default:
        break;
    }
  }

  public play() {
    const playEvent: WebsocketEvent.Play = { type: 'play' };
    this.connections.forEach(connection => connection.send(JSON.stringify(playEvent)));
  }

  public stop() {
    const stopEvent: WebsocketEvent.Stop = { type: 'stop' };
    this.connections.forEach(connection => connection.send(JSON.stringify(stopEvent)));
  }

  public seek(millisecond: number) {
    const seekEvent: WebsocketEvent.Seek = {
      type: 'seek',
      millisecond,
    };
    this.connections.forEach(connection => connection.send(JSON.stringify(seekEvent)));
  }
}
