import { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { theme } from '../../theme';
import { testIds } from '../../testIds';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'WebView'>;

export function WebViewScreen({ route }: Props) {
  const { url, title } = route.params;
  const nav = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    nav.setOptions({ title });
  }, [nav, title]);

  return (
    <View style={styles.container} testID={testIds.settings.webview.screen}>
      {error ? (
        <View style={styles.center}>
          <Text testID={testIds.settings.webview.errorMessage} style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : (
        <>
          <WebView
            testID={testIds.settings.webview.content}
            source={{ uri: url }}
            onLoadEnd={() => setLoading(false)}
            onError={(e) => setError(e.nativeEvent.description ?? 'Failed to load content.')}
            onHttpError={(e) =>
              setError(`HTTP ${e.nativeEvent.statusCode}: ${e.nativeEvent.description}`)
            }
            startInLoadingState
            javaScriptEnabled
          />
          {loading && (
            <View style={styles.loaderOverlay} pointerEvents="none">
              <ActivityIndicator />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg },
  errorText: { color: theme.colors.danger, fontSize: theme.typography.body, textAlign: 'center' },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});
