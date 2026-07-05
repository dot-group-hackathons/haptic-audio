import * as base64js from 'base64-js';
import { useCallback, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from "react-native";
import LiveAudioStream from 'react-native-live-audio-stream';
import { minPeakForLabel, minScoreForLabel } from './catalog';
import { useModelContext } from './ModelContext';

const WINDOW_SIZE = 15600;
const HOP_SIZE = WINDOW_SIZE >> 1; // 50% overlap so sounds aren't split across windows
const MIN_SCORE = 0.20;

// Normalize each window toward TARGET_PEAK
// Skip windows below GAIN_FLOOR. 
// MAX_GAIN caps the boost.
const TARGET_PEAK = 0.9;
const GAIN_FLOOR = 0.05;
const MAX_GAIN = 6;

async function requestMicPermission() {
  if (Platform.OS === "android") {
    const res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );

    return res === PermissionsAndroid.RESULTS.GRANTED;
  }

  const { check, PERMISSIONS, request, RESULTS } = require("react-native-permissions");
  const permission = PERMISSIONS.IOS.MICROPHONE;
  const status = await check(permission);

  if (status === RESULTS.GRANTED) return true;
  if (status === RESULTS.DENIED) {
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  }

  return false;
}

export function useClassifier(
  selectedLabels: Set<string>,
  onResult: (label: string, score: number) => void
) {
  const { ready, classify } = useModelContext();
  const bufferRef = useRef<number[]>([]);
  const selectedLabelsRef = useRef(selectedLabels);

  useEffect(() => {
    selectedLabelsRef.current = selectedLabels;
  }, [selectedLabels]);

  const start = useCallback(async() => {
    if (!ready) return;

    const granted = await requestMicPermission();
    if (!granted) return;

    bufferRef.current = [];

    LiveAudioStream.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 9, 
      bufferSize: 4096,
      wavFile: 'temp.wav',
    });

    LiveAudioStream.on('data', (base64Chunk: string) => {
      const bytes = base64js.toByteArray(base64Chunk);
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

      for (let i = 0; i + 1 < bytes.length; i += 2) {
        const sample = view.getInt16(i, true);
        bufferRef.current.push(sample / 32768);
      }

      while (bufferRef.current.length >= WINDOW_SIZE) {
        const window = new Float32Array(bufferRef.current.slice(0, WINDOW_SIZE));
        bufferRef.current = bufferRef.current.slice(HOP_SIZE);

        let peak = 0;
        for (let k = 0; k < window.length; k++) {
          const a = Math.abs(window[k]);
          if (a > peak) peak = a;
        }

        if (peak >= GAIN_FLOOR) {
          const gain = Math.min(TARGET_PEAK / peak, MAX_GAIN);
          for (let k = 0; k < window.length; k++) window[k] *= gain;
        }

        const prediction = classify(window);
        if (!prediction) continue;
        let bestLabel = "";
        let bestScore = -Infinity;
        for (let i = 0; i < prediction.scores.length; i++) {
          const label = prediction.labels[i];
          if (!selectedLabelsRef.current.has(label)) continue;
          if (peak < minPeakForLabel(label)) continue;
          
          const score = prediction.scores[i];
          if (score < (minScoreForLabel(label) ?? MIN_SCORE)) continue;
          if (score > bestScore) {
            bestScore = score;
            bestLabel = label;
          }
        }
        if (bestLabel) {
          onResult(bestLabel, bestScore);
        }
      }
    });

    LiveAudioStream.start();
  }, [ready, classify, onResult, selectedLabels]);

  const stop = useCallback(() => LiveAudioStream.stop(), []);

  return { start, stop, ready };
}