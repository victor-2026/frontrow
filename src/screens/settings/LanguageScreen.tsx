import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { theme } from '../../theme';
import { testIds } from '../../testIds';
import { Section } from '../../components/Section';
import { Row } from '../../components/Row';
import { useQaStore } from '../../state/qa';
import { supportedLanguages } from '../../i18n';

export function LanguageScreen() {
  const { i18n: i18nInstance } = useTranslation();
  const setLocale = useQaStore((s) => s.setLocale);
  const nav = useNavigation();
  const current = useQaStore((s) => s.locale) ?? i18nInstance.language;

  const onPick = async (code: string) => {
    await setLocale(code);
    await i18nInstance.changeLanguage(code);
    nav.goBack();
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingVertical: theme.spacing.md }}
      testID={testIds.settings.languageScreen}
    >
      <Section title="Language">
        {supportedLanguages.map((lang) => (
          <Row
            key={lang.code}
            testID={`settings.language.${lang.code}`}
            label={lang.label}
            value={current === lang.code ? '✓' : undefined}
            onPress={() => void onPick(lang.code)}
          />
        ))}
      </Section>
    </ScrollView>
  );
}
