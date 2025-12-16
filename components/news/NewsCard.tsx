import React from 'react';
import { Image } from 'react-native';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type NewsCardProps = {
  image: any;
  title: string;
  time: string;
};

export function NewsCard({ image, title, time }: NewsCardProps) {
  return (
    <ThemedCard style={{ width: 260, marginRight: 16, padding: 0 }}>

      <Image
        source={image}
        style={{
          width: '100%',
          height: 155,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      />

      <ThemedView withBackground={false} style={{ padding: 12 }}>
        <ThemedText>{title}</ThemedText>
        <ThemedText type="littleLabel" style={{ marginTop: 6 }}>
          {time}
        </ThemedText>
      </ThemedView>

    </ThemedCard>
  );
}
