import { EventEmitter } from 'events';
import { dispatch, store } from '~StateStore/store';
import { batchActions } from 'redux-batched-actions';
import { PlayerAction } from '~StateStore/_gen/player_action.ts';
import { Cursor } from '~NoteView/types';
import { convertBarBeatToSecond } from '~utils/bar';

declare interface Player {
  on(event: 'volume', listener: (volume: number) => void): this;
  on(event: 'play', listener: () => void): this;
  on(event: 'stop', listener: () => void): this;
  on(event: 'seek', listener: (position: number) => void): this;
}

class Player extends EventEmitter {
  constructor() {
    super();

    this.togglePlay = this.togglePlay.bind(this);
  }

  private audioElement = document.createElement('audio');

  public setAudioSource(source: string) {
    this.audioElement.src = source;
  }

  public setVolume(volume: number) {
    this.audioElement.volume = volume;
    this.emit('volume', volume);
  }

  public play() {
    this.emit('play');
    if (this.audioElement.readyState > 3) {
      this.audioElement.play();
    }
    dispatch(PlayerAction.play());
  }

  public stop() {
    this.emit('stop');
    this.audioElement.pause();
    dispatch(PlayerAction.stop());
  }

  public togglePlay() {
    store.getState().playerState.isPlaying
      ? this.stop()
      : this.play();
  }

  public seek(beat: number) {
    this.emit('seek', beat);
    this.audioElement.currentTime = convertBarBeatToSecond(beat);

    if (!store.getState().playerState.isPlaying) {
      dispatch(PlayerAction.setCursor(new Cursor({ beats: beat })));
      return;
    }

    dispatch(batchActions([
      PlayerAction.setCursor(new Cursor({ beats: beat })),
      PlayerAction.play(),
    ]));
  }
}

const player = new Player();

export default player;
