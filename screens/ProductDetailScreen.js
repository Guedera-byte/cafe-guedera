import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

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

export default function ProductDetailScreen({ route, navigation }) {
  const { item, isCombo } = route.params;
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [obs, setObs] = useState('');

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart({ ...item, category: isCombo ? 'Combos' : item.category });
    Alert.alert('✅ Adicionado!', `${qty}x ${item.name} adicionado ao carrinho.`, [
      { text: 'Continuar comprando', onPress: () => navigation.goBack() },
      { text: 'Ver carrinho', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) addToCart({ ...item, category: isCombo ? 'Combos' : item.category });
    navigation.navigate('Cart');
  };

  const totalPrice = (item.price * qty).toFixed(2);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>{isCombo ? 'Combo Especial' : item.category}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{item.emoji}</Text>
          {item.badge && (
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{item.badge}</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>

          {/* Combo items list */}
          {isCombo && item.items && (
            <View style={styles.comboItems}>
              <Text style={styles.comboItemsTitle}>O que inclui:</Text>
              {item.items.map((it, idx) => (
                <View key={idx} style={styles.comboItemRow}>
                  <Text style={styles.comboItemDot}>•</Text>
                  <Text style={styles.comboItemText}>{it}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Tags */}
          {!isCombo && item.tags && (
            <View style={styles.tagsRow}>
              {item.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Price + Qty */}
        <View style={styles.purchaseCard}>
          <View style={styles.priceRow}>
            <View>
              {isCombo && item.originalPrice && (
                <Text style={styles.originalPrice}>De R$ {item.originalPrice.toFixed(2)}</Text>
              )}
              <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
              {isCombo && item.originalPrice && (
                <Text style={styles.saving}>Você economiza R$ {(item.originalPrice - item.price).toFixed(2)}</Text>
              )}
            </View>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={[styles.qtyBtn, qty <= 1 && styles.qtyBtnDisabled]}
                onPress={() => setQty(q => Math.max(1, q - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => q + 1)}>
                <Text style={styles.qtyBtnText}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.totalLabel}>Total: <Text style={styles.totalValue}>R$ {totalPrice}</Text></Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartBtnText}>🛒 Adicionar ao Carrinho</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <Text style={styles.buyBtnText}>Comprar Agora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.surface,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 20, color: COLORS.cream },
  topTitle: { fontSize: 14, color: COLORS.muted, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },

  scroll: { paddingBottom: 120 },

  // Hero
  hero: {
    alignItems: 'center', paddingVertical: 36,
    backgroundColor: COLORS.surface,
  },
  heroEmoji: { fontSize: 88 },
  heroBadge: {
    marginTop: 12, backgroundColor: COLORS.accent, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 4,
  },
  heroBadgeText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },

  // Info
  infoCard: { margin: 20, backgroundColor: COLORS.card, borderRadius: 20, padding: 20 },
  productName: { fontSize: 24, color: COLORS.cream, fontWeight: '800', marginBottom: 12 },
  description: { fontSize: 15, color: COLORS.muted, lineHeight: 24 },

  comboItems: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.surface },
  comboItemsTitle: { fontSize: 13, color: COLORS.accent, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  comboItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  comboItemDot: { color: COLORS.accent, fontSize: 16, marginRight: 8 },
  comboItemText: { fontSize: 14, color: COLORS.cream },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  tag: { backgroundColor: COLORS.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  tagText: { fontSize: 12, color: COLORS.muted, fontWeight: '500' },

  // Purchase
  purchaseCard: { marginHorizontal: 20, backgroundColor: COLORS.card, borderRadius: 20, padding: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  originalPrice: { fontSize: 13, color: COLORS.muted, textDecorationLine: 'line-through' },
  price: { fontSize: 28, color: COLORS.gold, fontWeight: '900' },
  saving: { fontSize: 12, color: COLORS.green, fontWeight: '600', marginTop: 2 },

  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  qtyBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' },
  qtyBtnDisabled: { backgroundColor: COLORS.muted },
  qtyBtnText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  qtyValue: { width: 44, textAlign: 'center', fontSize: 20, color: COLORS.cream, fontWeight: '800' },

  totalLabel: { fontSize: 15, color: COLORS.muted, textAlign: 'right' },
  totalValue: { color: COLORS.gold, fontWeight: '800', fontSize: 18 },

  // Bottom
  bottomActions: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.bg, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: COLORS.surface,
    gap: 10,
  },
  cartBtn: {
    backgroundColor: COLORS.surface, borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.accent,
  },
  cartBtnText: { color: COLORS.accent, fontSize: 16, fontWeight: '700' },
  buyBtn: {
    backgroundColor: COLORS.accent, borderRadius: 16, paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
    elevation: 6,
  },
  buyBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});
