import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, Heart, Smile, Activity, Trophy, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { QuoteCategory } from '@/types/quote';
import { categoryInfo, quotes } from '@/constants/quotes';
import { useQuotes } from '@/hooks/quote-context';

export default function CategoriesScreen() {
  const router = useRouter();
  const { changeCategory } = useQuotes();
  const categories = Object.keys(categoryInfo) as QuoteCategory[];

  const handleCategoryPress = (category: QuoteCategory) => {
    changeCategory(category);
    router.push('/(tabs)');
  };

  const getCategoryCount = (category: QuoteCategory) => {
    return quotes.filter(q => q.category === category).length;
  };

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>Explore quotes by theme</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
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
              const count = getCategoryCount(category);

              return (
                <TouchableOpacity
                  key={category}
                  style={styles.card}
                  onPress={() => handleCategoryPress(category)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={info.gradient as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
                    <View style={styles.iconContainer}>
                      <IconComponent size={32} color="#fff" />
                    </View>
                    <Text style={styles.categoryName}>{info.label}</Text>
                    <Text style={styles.quoteCount}>{count} quotes</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 160,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  quoteCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});