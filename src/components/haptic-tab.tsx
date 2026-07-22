import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native'; // ← 'Platform' retiré car inutile ici

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Feedback haptique léger lors de l'appui (iOS uniquement)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Exécute le comportement par défaut de React Navigation
        props.onPressIn?.(ev);
      }}
      style={({ pressed }) => [
        // Fusionne le style existant de React Navigation avec un effet visuel d'appui
        props.style,
        {
          opacity: pressed ? 0.7 : 1, // Feedback visuel pour iOS/Android
        }
      ]}
    >
      {/* ⚠️ CRITIQUE : Il faut absolument rendre les enfants (icône + label) */}
      {props.children}
    </Pressable>
  );
}