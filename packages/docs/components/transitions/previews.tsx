import type { PlayerRef } from "@remotion/player";
import { Player } from "@remotion/player";
import type { TransitionPresentation } from "@remotion/transitions";
import { springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import type { SlideDirection } from "@remotion/transitions/slide";
import { slide } from "@remotion/transitions/slide";
import type { WipeDirection } from "@remotion/transitions/wipe";
import { wipe } from "@remotion/transitions/wipe";
import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { customPresentation } from "./custom-transition";

export const PresentationPreview: React.FC<{
  effect: TransitionPresentation<Record<string, unknown>>;
  durationRestThreshold: number;
}> = ({ effect, durationRestThreshold }) => {
  const ref = useRef<PlayerRef>(null);

  useEffect(() => {
    const { current } = ref;
    if (!current) {
      return;
    }

    const callback = () => {
      current?.seekTo(0);
      current?.play();
    };

    current?.getContainerNode()?.addEventListener("pointerenter", callback);

    return () => {
      current
        ?.getContainerNode()
        ?.removeEventListener("pointerenter", callback);
    };
  }, []);

  return (
    <Player
      ref={ref}
      component={SampleTransition}
      compositionHeight={280}
      compositionWidth={540}
      durationInFrames={60}
      fps={30}
      numberOfSharedAudioTags={0}
      style={{
        height: 60,
        borderRadius: 6,
      }}
      inputProps={{
        effect,
        durationRestThreshold,
      }}
    />
  );
};

const SceneA: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0b84f3",
        fontFamily: "sans-serif",
        fontWeight: 900,
        color: "white",
        fontSize: 100,
      }}
    >
      A
    </AbsoluteFill>
  );
};

const SceneB: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "pink",
        fontFamily: "sans-serif",
        fontWeight: 900,
        color: "white",
        fontSize: 100,
      }}
    >
      B
    </AbsoluteFill>
  );
};

export const SampleTransition: React.FC<{
  effect: TransitionPresentation<Record<string, unknown>>;
  durationRestThreshold: number;
}> = ({ durationRestThreshold, effect }) => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={75}>
        <SceneA />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={effect}
        timing={springTiming({
          config: {
            damping: 200,
          },
          durationInFrames: 60,
          durationRestThreshold,
        })}
      />
      <TransitionSeries.Sequence durationInFrames={90}>
        <SceneB />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export const FadeDemo: React.FC = () => {
  return <SampleTransition effect={fade()} durationRestThreshold={0.001} />;
};

export const SlideDemo: React.FC<{
  direction: SlideDirection;
}> = ({ direction }) => {
  return (
    <SampleTransition
      effect={slide({ direction })}
      durationRestThreshold={0.001}
    />
  );
};

export const SlideDemoLongDurationRest: React.FC<{
  direction: SlideDirection;
}> = ({ direction }) => {
  return (
    <SampleTransition
      effect={slide({ direction })}
      durationRestThreshold={0.005}
    />
  );
};

export const WipeDemo: React.FC<{
  direction: WipeDirection;
}> = ({ direction }) => {
  return (
    <SampleTransition
      effect={wipe({ direction })}
      durationRestThreshold={0.001}
    />
  );
};

export const CustomTransitionDemo: React.FC<{}> = () => {
  const { width, height } = useVideoConfig();

  return (
    <SampleTransition
      effect={customPresentation({ height, width })}
      durationRestThreshold={0.001}
    />
  );
};
