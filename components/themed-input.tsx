import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type ThemedInputProps = TextInputProps & {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholderValue?: string;
};

export function ThemedInput({
  label,
  value,
  onChangeText,
  placeholderValue = '',
  ...rest
}: ThemedInputProps) {
  const textColor = useThemeColor({}, 'text');         
  const placeholderColor = useThemeColor({}, 'placeholders'); 
  const backgroundColor = useThemeColor({}, 'background'); 
  return (
    <View style={{ marginBottom: 16 }}>
      <ThemedText type="label" style={{ color: textColor }}>{label}</ThemedText>
      <TextInput
        placeholder={placeholderValue}
        placeholderTextColor={placeholderColor} 
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        style={[
          styles.input,
          {
            backgroundColor: textColor, 
            color: backgroundColor,
            fontFamily: 'Actay',
          },
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
  },
});