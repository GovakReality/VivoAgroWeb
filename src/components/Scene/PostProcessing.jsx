import React, { useEffect, useState, useRef } from 'react';
import {
  EffectComposer,
  Bloom,
  BrightnessContrast,
  HueSaturation,
  ToneMapping
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber'
import { useControls, folder } from 'leva';
import { toneMapping } from 'three/tsl';

const defaultSettings = {
  toneMapping: THREE.NoToneMapping,
  middleGrey: 0.0,
  avgLuminance: 1.0,
  maxLuminance: 0.0,
  bloomEnabled: false,
  bloomIntensity: 0.7,
  bloomThreshold: 0.55,
  bloomSmoothing: 0.4,
  brightness: 0.0,
  contrast: 0.0,
  hue: 0.0,
  saturation: 0.0
};

const PostProcessing = () => {
  const composerRef = useRef();
  const [initialSettings] = useState(defaultSettings);

  const settings = useControls({
    Renderer: folder({
      toneMapping: {
        options: {
          'No Tone Mapping': THREE.NoToneMapping,
          'Linear': THREE.LinearToneMapping,
          'Reinhard': THREE.ReinhardToneMapping,
          'Cineon': THREE.CineonToneMapping,
          'ACESFilmic': THREE.ACESFilmicToneMapping
        },
        value: initialSettings.toneMapping
      },
      middleGrey: { value: initialSettings.middleGrey, min: 0.01, max: 1, step: 0.01 },
      avgLuminance: { value: initialSettings.avgLuminance, min: 0.1, max: 3, step: 0.01 },
      maxLuminance: { value: initialSettings.maxLuminance, min: 1, max: 30, step: 0.5 }
    }),
    Bloom: folder({
      bloomEnabled: { value: initialSettings.bloomEnabled },
      bloomIntensity: { value: initialSettings.bloomIntensity, min: 0, max: 3, step: 0.01 },
      bloomThreshold: { value: initialSettings.bloomThreshold, min: 0, max: 1, step: 0.01 },
      bloomSmoothing: { value: initialSettings.bloomSmoothing, min: 0, max: 1, step: 0.01 }
    }),
    'Color Adjustments': folder({
      brightness: { value: initialSettings.brightness, min: -1, max: 1, step: 0.01 },
      contrast: { value: initialSettings.contrast, min: -1, max: 1, step: 0.01 },
      hue: { value: initialSettings.hue, min: -Math.PI, max: Math.PI, step: 0.01 },
      saturation: { value: initialSettings.saturation, min: -1, max: 1, step: 0.01 }
    })
  });

  return (
    <EffectComposer ref={composerRef} multisampling={2}>
      <ToneMapping
        blendFunction={BlendFunction.NORMAL}
        adaptive={false}
        resolution={256}
        middleGrey={settings.middleGrey}
        maxLuminance={settings.maxLuminance}
        avgLuminance={settings.avgLuminance}
        adaptationRate={0.0}
        mode={settings.toneMapping}
      />

      {settings.bloomEnabled && (
        <Bloom
          intensity={settings.bloomIntensity}
          luminanceThreshold={settings.bloomThreshold}
          luminanceSmoothing={settings.bloomSmoothing}
          height={300}
        />
      )}

      <BrightnessContrast brightness={settings.brightness} contrast={settings.contrast} />
      <HueSaturation hue={settings.hue} saturation={settings.saturation} />
    </EffectComposer>
  );
};

export default PostProcessing;