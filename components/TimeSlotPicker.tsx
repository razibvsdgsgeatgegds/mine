import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Clock, X } from 'lucide-react-native';
import { TimeSlot } from '@/types/quote';

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  onAddTimeSlot: () => void;
  onRemoveTimeSlot: (id: string) => void;
}

export default function TimeSlotPicker({ timeSlots, onAddTimeSlot, onRemoveTimeSlot }: TimeSlotPickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock size={20} color="#666" />
        <Text style={styles.title}>Notification Time Slots</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.slotsContainer}>
          {timeSlots.map((slot) => (
            <View key={slot.id} style={styles.slot}>
              <Text style={styles.slotText}>{slot.label}</Text>
              <TouchableOpacity onPress={() => onRemoveTimeSlot(slot.id)}>
                <X size={16} color="#999" />
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addButton} onPress={onAddTimeSlot}>
            <Text style={styles.addButtonText}>+ Add Time</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  slotsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
  },
  slotText: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});