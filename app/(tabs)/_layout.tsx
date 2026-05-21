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
        tabBarActiveTintColor: colors.primary,
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
          fontSize: isCompact ? 12 : 14,
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
          borderTopWidth: 2,
          height: isDesktop ? 84 : isCompact ? 74 : 78,
          paddingBottom: isCompact ? 9 : 12,
          paddingTop: isCompact ? 9 : 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarLabel: 'Início',
          tabBarAccessibilityLabel: 'Início',
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
          title: 'Touros',
          tabBarLabel: 'Touros',
          tabBarAccessibilityLabel: 'Touros recomendados',
          tabBarIcon: ({ color, size }) => <AppIcon name="search" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          href: null,
          title: 'Catálogo',
          tabBarLabel: 'Catálogo',
          tabBarAccessibilityLabel: 'Catálogo',
          tabBarIcon: ({ color, size }) => <AppIcon name="store" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="carrinho"
        options={{
          title: 'Favoritos',
          tabBarLabel: 'Favoritos',
          tabBarAccessibilityLabel: 'Favoritos',
          tabBarBadge: favoritosCount > 0 ? favoritosCount : undefined,
          tabBarIcon: ({ color, size }) => <AppIcon name="heart-pulse" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarAccessibilityLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <AppIcon name="user" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
