import React from 'react';
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

export default function CartScreen({ navigation }) {
  const { cartItems, updateQty, removeFromCart, clearCart, total, count } = useCart();

  const handleCheckout = () => {
    Alert.alert(
      '🎉 Pedido Confirmado!',
      `Seu pedido de R$ ${total.toFixed(2)} foi enviado! Prepararemos com carinho. ☕`,
      [{ text: 'Ótimo!', onPress: () => { clearCart(); navigation.navigate('Home'); } }]
    );
  };

  const isEmpty = cartItems.length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meu Carrinho</Text>
        {!isEmpty && (
          <TouchableOpacity onPress={() => Alert.alert('Limpar carrinho?', '', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Limpar', style: 'destructive', onPress: clearCart },
          ])}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        )}
        {isEmpty && <View style={{ width: 50 }} />}
      </View>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Carrinho vazio</Text>
          <Text style={styles.emptyMsg}>Explore nosso cardápio e adicione seus itens favoritos!</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.exploreBtnText}>Ver Cardápio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.countText}>{count} {count === 1 ? 'item' : 'itens'} no carrinho</Text>
            {cartItems.map(item => (
              <View key={item.id} style={styles.itemCard}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemPrice}>R$ {(item.price * item.qty).toFixed(2)}</Text>
                </View>
                <View style={styles.itemControls}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, -1)}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, 1)}
                  >
                    <Text style={styles.qtyBtnText}>＋</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.removeIcon}>🗑</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
              {cartItems.map(item => (
                <View key={item.id} style={styles.summaryRow}>
                  <Text style={styles.summaryItem}>{item.qty}x {item.name}</Text>
                  <Text style={styles.summaryPrice}>R$ {(item.price * item.qty).toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryItem}>Taxa de serviço</Text>
                <Text style={styles.summaryPrice}>Grátis</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Checkout */}
          <View style={styles.checkoutBar}>
            <View>
              <Text style={styles.checkoutLabel}>Total do pedido</Text>
              <Text style={styles.checkoutTotal}>R$ {total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutBtnText}>Finalizar Pedido ☕</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.surface,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 20, color: COLORS.cream },
  title: { fontSize: 20, color: COLORS.cream, fontWeight: '800' },
  clearText: { fontSize: 13, color: COLORS.red, fontWeight: '600' },

  scroll: { padding: 16 },
  countText: { fontSize: 13, color: COLORS.muted, marginBottom: 14, textAlign: 'center' },

  // Item Card
  itemCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: 18, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.surface,
    gap: 12,
  },
  itemEmoji: { fontSize: 40 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, color: COLORS.cream, fontWeight: '700' },
  itemCategory: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  itemPrice: { fontSize: 15, color: COLORS.gold, fontWeight: '800', marginTop: 4 },
  itemControls: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  qtyBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  qtyValue: { width: 28, textAlign: 'center', fontSize: 15, color: COLORS.cream, fontWeight: '800' },
  removeBtn: { padding: 4 },
  removeIcon: { fontSize: 18 },

  // Summary
  summaryCard: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, marginTop: 8 },
  summaryTitle: { fontSize: 16, color: COLORS.cream, fontWeight: '800', marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryItem: { fontSize: 14, color: COLORS.muted },
  summaryPrice: { fontSize: 14, color: COLORS.cream, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.surface, marginVertical: 10 },
  totalRow: { marginTop: 4 },
  totalLabel: { fontSize: 16, color: COLORS.cream, fontWeight: '800' },
  totalValue: { fontSize: 20, color: COLORS.gold, fontWeight: '900' },

  // Empty
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 22, color: COLORS.cream, fontWeight: '800', marginBottom: 8 },
  emptyMsg: { fontSize: 15, color: COLORS.muted, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  exploreBtn: { backgroundColor: COLORS.accent, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 20 },
  exploreBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },

  // Checkout bar
  checkoutBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: COLORS.card,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  checkoutLabel: { fontSize: 12, color: COLORS.muted },
  checkoutTotal: { fontSize: 22, color: COLORS.gold, fontWeight: '900' },
  checkoutBtn: {
    backgroundColor: COLORS.accent, borderRadius: 18, paddingHorizontal: 24, paddingVertical: 14,
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
    elevation: 6,
  },
  checkoutBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
});
