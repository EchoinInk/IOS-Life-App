import { Platform } from 'react-native';
import { EnergyMode } from '../theme/types';

// Fallback haptic implementation until expo-haptics is installed
// TODO: Replace with actual expo-haptics import once package is installed
const Haptics = {
  impactAsync: async (style: any) => {
    // Placeholder - will be replaced with actual haptics
    if (Platform.OS !== 'web') {
      console.log('Haptic impact:', style);
    }
  },
  notificationAsync: async (style: any) => {
    // Placeholder - will be replaced with actual haptics
    if (Platform.OS !== 'web') {
      console.log('Haptic notification:', style);
    }
  },
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackStyle: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
};

export type HapticType = 
  | 'completion' 
  | 'confirmation' 
  | 'capture' 
  | 'focus' 
  | 'recovery' 
  | 'undo' 
  | 'none';

export function useHapticFeedback() {
  const triggerHaptic = (type: HapticType, energyMode: EnergyMode = 'normal') => {
    if (energyMode === 'overwhelmed' || type === 'none') return;
    
    if (Platform.OS === 'web') return;

    switch (type) {
      case 'completion':
        // Subtle completion feedback - gentle impact
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      
      case 'confirmation':
        // Gentle confirmation - soft tap
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      
      case 'capture':
        // Capture feedback - slightly more noticeable
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      
      case 'focus':
        // Focus transition - soft notification
        Haptics.notificationAsync(Haptics.NotificationFeedbackStyle.Success);
        break;
      
      case 'recovery':
        // Recovery signal - gentle warning
        Haptics.notificationAsync(Haptics.NotificationFeedbackStyle.Warning);
        break;
      
      case 'undo':
        // Undo action - gentle impact
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      
      default:
        break;
    }
  };

  const triggerHapticForGesture = (progress: number, energyMode: EnergyMode = 'normal') => {
    if (energyMode === 'overwhelmed') return;
    
    // Progressive haptic feedback during gesture
    // Trigger at 30%, 60%, and 90% of gesture completion
    if (progress > 0.9 && progress < 0.91) {
      triggerHaptic('completion', energyMode);
    } else if (progress > 0.6 && progress < 0.61) {
      triggerHaptic('confirmation', energyMode);
    } else if (progress > 0.3 && progress < 0.31) {
      triggerHaptic('confirmation', energyMode);
    }
  };

  return {
    triggerHaptic,
    triggerHapticForGesture,
  };
}
