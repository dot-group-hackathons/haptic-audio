import { useEffect, useRef, useState } from 'react';
import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';

export function useModel() {
  const modelRef = useRef<TensorflowModel | null>(null);
  const labelsRef = useRef<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      modelRef.current = await loadTensorflowModel(require('../../assets/yamnet.tflite'), []);
      setReady(true);
    })();
  }, []);

  function classify(waveform: Float32Array) {
    if (!modelRef.current) return null;
    const outputs = modelRef.current.runSync([waveform.buffer as ArrayBuffer]);
    const scores = new Float32Array(outputs[0]);
    let best = 0;
    for (let i = 1; i < scores.length; i++) if (scores[i] > scores[best]) best = i;
    return { label: labelsRef.current[best], score: scores[best] };
  }

  return { ready, classify };
}