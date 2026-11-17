# ☕ Café do Marcelo — App Mobile

App mobile de cafeteria criado com **React Native + Expo**.

## 📁 Estrutura do Projeto

```
CafeMarceloApp/
├── App.js                    # Entry point com navegação
├── app.json                  # Configuração Expo
├── package.json
├── context/
│   └── CartContext.js        # Gerenciamento global do carrinho
├── data/
│   └── products.js           # Produtos, combos e notificações
└── screens/
    ├── HomeScreen.js         # Tela principal
    ├── ProductDetailScreen.js # Detalhe do produto/combo
    └── CartScreen.js         # Carrinho de compras
```

## 🚀 Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar o projeto
```bash
npx expo start
```

### 3. Abrir no celular
- Instale o app **Expo Go** no seu celular
- Escaneie o QR code exibido no terminal

---

## 📱 Funcionalidades

### Tela Principal (HomeScreen)
- **Categorias**: Filtro horizontal por Bebidas, Bolos, Rosquinhas, Torradas, Combos
- **Combos Especiais**: Carrossel horizontal com preços especiais e desconto visível
- **Grade de Produtos**: Todos os itens do cardápio com badge de destaque
- **🔔 Notificações**: Modal com promoções e avisos (badge com contagem de não lidas)
- **🛒 Carrinho**: Acesso rápido com contagem de itens

### Tela de Detalhe (ProductDetailScreen)
- Descrição completa do produto
- Composição dos combos
- Seletor de quantidade
- Total calculado automaticamente
- **Adicionar ao Carrinho** ou **Comprar Agora**

### Tela do Carrinho (CartScreen)
- Lista de itens com controle de quantidade
- Remover itens individuais ou limpar tudo
- Resumo do pedido com valores
- **Finalizar Pedido** com confirmação

---

## 🎨 Design

Tema escuro com tons de marrom, dourado e âmbar — identidade visual de cafeteria premium.

- Cor primária: `#D4801A` (âmbar)
- Dourado: `#FFD166`
- Background: `#1A0F00` (marrom escuro)
