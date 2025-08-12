import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Share, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Share2 } from 'lucide-react-native';
import { Quote } from '@/types/quote';
import { categoryInfo } from '@/constants/quotes';
import { useQuotes } from '@/hooks/quote-context';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface QuoteCardProps {
  quote: Quote;
  onNext?: () => void;
  showActions?: boolean;
}

const { width } = Dimensions.get('window');

export default function QuoteCard({ quote, onNext, showActions = true }: QuoteCardProps) {
  const { isFavorite, toggleFavorite } = useQuotes();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const viewShotRef = useRef<ViewShot>(null);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onNext) onNext();
    });
  };

  const handleFavorite = () => {
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    toggleFavorite(quote.id);
  };

  const handleShare = async () => {
    try {
      const message = `"${quote.text}"\n\n- ${quote.author}\n\nShared from Inspirational Hub`;
      
      if (Platform.OS === 'web') {
        // Web - use native share API or fallback to clipboard
        if (navigator.share) {
          await navigator.share({
            title: 'Inspirational Quote',
            text: message,
          });
        } else {
          // Fallback to copying to clipboard
          await navigator.clipboard.writeText(message);
          Alert.alert('Copied!', 'Quote copied to clipboard');
        }
      } else {
        // Mobile - try image sharing first, then text fallback
        try {
          if (viewShotRef.current && viewShotRef.current.capture) {
            const uri = await viewShotRef.current.capture();
            
            // Check if the file exists and is valid
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (fileInfo.exists && fileInfo.size > 0) {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                  mimeType: 'image/png',
                  dialogTitle: 'Share this inspirational quote',
                });
                return;
              }
            }
          }
        } catch (imageError) {
          console.log('Image sharing failed, falling back to text:', imageError);
        }
        
        // Fallback to text sharing
        await Share.share({
          message,
          title: 'Inspirational Quote',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share quote. Please try again.');
    }
  };

  const gradientColors = categoryInfo[quote.category].gradient as [string, string, ...string[]];

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Text style={styles.quoteText}>&quot;{quote.text}&quot;</Text>
              <Text style={styles.author}>— {quote.author}</Text>
              
              {showActions && (
                <View style={styles.actions}>
                  <TouchableOpacity onPress={handleFavorite} style={styles.actionButton}>
                    <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                      <Heart
                        size={24}
                        color="#fff"
                        fill={isFavorite(quote.id) ? '#fff' : 'transparent'}
                      />
                    </Animated.View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                    <Share2 size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.watermark}>
                <Text style={styles.watermarkText}>Inspirational Hub</Text>
              </View>
            </View>
          </LinearGradient>
        </ViewShot>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    minHeight: 280,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  gradient: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  author: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
  },
  watermark: {
    position: 'absolute',
    bottom: 8,
    right: 12,
  },
  watermarkText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
});