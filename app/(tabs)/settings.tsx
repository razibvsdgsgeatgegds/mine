import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Switch, TouchableOpacity, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Hash, Tag, Info, User, LogOut, Crown } from 'lucide-react-native';
import { useQuotes } from '@/hooks/quote-context';
import { QuoteCategory } from '@/types/quote';
import { categoryInfo } from '@/constants/quotes';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import AuthForm from '@/components/AuthForm';
import AdBanner from '@/components/AdBanner';

export default function SettingsScreen() {
  const { preferences, updateNotificationSettings, user, logout } = useQuotes();
  const { notificationSettings } = preferences;
  const [localSettings, setLocalSettings] = useState(notificationSettings);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const categories = Object.keys(categoryInfo) as QuoteCategory[];

  const handleToggleNotifications = (value: boolean) => {
    const updated = { ...localSettings, enabled: value };
    setLocalSettings(updated);
    updateNotificationSettings(updated);
  };

  const handleDailyCountChange = (count: number) => {
    const updated = { ...localSettings, dailyCount: count };
    setLocalSettings(updated);
    updateNotificationSettings(updated);
  };

  const handleCategoryToggle = (category: QuoteCategory) => {
    const updated = {
      ...localSettings,
      categories: localSettings.categories.includes(category)
        ? localSettings.categories.filter(c => c !== category)
        : [...localSettings.categories, category]
    };
    setLocalSettings(updated);
    updateNotificationSettings(updated);
  };

  const handleAddTimeSlot = () => {
    Alert.alert(
      'Add Time Slot',
      'This feature will be available in the premium version',
      [{ text: 'OK' }]
    );
  };

  const handleRemoveTimeSlot = (id: string) => {
    if (localSettings.timeSlots.length > 1) {
      const updated = {
        ...localSettings,
        timeSlots: localSettings.timeSlots.filter(slot => slot.id !== id)
      };
      setLocalSettings(updated);
      updateNotificationSettings(updated);
    } else {
      Alert.alert('Cannot Remove', 'You must have at least one time slot');
    }
  };

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* AI Notifications Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>AI Notifications</Text>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Enable Daily Notifications</Text>
              <Switch
                value={localSettings.enabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#ddd', true: '#667eea' }}
                thumbColor="#fff"
              />
            </View>

            {localSettings.enabled && (
              <>
                {/* Daily Count */}
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <Hash size={16} color="#666" />
                    <Text style={styles.subsectionTitle}>Notifications Per Day</Text>
                  </View>
                  <View style={styles.countOptions}>
                    {[1, 3, 5, 10].map((count) => (
                      <TouchableOpacity
                        key={count}
                        style={[
                          styles.countButton,
                          localSettings.dailyCount === count && styles.countButtonActive
                        ]}
                        onPress={() => handleDailyCountChange(count)}
                      >
                        <Text style={[
                          styles.countButtonText,
                          localSettings.dailyCount === count && styles.countButtonTextActive
                        ]}>
                          {count}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Categories */}
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <Tag size={16} color="#666" />
                    <Text style={styles.subsectionTitle}>Preferred Categories</Text>
                  </View>
                  <View style={styles.categoriesGrid}>
                    {categories.map((category) => {
                      const isSelected = localSettings.categories.includes(category);
                      return (
                        <TouchableOpacity
                          key={category}
                          style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                          onPress={() => handleCategoryToggle(category)}
                        >
                          <Text style={[
                            styles.categoryChipText,
                            isSelected && styles.categoryChipTextActive
                          ]}>
                            {categoryInfo[category].label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Time Slots */}
                <TimeSlotPicker
                  timeSlots={localSettings.timeSlots}
                  onAddTimeSlot={handleAddTimeSlot}
                  onRemoveTimeSlot={handleRemoveTimeSlot}
                />
              </>
            )}
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>Account</Text>
            </View>
            
            {user.isAuthenticated ? (
              <View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                  <LogOut size={16} color="#ff4757" />
                  <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.authButton}
                onPress={() => setShowAuthModal(true)}
              >
                <User size={16} color="#667eea" />
                <Text style={styles.authButtonText}>Sign In / Sign Up</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Premium Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Crown size={20} color="#f39c12" />
              <Text style={styles.sectionTitle}>Premium</Text>
            </View>
            
            <View style={styles.premiumContent}>
              <Text style={styles.premiumDescription}>
                Upgrade to Premium for an ad-free experience and unlimited AI-generated quotes
              </Text>
              
              <TouchableOpacity style={styles.premiumButton}>
                <LinearGradient
                  colors={['#f39c12', '#e67e22']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.premiumGradient}
                >
                  <Crown size={20} color="#fff" />
                  <Text style={styles.premiumText}>Upgrade to Premium</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* AdMob Banner */}
          <View style={styles.adContainer}>
            <AdBanner size="mediumRectangle" />
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            
            <View style={styles.aboutContent}>
              <Text style={styles.aboutText}>Inspirational Hub v1.0.0</Text>
              <Text style={styles.aboutSubtext}>
                Get daily motivation with AI-powered quotes tailored just for you
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Auth Modal */}
      <Modal
        visible={showAuthModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AuthForm onClose={() => setShowAuthModal(false)} />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAuthModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  subsection: {
    marginTop: 20,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  countOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  countButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countButtonActive: {
    backgroundColor: '#667eea',
  },
  countButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  countButtonTextActive: {
    color: '#fff',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  categoryChipActive: {
    backgroundColor: '#667eea',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  aboutContent: {
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  aboutSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  premiumButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  premiumGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userInfo: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  authButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4757',
    fontWeight: '500',
  },
  premiumContent: {
    alignItems: 'center',
  },
  premiumDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  adContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
  },
  closeButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});