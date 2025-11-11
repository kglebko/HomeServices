import React from 'react';
import { ViewStyle } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type ThemedCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function ThemedCard({ children, style }: ThemedCardProps) {
  const cardColor = useThemeColor({}, 'cardBackground');

  return (
    <ThemedView
      style={[
        {
          backgroundColor: cardColor,
          borderRadius: 10,
          padding: 16,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </ThemedView>
  );
}
