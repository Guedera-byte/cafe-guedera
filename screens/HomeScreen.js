import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Animated, Modal, Pressable, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { PRODUCTS, COMBOS, CATEGORIES, NOTIFICATIONS } from '../data/products';

const COLORS = {
  bg: '#1A0F00',
  surface: '#2C1A06',
  card: '#3D2410',
  accent: '#D4801A',
  accentLight: '#F0A84E',
  gold: '#FFD166',
  cream: '#FFF3E0',
  white: '#FFFFFF',
  muted: '#A08060',
  green: '#4CAF50',
  red: '#E74C3C',
};

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const { addToCart, count } = useCart();
  const scrollY = useRef(new Animated.Value(0)).current;

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredProducts = selectedCategory === 'Todos' || selectedCategory === 'Combos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View>
          <Text style={styles.headerSub}>Bem-vindo ao</Text>
          <Text style={styles.headerTitle}>Café do Guedera ☕</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Notification Bell */}
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowNotif(true)}>
            <Text style={styles.iconEmoji}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* Cart */}
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.iconEmoji}>🛒</Text>
            {count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Categories */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Combos Section */}
        {(selectedCategory === 'Todos' || selectedCategory === 'Combos') && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Combos Especiais</Text>
              <Text style={styles.sectionSub}>Preços imbatíveis</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.comboRow}>
              {COMBOS.map(combo => (
                <TouchableOpacity
                  key={combo.id}
                  style={styles.comboCard}
                  onPress={() => navigation.navigate('ProductDetail', { item: combo, isCombo: true })}
                  activeOpacity={0.85}
                >
                  <View style={styles.comboBadge}>
                    <Text style={styles.comboBadgeText}>{combo.badge}</Text>
                  </View>
                  <Text style={styles.comboEmoji}>{combo.emoji}</Text>
                  <Text style={styles.comboName}>{combo.name}</Text>
                  <View style={styles.comboPriceRow}>
                    <Text style={styles.comboOriginal}>R$ {combo.originalPrice.toFixed(2)}</Text>
                    <Text style={styles.comboPrice}>R$ {combo.price.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => addToCart({ ...combo, category: 'Combos' })}
                  >
                    <Text style={styles.addBtnText}>+ Adicionar</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Products Grid */}
        {selectedCategory !== 'Combos' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory === 'Todos' ? '🍽️ Cardápio' : `🍽️ ${selectedCategory}`}
              </Text>
            </View>
            <View style={styles.grid}>
              {filteredProducts.map(product => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate('ProductDetail', { item: product, isCombo: false })}
                  activeOpacity={0.85}
                >
                  {product.badge && (
                    <View style={[styles.productBadge, product.badge === 'Novo' && styles.productBadgeNew]}>
                      <Text style={styles.productBadgeText}>{product.badge}</Text>
                    </View>
                  )}
                  <Text style={styles.productEmoji}>{product.emoji}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                  <View style={styles.tagsRow}>
                    {product.tags.map(tag => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
                    <TouchableOpacity
                      style={styles.addIconBtn}
                      onPress={() => addToCart(product)}
                    >
                      <Text style={styles.addIconText}>＋</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </Animated.ScrollView>

      {/* Notification Modal */}
      <Modal visible={showNotif} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setShowNotif(false)}>
          <Pressable style={styles.notifSheet} onPress={() => {}}>
            <View style={styles.notifHandle} />
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Notificações</Text>
              <TouchableOpacity onPress={markAllRead}>
                <Text style={styles.notifMarkAll}>Marcar todas como lidas</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {notifications.map(n => (
                <TouchableOpacity
                  key={n.id}
                  style={[styles.notifItem, n.unread && styles.notifItemUnread]}
                  onPress={() => setNotifications(prev =>
                    prev.map(item => item.id === n.id ? { ...item, unread: false } : item)
                  )}
                >
                  <View style={styles.notifContent}>
                    <Text style={styles.notifItemTitle}>{n.title}</Text>
                    <Text style={styles.notifItemMsg}>{n.message}</Text>
                    <Text style={styles.notifTime}>{n.time}</Text>
                  </View>
                  {n.unread && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.surface,
  },
  headerSub: { fontSize: 12, color: COLORS.muted, fontWeight: '500', letterSpacing: 1 },
  headerTitle: { fontSize: 22, color: COLORS.gold, fontWeight: '800', letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  iconEmoji: { fontSize: 20 },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: COLORS.red, borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3 },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },

  // Section
  section: { marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 20, marginBottom: 12, marginTop: 16 },
  sectionTitle: { fontSize: 18, color: COLORS.cream, fontWeight: '700' },
  sectionSub: { fontSize: 12, color: COLORS.accent },

  // Categories
  catRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.card },
  catChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  catText: { fontSize: 13, color: COLORS.muted, fontWeight: '600' },
  catTextActive: { color: COLORS.white },

  // Combos
  comboRow: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  comboCard: {
    width: 180, backgroundColor: COLORS.card, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: COLORS.accent + '40',
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8,
    elevation: 4,
  },
  comboBadge: { backgroundColor: COLORS.accent, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8 },
  comboBadgeText: { fontSize: 10, color: COLORS.white, fontWeight: '700' },
  comboEmoji: { fontSize: 32, marginBottom: 8 },
  comboName: { fontSize: 14, color: COLORS.cream, fontWeight: '700', marginBottom: 8 },
  comboPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  comboOriginal: { fontSize: 12, color: COLORS.muted, textDecorationLine: 'line-through' },
  comboPrice: { fontSize: 16, color: COLORS.gold, fontWeight: '800' },
  addBtn: { backgroundColor: COLORS.accent, borderRadius: 12, paddingVertical: 8, alignItems: 'center' },
  addBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },

  // Product Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 12 },
  productCard: {
    width: '46%', backgroundColor: COLORS.card, borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: COLORS.surface,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
    elevation: 3,
  },
  productBadge: { backgroundColor: COLORS.accentLight, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 6 },
  productBadgeNew: { backgroundColor: COLORS.green },
  productBadgeText: { fontSize: 9, color: COLORS.white, fontWeight: '700' },
  productEmoji: { fontSize: 36, marginBottom: 8 },
  productName: { fontSize: 13, color: COLORS.cream, fontWeight: '700', marginBottom: 6 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 10 },
  tag: { backgroundColor: COLORS.surface, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { fontSize: 9, color: COLORS.muted, fontWeight: '500' },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 15, color: COLORS.gold, fontWeight: '800' },
  addIconBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' },
  addIconText: { color: COLORS.white, fontSize: 16, fontWeight: '700', lineHeight: 20 },

  // Notification Modal
  modalOverlay: { flex: 1, backgroundColor: '#00000080', justifyContent: 'flex-end' },
  notifSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '75%', paddingBottom: 32 },
  notifHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.muted, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.card },
  notifTitle: { fontSize: 18, color: COLORS.cream, fontWeight: '800' },
  notifMarkAll: { fontSize: 12, color: COLORS.accent, fontWeight: '600' },
  notifItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.card },
  notifItemUnread: { backgroundColor: COLORS.accent + '10' },
  notifContent: { flex: 1 },
  notifItemTitle: { fontSize: 14, color: COLORS.cream, fontWeight: '700', marginBottom: 4 },
  notifItemMsg: { fontSize: 13, color: COLORS.muted, lineHeight: 18, marginBottom: 4 },
  notifTime: { fontSize: 11, color: COLORS.accent },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.accent, marginLeft: 8 },
});
