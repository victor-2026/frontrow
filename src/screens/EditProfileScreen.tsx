import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, Modal, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../theme';
import { testIds } from '../testIds';
import { Button } from '../components/Button';
import { useAuthStore } from '../state/auth';
import { useUpdateProfile } from '../hooks/useAuth';
import { showToast } from '../state/toasts';
import { PROFILE_BIO_MAX, PROFILE_NAME_MAX } from '../api/services/auth';
import type { ProfileStackParamList } from '../navigation/types';

export function EditProfileScreen() {
  const nav = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const update = useUpdateProfile();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [error, setError] = useState<string | null>(null);
  const [discardOpen, setDiscardOpen] = useState(false);

  const initialName = user?.displayName ?? '';
  const initialBio = user?.bio ?? '';
  const dirty = displayName !== initialName || bio !== initialBio;
  const bioRemaining = PROFILE_BIO_MAX - bio.length;
  const bioOver = bioRemaining < 0;
  const canSave = dirty && displayName.trim().length > 0 && !bioOver;

  useLayoutEffect(() => {
    nav.setOptions({ title: 'Edit profile' });
  }, [nav]);

  // Block native back nav when there are unsaved changes.
  useEffect(() => {
    const unsubscribe = nav.addListener('beforeRemove', (e) => {
      if (!dirty || update.isPending) return;
      e.preventDefault();
      setDiscardOpen(true);
    });
    return unsubscribe;
  }, [nav, dirty, update.isPending]);

  const onSave = async () => {
    setError(null);
    try {
      await update.mutateAsync({ displayName, bio });
      showToast('Profile updated', 'success');
      nav.goBack();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const confirmDiscard = () => {
    setDiscardOpen(false);
    setDisplayName(initialName);
    setBio(initialBio);
    // Defer goBack so the beforeRemove listener doesn't intercept again.
    requestAnimationFrame(() => nav.goBack());
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      testID={testIds.editProfile.screen}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Display name</Text>
      <TextInput
        testID={testIds.editProfile.displayNameInput}
        accessibilityLabel="Display name"
        value={displayName}
        onChangeText={setDisplayName}
        maxLength={PROFILE_NAME_MAX}
        style={styles.input}
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        testID={testIds.editProfile.bioInput}
        accessibilityLabel="Bio"
        value={bio}
        onChangeText={setBio}
        placeholder="A few words about you"
        multiline
        style={[styles.input, styles.textarea, bioOver && styles.inputError]}
      />
      <Text
        testID={testIds.editProfile.bioCharCount}
        style={[styles.counter, bioOver && styles.counterError]}
      >
        {bioRemaining} characters left
      </Text>

      {error ? (
        <Text testID={testIds.editProfile.errorMessage} style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Button
        testID={testIds.editProfile.saveButton}
        title={update.isPending ? 'Saving…' : 'Save'}
        onPress={onSave}
        loading={update.isPending}
        disabled={!canSave}
      />

      <Modal
        visible={discardOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDiscardOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.dialog} testID={testIds.editProfile.discardConfirmDialog}>
            <Text style={styles.dialogTitle}>Discard changes?</Text>
            <Text style={styles.dialogBody}>You have unsaved edits. They will be lost.</Text>
            <View style={styles.dialogActions}>
              <Button
                testID={testIds.editProfile.discardConfirmNo}
                title="Keep editing"
                variant="secondary"
                onPress={() => setDiscardOpen(false)}
              />
              <Button
                testID={testIds.editProfile.discardConfirmYes}
                title="Discard"
                onPress={confirmDiscard}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, gap: theme.spacing.sm },
  label: { fontSize: theme.typography.caption, color: theme.colors.muted, marginTop: theme.spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  inputError: { borderColor: theme.colors.danger },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  counter: {
    fontSize: theme.typography.caption,
    color: theme.colors.muted,
    textAlign: 'right',
  },
  counterError: { color: theme.colors.danger },
  error: { color: theme.colors.danger, fontSize: theme.typography.body, marginTop: theme.spacing.sm },
  backdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  dialog: {
    width: '100%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  dialogTitle: { fontSize: theme.typography.title, fontWeight: '700', color: theme.colors.text },
  dialogBody: { fontSize: theme.typography.body, color: theme.colors.muted },
  dialogActions: { flexDirection: 'row', gap: theme.spacing.md, justifyContent: 'flex-end' },
});
