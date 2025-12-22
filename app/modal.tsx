import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
    return (
        <ThemedView style={styles.container}>
            {/* Используем 'screenTitle' или 'sectionTitle' вместо 'title' */}
            <ThemedText type="screenTitle">This is a modal</ThemedText>

            <Link href="/" dismissTo style={styles.link}>
                {/* Используем 'default' или 'button' вместо 'link' */}
                <ThemedText
                    type="default"
                    style={styles.linkText} // Добавим стиль для ссылки
                >
                    Go to home screen
                </ThemedText>
            </Link>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        color: '#007AFF', // Синий цвет как у ссылки
        textDecorationLine: 'underline', // Подчеркивание
    },
});