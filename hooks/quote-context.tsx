import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useCallback } from 'react';
import { quotes } from '@/constants/quotes';
import { QuoteCategory, UserPreferences, NotificationSettings, User } from '@/types/quote';
import { Platform } from 'react-native';

// Conditionally import SecureStore for native platforms only
let SecureStore: any = null;
if (Platform.OS !== 'web') {
  SecureStore = require('expo-secure-store');
}

const defaultNotificationSettings: NotificationSettings = {
  enabled: false,
  dailyCount: 3,
  categories: ['motivation'],
  timeSlots: [
    { id: '1', startHour: 9, startMinute: 0, endHour: 10, endMinute: 0, label: '9:00 AM - 10:00 AM' },
    { id: '2', startHour: 12, startMinute: 0, endHour: 13, endMinute: 0, label: '12:00 PM - 1:00 PM' },
    { id: '3', startHour: 17, startMinute: 0, endHour: 18, endMinute: 0, label: '5:00 PM - 6:00 PM' }
  ]
};

const defaultPreferences: UserPreferences = {
  favorites: [],
  notificationSettings: defaultNotificationSettings,
  lastViewedCategory: 'motivation'
};

const defaultUser: User = {
  id: '',
  email: '',
  name: '',
  isAuthenticated: false
};

export const [QuoteProvider, useQuotes] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [currentCategory, setCurrentCategory] = useState<QuoteCategory>('motivation');
  const [currentQuote, setCurrentQuote] = useState<string>('The only way to do great work is to love what you do.');
  const [currentAuthor, setCurrentAuthor] = useState<string>('Steve Jobs');
  const [, setUser] = useState<User>(defaultUser);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // Load user from SecureStore (with web compatibility)
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        if (Platform.OS === 'web') {
          // Use AsyncStorage for web compatibility
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser) as User;
            setUser(parsed);
            return parsed;
          }
        } else if (SecureStore) {
          // Use SecureStore for native platforms
          const storedUser = await SecureStore.getItemAsync('user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser) as User;
            setUser(parsed);
            return parsed;
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
      return defaultUser;
    }
  });

  // Load preferences from AsyncStorage
  const preferencesQuery = useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem('userPreferences');
        if (stored) {
          const parsed = JSON.parse(stored) as UserPreferences;
          setCurrentCategory(parsed.lastViewedCategory);
          return parsed;
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
      return defaultPreferences;
    }
  });

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: async (preferences: UserPreferences) => {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
      return preferences;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    }
  });

  const { mutate: savePreferences } = savePreferencesMutation;

  const preferences = preferencesQuery.data || defaultPreferences;
  const currentUser = userQuery.data || defaultUser;

  // Get quotes for current category (fallback to hardcoded)
  const categoryQuotes = useMemo(() => {
    return quotes.filter(q => q.category === currentCategory);
  }, [currentCategory]);

  // Get fallback quote
  const fallbackQuote = categoryQuotes[0] || quotes[0];

  // Toggle favorite
  const toggleFavorite = useCallback((quoteId: string) => {
    const newFavorites = preferences.favorites.includes(quoteId)
      ? preferences.favorites.filter(id => id !== quoteId)
      : [...preferences.favorites, quoteId];
    
    savePreferences({
      ...preferences,
      favorites: newFavorites
    });
  }, [preferences, savePreferences]);

  // Check if quote is favorite
  const isFavorite = useCallback((quoteId: string) => {
    return preferences.favorites.includes(quoteId);
  }, [preferences.favorites]);

  // Get favorite quotes
  const favoriteQuotes = useMemo(() => {
    return quotes.filter(q => preferences.favorites.includes(q.id));
  }, [preferences.favorites]);

  // Generate AI quote for current category using Gemini API
  const generateQuoteForCategory = useCallback(async (category: QuoteCategory): Promise<void> => {
    setIsLoadingQuote(true);
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyCdTdDHd0iaY_TxhV9aht4zuSp1bDRGUOw'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a unique, inspiring quote about ${category}. The quote should be motivational, meaningful, and different from common quotes. Format your response exactly as: "Quote text" - Author Name. Keep the quote under 50 words and make sure it's original and inspiring. Include a realistic author name (can be a real person or fictional character that fits the quote style).`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 200
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const completion = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      console.log('Gemini API response:', completion);
      
      // Parse the response to extract quote and author
      const match = completion.match(/"([^"]+)"\s*-\s*(.+)/);
      if (match) {
        setCurrentQuote(match[1].trim());
        setCurrentAuthor(match[2].trim());
      } else {
        // Fallback parsing for different formats
        const dashIndex = completion.lastIndexOf(' - ');
        if (dashIndex > 0) {
          const quoteText = completion.substring(0, dashIndex).replace(/"/g, '').trim();
          const author = completion.substring(dashIndex + 3).trim();
          setCurrentQuote(quoteText);
          setCurrentAuthor(author);
        } else {
          // If no author found, use the whole text as quote
          setCurrentQuote(completion.replace(/"/g, '').trim());
          setCurrentAuthor('Gemini AI');
        }
      }
    } catch (error) {
      console.error('Error generating quote with Gemini:', error);
      // Fallback to hardcoded quote
      const fallback = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)] || fallbackQuote;
      setCurrentQuote(fallback.text);
      setCurrentAuthor(fallback.author);
    } finally {
      setIsLoadingQuote(false);
    }
  }, [categoryQuotes, fallbackQuote]);

  // Change category
  const changeCategory = useCallback((category: QuoteCategory) => {
    setCurrentCategory(category);
    generateQuoteForCategory(category);
    savePreferences({
      ...preferences,
      lastViewedCategory: category
    });
  }, [preferences, savePreferences, generateQuoteForCategory]);

  // Next quote - always generate new AI quote
  const nextQuote = useCallback(() => {
    generateQuoteForCategory(currentCategory);
  }, [generateQuoteForCategory, currentCategory]);

  // Update notification settings
  const updateNotificationSettings = useCallback((settings: NotificationSettings) => {
    savePreferences({
      ...preferences,
      notificationSettings: settings
    });
  }, [preferences, savePreferences]);

  // Authentication functions
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate login - in real app, this would call your backend
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        isAuthenticated: true
      };
      
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      } else if (SecureStore) {
        await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
      }
      setUser(mockUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [queryClient]);

  const signup = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Simulate signup - in real app, this would call your backend
      const mockUser: User = {
        id: '1',
        email,
        name,
        isAuthenticated: true
      };
      
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      } else if (SecureStore) {
        await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
      }
      setUser(mockUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }, [queryClient]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('user');
      } else if (SecureStore) {
        await SecureStore.deleteItemAsync('user');
      }
      setUser(defaultUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [queryClient]);

  // Initialize with AI quote on first load
  const initializeQuote = useCallback(() => {
    // Always generate a new AI quote on initialization
    generateQuoteForCategory(currentCategory);
  }, [generateQuoteForCategory, currentCategory]);

  return useMemo(() => {
    const quoteToReturn = {
      id: 'ai-' + Date.now(),
      text: currentQuote || fallbackQuote.text,
      author: currentAuthor || fallbackQuote.author,
      category: currentCategory
    };
    return {
      currentCategory,
      currentQuote: quoteToReturn,
    categoryQuotes,
    favoriteQuotes,
    preferences,
    user: currentUser,
    isLoading: preferencesQuery.isLoading || userQuery.isLoading,
    isLoadingQuote,
    isFavorite,
    toggleFavorite,
    changeCategory,
    nextQuote,
    updateNotificationSettings,
    generateQuoteForCategory,
    initializeQuote,
    login,
    signup,
    logout
    };
  }, [
    currentCategory,
    currentQuote,
    currentAuthor,
    fallbackQuote,
    categoryQuotes,
    favoriteQuotes,
    preferences,
    currentUser,
    preferencesQuery.isLoading,
    userQuery.isLoading,
    isLoadingQuote,
    isFavorite,
    toggleFavorite,
    changeCategory,
    nextQuote,
    updateNotificationSettings,
    generateQuoteForCategory,
    initializeQuote,
    login,
    signup,
    logout
  ]);
});

// Helper hook for filtered favorites
export function useFavoritesByCategory(category?: QuoteCategory) {
  const { favoriteQuotes } = useQuotes();
  return useMemo(() => {
    if (!category) return favoriteQuotes;
    return favoriteQuotes.filter(q => q.category === category);
  }, [favoriteQuotes, category]);
}