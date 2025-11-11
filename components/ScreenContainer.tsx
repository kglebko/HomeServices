import React, { ReactNode } from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
};

export function ScreenContainer({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  const background = useThemeColor({}, 'background');

  if (scrollable) {
    return (
      <SafeAreaView
        edges={['left', 'right', 'bottom']} 
        style={{ flex: 1, backgroundColor: background }}
      >
        <ScrollView
          style={[
            {
              flex: 1,
              backgroundColor: background,
              paddingHorizontal: 20,
              paddingTop: 24, 
            },
            style,
          ]}
          contentContainerStyle={[{ paddingBottom: 40,}, contentContainerStyle,]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']} 
      style={[
        {
          flex: 1,
          backgroundColor: background,
          paddingHorizontal: 20,
          paddingTop: 24, 
          paddingBottom: 40,
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}
