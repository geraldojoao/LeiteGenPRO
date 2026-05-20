import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useConnectivity(): { isOnline: boolean; isChecking: boolean } {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
      setIsChecking(false);
    });

    return unsubscribe;
  }, []);

  return { isOnline, isChecking };
}
