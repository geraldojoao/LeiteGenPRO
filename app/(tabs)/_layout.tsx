import { Tabs } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { AppIcon } from '@/components/common/AppIcon';
import { colors, fonts } from '@/constants/theme';
import { useFavoritesStore } from '@/store/favoritesStore';

export default function TabLayout(): JSX.Element {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;
  const isDesktop = width >= 768;
  const favoritosCount = useFavoritesStore((state) => new Set(state.favoritos).size);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 0,
          paddingVertical: isCompact ? 6 : 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.heading,
          fontSize: isCompact ? 12 : 13,
        },
        tabBarBadgeStyle: {
          backgroundColor: colors.danger,
          color: colors.surface,
          fontFamily: fonts.heading,
          fontSize: 10,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: isDesktop ? 78 : isCompact ? 68 : 72,
          paddingBottom: isCompact ? 8 : 10,
          paddingTop: isCompact ? 8 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarAccessibilityLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => <AppIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="plantel"
        options={{
          title: 'Rebanho',
          tabBarLabel: 'Rebanho',
          tabBarAccessibilityLabel: 'Rebanho',
          tabBarIcon: ({ color, size }) => <AppIcon name="users" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="busca"
        options={{
          title: 'Recom.',
          tabBarLabel: 'Recom.',
          tabBarAccessibilityLabel: 'Recomendacoes',
          tabBarIcon: ({ color, size }) => <AppIcon name="search" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Catalogo',
          tabBarLabel: 'Catalogo',
          tabBarAccessibilityLabel: 'Catalogo',
          tabBarIcon: ({ color, size }) => <AppIcon name="store" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="carrinho"
        options={{
          title: 'Carrinho',
          tabBarLabel: 'Carrinho',
          tabBarAccessibilityLabel: 'Carrinho de favoritos',
          tabBarBadge: favoritosCount > 0 ? favoritosCount : undefined,
          tabBarIcon: ({ color, size }) => <AppIcon name="shopping-cart" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
