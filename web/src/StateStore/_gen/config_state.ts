import { Record } from 'immutable';

export class ConfigState extends Record<{
  beatHeight: number;
  numberBoxWidth: number;
  barWidth: number;
  keys: number;
  guideBeat: number;
  bpm: number;
  defaultBarBeat: number;
  autoScroll: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
}>({
  beatHeight: 100,
  barWidth: 350,
  numberBoxWidth: 80,
  keys: 6,
  guideBeat: 0.5,
  bpm: 123,
  defaultBarBeat: 4,
  autoScroll: true,
  autoSave: false,
  autoSaveDelay: 3,
}) {};
