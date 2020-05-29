import { Record } from 'immutable';

export class ConfigState extends Record<{
  beatHeight: number;
  numberBoxWidth: number;
  barWidth: number;
  keys: number;
  guideBeat: number;
  bpm: number;
  defaultBarBeat: number;
}>({
  beatHeight: 100,
  barWidth: 350,
  numberBoxWidth: 80,
  keys: 6,
  guideBeat: 0.5,
  bpm: 123,
  defaultBarBeat: 4,
}) {};
