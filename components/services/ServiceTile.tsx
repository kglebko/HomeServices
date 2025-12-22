import React from 'react';
import { TouchableOpacity, View, Image as RNImage, Platform, ViewStyle } from 'react-native';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';

type ServiceTileProps = {
  icon: any;
  title: string;
  time?: string;
  price?: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function ServiceTile({ icon, title, time, price, onPress, style }: ServiceTileProps) {
  return (
    <View style={[{ width: '32%', marginBottom: -5 }, style]}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.85} onPress={onPress}>
        <ThemedCard
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Весь блок выравнивается по левому краю */}
          <View style={{ alignItems: 'flex-start' }}>
            {/* Иконка + название услуги */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {Platform.OS === 'web' ? (
                <img src={icon} style={{ width: 20, height: 20 }} />
              ) : (
                <RNImage source={icon} style={{ width: 20, height: 20 }} />
              )}
              <ThemedText
                type="littleLabel"
                style={{ marginLeft: 6, fontSize: 13, lineHeight: 24 }}
                numberOfLines={1}
              >
                {title}
              </ThemedText>
            </View>

            {/* Время работы */}
              {time && (
                  <ThemedText
                      type="littleLabel"
                      style={{ marginTop: 4, fontSize: 11 }}
                      numberOfLines={1}
                  >
                      {time}
                  </ThemedText>
              )}

              {price && (
                  <ThemedText
                      type="littleLabel"
                      style={{ marginTop: 2, fontSize: 11 }}
                      numberOfLines={1}
                  >
                      {price}
                  </ThemedText>
              )}

          </View>
        </ThemedCard>
      </TouchableOpacity>
    </View>
  );
}