import React, { useRef } from 'react';
import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';
import { springPresets, getSpringPreset } from '../../motion/spring-presets';
import { useInterruptionSafeAnimation } from '../../motion/interruption-safe';

export type SwipeAction = 'complete' | 'snooze' | 'defer' | 'reduce';

export interface GestureTaskCardProps {
  children: React.ReactNode;
  energyMode?: EnergyMode;
  onComplete?: () => void;
  onSnooze?: () => void;
  onDefer?: () => void;
  onReduceScope?: () => void;
  disabled?: boolean;
}

const SWIPE_THRESHOLD = 120;
const SWIPE_THRESHOLD_LOW = 80;
const SWIPE_SLOP = 20;
const ACTIVATION_THRESHOLD = 0.7;

export function GestureTaskCard({
  children,
  energyMode = 'normal',
  onComplete,
  onSnooze,
  onDefer,
  onReduceScope,
  disabled = false,
}: GestureTaskCardProps) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const activeAction = useSharedValue<SwipeAction | null>(null);
  const isReversing = useSharedValue(false);

  const threshold = energyMode === 'low' ? SWIPE_THRESHOLD_LOW : SWIPE_THRESHOLD;

  const handleAction = (action: SwipeAction) => {
    'worklet';
    if (isReversing.value) return;
    
    activeAction.value = action;
    
    // Trigger haptic feedback callback
    runOnJS(triggerHapticForAction)(action);
  };

  const triggerHapticForAction = (action: SwipeAction) => {
    // Haptic feedback will be handled by the parent component
    // This is a placeholder for the haptic integration
  };

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .activeOffsetX([-SWIPE_SLOP, SWIPE_SLOP])
    .onStart(() => {
      isReversing.value = false;
      activeAction.value = null;
    })
    .onUpdate((event) => {
      if (isReversing.value) return;
      
      translateX.value = event.translationX;
      
      // Subtle scale feedback during gesture
      const progress = Math.min(Math.abs(event.translationX) / threshold, 1);
      scale.value = 1 - (progress * 0.05);
      
      // Determine which action is being triggered
      if (event.translationX < -threshold) {
        handleAction('complete');
      } else if (event.translationX > threshold) {
        handleAction('snooze');
      }
    })
    .onEnd((event, success) => {
      if (isReversing.value || !success) {
        reverseGesture();
        return;
      }

      const absX = Math.abs(event.translationX);
      const velocityX = Math.abs(event.velocityX);
      
      // Forgiving threshold - allow completion with momentum
      const shouldComplete = absX > threshold || (absX > threshold * ACTIVATION_THRESHOLD && velocityX > 500);
      
      if (shouldComplete) {
        if (event.translationX < 0) {
          executeAction('complete', onComplete);
        } else {
          executeAction('snooze', onSnooze);
        }
      } else {
        reverseGesture();
      }
    });

  const executeAction = (action: SwipeAction, callback?: () => void) => {
    'worklet';
    
    // Animate to completion
    const targetX = action === 'complete' ? -500 : 500;
    translateX.value = withSpring(
      targetX,
      getSpringPreset('snappy', energyMode),
      (finished) => {
        if (finished) {
          if (callback) {
            runOnJS(callback)();
          }
          // Reset after animation
          translateX.value = withDelay(100, withSpring(0, getSpringPreset('gentle', energyMode)));
          scale.value = withSpring(1, getSpringPreset('gentle', energyMode));
        }
      }
    );
  };

  const reverseGesture = () => {
    'worklet';
    isReversing.value = true;
    activeAction.value = null;
    
    translateX.value = withSpring(0, getSpringPreset('gentle', energyMode), () => {
      isReversing.value = false;
    });
    scale.value = withSpring(1, getSpringPreset('gentle', energyMode));
  };

  const longPressGesture = Gesture.LongPress()
    .enabled(!disabled && energyMode !== 'overwhelmed')
    .minDuration(400)
    .onStart(() => {
      // Show secondary actions (defer, reduce scope)
      // For now, trigger defer as default
      executeAction('defer', onDefer);
    });

  const composedGesture = Gesture.Simultaneous(
    panGesture,
    longPressGesture
  );

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = energyMode === 'overwhelmed' ? 1 : 1 - (Math.abs(translateX.value) / (threshold * 2));
    
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
      ],
      opacity: opacity > 0 ? opacity : 0,
    };
  });

  const actionIndicatorStyle = useAnimatedStyle(() => {
    let backgroundColor = 'transparent';
    let opacity = 0;
    
    if (activeAction.value === 'complete') {
      backgroundColor = baseTokens.color.success;
      opacity = Math.min(Math.abs(translateX.value) / threshold, 0.3);
    } else if (activeAction.value === 'snooze') {
      backgroundColor = baseTokens.color.warning;
      opacity = Math.min(Math.abs(translateX.value) / threshold, 0.3);
    }
    
    return {
      backgroundColor,
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.actionIndicator, actionIndicatorStyle]} />
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[animatedStyle, styles.card]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    width: '100%',
  },
  actionIndicator: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: baseTokens.radii.md,
  },
});
