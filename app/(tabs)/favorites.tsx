import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Filter } from 'lucide-react-native';
import QuoteCard from '@/components/QuoteCard';
import { useQuotes, useFavoritesByCategory } from '@/hooks/quote-context';
import { QuoteCategory } from '@/types/quote';
import { categoryInfo } from '@/constants/quotes';

export default function FavoritesScreen() {
  const { favoriteQuotes } = useQuotes();
  const [filterCategory, setFilterCategory] = useState<QuoteCategory | undefined>(undefined);
  const filteredFavorites = useFavoritesByCategory(filterCategory);
  const [showFilter, setShowFilter] = useState(false);

  const categories = Object.keys(categoryInfo) as QuoteCategory[];

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>My Favorites</Text>
          <Text style={styles.subtitle}>
            {favoriteQuotes.length === 0 
              ? 'No favorites yet' 
              : `${filteredFavorites.length} quote${filteredFavorites.length !== 1 ? 's' : ''}`}
          </Text>
        </View>

        {favoriteQuotes.length > 0 && (
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilter(!showFilter)}
          >
            <Filter size={20} color="#667eea" />
            <Text style={styles.filterText}>
              {filterCategory ? categoryInfo[filterCategory].label : 'All Categories'}
            </Text>
          </TouchableOpacity>
        )}

        {showFilter && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            <TouchableOpacity
              style={[styles.filterChip, !filterCategory && styles.filterChipActive]}
              onPress={() => {
                setFilterCategory(undefined);
                setShowFilter(false);
              }}
            >
              <Text style={[styles.filterChipText, !filterCategory && styles.filterChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.filterChip, filterCategory === category && styles.filterChipActive]}
                onPress={() => {
                  setFilterCategory(category);
                  setShowFilter(false);
                }}
              >
                <Text style={[styles.filterChipText, filterCategory === category && styles.filterChipTextActive]}>
                  {categoryInfo[category].label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredFavorites.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Heart size={64} color="#ddd" />
              <Text style={styles.emptyText}>
                {filterCategory 
                  ? `No ${categoryInfo[filterCategory].label} favorites yet`
                  : 'Start adding your favorite quotes'}
              </Text>
              <Text style={styles.emptySubtext}>
                Tap the heart icon on any quote to save it here
              </Text>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {filteredFavorites.map((quote, index) => (
                <View key={quote.id} style={styles.cardWrapper}>
                  <QuoteCard quote={quote} showActions={true} />
                </View>
              ))}
            </View>
          )}
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
    paddingBottom: 16,
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  filterText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  filterContainer: {
    maxHeight: 50,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
  cardWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
});