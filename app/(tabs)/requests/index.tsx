import React, { useState, useCallback } from 'react';
import { View, Platform } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFocusEffect } from 'expo-router';

type Request = {
  id: number;
  type: string;
  selectedDate: string;
  selectedStartTime?: string;
  selectedEndTime?: string;
  actualTime?: string;
  approximatePrice?: number;
  actualPrice?: number;
  status: 'На рассмотрении' | 'Принята' | 'Отменена' | 'Выполнена';
};

export default function RequestsScreen() {
  const red = useThemeColor({}, 'accentRed');
  const green = useThemeColor({}, 'green');
  const text = useThemeColor({}, 'text');

  const [currentRequests, setCurrentRequests] = useState<Request[]>([]);
  const [historyRequests, setHistoryRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080'
      : 'http://192.168.31.18:8080';

  // --- Загрузка заявок ---
  const fetchRequests = async () => {
    try {
      const [currentRes, historyRes] = await Promise.all([
        fetch(`${baseUrl}/api/requests/current`),
        fetch(`${baseUrl}/api/requests/history`)
      ]);

      const currentData = await currentRes.json();
      const historyData = await historyRes.json();

      const mapRequest = (req: any): Request => ({
        id: req.id,
        type: req.serviceName || 'Услуга',
        selectedDate: req.scheduledPeriod?.split(' ')[0] ?? '',
        selectedStartTime: req.scheduledPeriod?.split(' ')[1],
        selectedEndTime: undefined,
        actualTime: req.actualTime,
        approximatePrice: req.estimatedPrice ?? 0,
        actualPrice: req.paidPrice ?? 0,
        status:
          req.status === 'PENDING'
            ? 'На рассмотрении'
            : req.status === 'ACCEPTED'
            ? 'Принята'
            : req.status === 'CANCELLED'
            ? 'Отменена'
            : 'Выполнена'
      });

      setCurrentRequests(currentData.map(mapRequest));
      setHistoryRequests(historyData.map(mapRequest));
    } catch (e) {
      console.error('Ошибка загрузки заявок:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchRequests();
    }, [])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'На рассмотрении':
      case 'Отменена':
        return red;
      case 'Принята':
      case 'Выполнена':
        return green;
      default:
        return text;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    return timeStr.length > 5 ? timeStr.slice(0, 5) : timeStr;
  };

  const formatTimeRange = (start?: string, end?: string) => {
    const startFormatted = formatTime(start);
    const endFormatted = formatTime(end);
    return endFormatted ? `${startFormatted} – ${endFormatted}` : startFormatted;
  };

  // --- Отмена заявки ---
  const handleCancel = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/api/requests/${id}/cancel`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Ошибка отмены');

      const cancelledRequest = await res.json();
      setCurrentRequests((prev) => prev.filter((r) => r.id !== id));
      setHistoryRequests((prev) => [
        ...prev,
        { ...cancelledRequest, status: 'Отменена' },
      ]);
    } catch (e) {
      console.error(e);
      alert('Не удалось отменить заявку');
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ThemedText>Загрузка...</ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      {currentRequests.length > 0 && (
        <ThemedText type="screenTitle" style={{ textAlign: 'center', marginBottom: 20 }}>
          Текущие заявки
        </ThemedText>
      )}

      {currentRequests.map((req) => (
        <ThemedCard key={req.id} style={{ borderWidth: 1, borderColor: red, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <ThemedText type="paymentData">{req.type}</ThemedText>
            <ThemedText type="paymentStatus" style={{ color: getStatusColor(req.status) }}>
              {req.status}
            </ThemedText>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <ThemedText type="label">{formatDate(req.selectedDate)}</ThemedText>
              <ThemedText type="label">{formatTimeRange(req.selectedStartTime, req.selectedEndTime)}</ThemedText>
              <ThemedText type="label">
                от {(req.approximatePrice ?? 0).toFixed(2)} руб.
              </ThemedText>
            </View>

            {(req.status === 'На рассмотрении' || req.status === 'Принята') && (
              <ThemedButton
                title="Отменить"
                style={{ width: 120, paddingVertical: 12, marginLeft: 16 }}
                textColor="#DCDCDC"
                textStyle={{ fontSize: 16 }}
                onPress={() => handleCancel(req.id)}
              />
            )}
          </View>
        </ThemedCard>
      ))}

      <ThemedText type="screenTitle" style={{ textAlign: 'center', marginVertical: 20 }}>
        История заявок
      </ThemedText>

      {historyRequests.map((req) => (
        <ThemedCard key={req.id} style={{ marginBottom: 16, padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <ThemedText type="paymentData">{req.type}</ThemedText>
            <ThemedText type="paymentStatus" style={{ color: getStatusColor(req.status) }}>
              {req.status}
            </ThemedText>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <ThemedText type="label">{formatDate(req.selectedDate)}</ThemedText>
              {req.actualTime && <ThemedText type="label">{formatTime(req.actualTime)}</ThemedText>}
            </View>

            <ThemedText type="paymentStatus">
              {(req.actualPrice ?? req.approximatePrice ?? 0).toFixed(2)} руб.
            </ThemedText>
          </View>
        </ThemedCard>
      ))}
    </ScreenContainer>
  );
}
