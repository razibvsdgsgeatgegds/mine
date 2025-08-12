import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, Heart, Smile, Activity, Trophy, Users } from 'lucide-react-native';
import { QuoteCategory } from '@/types/quote';
import { categoryInfo } from '@/constants/quotes';

interface CategorySelectorProps {
  selectedCategory: QuoteCategory;
  onSelectCategory: (category: QuoteCategory) => void;
}

export default function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
  const categories = Object.keys(categoryInfo) as QuoteCategory[];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const info = categoryInfo[category];
        const iconMap = {
          Zap,
          Heart,
          Smile,
          Activity,
          Trophy,
          Users
        };
        const IconComponent = iconMap[info.icon as keyof typeof iconMap];
        const isSelected = selectedCategory === category;

        return (
          <TouchableOpacity
            key={category}
            onPress={() => onSelectCategory(category)}
            style={[styles.categoryButton, isSelected && styles.selectedButton]}
          >
            {isSelected ? (
              <LinearGradient
                colors={info.gradient as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <IconComponent size={20} color="#fff" />
                <Text style={[styles.categoryText, styles.selectedText]}>{info.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.unselectedContent}>
                <IconComponent size={20} color="#666" />
                <Text style={styles.categoryText}>{info.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  categoryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  selectedButton: {
    backgroundColor: 'transparent',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  unselectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
});