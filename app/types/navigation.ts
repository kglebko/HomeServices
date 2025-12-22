export type RootStackParamList = {
    // Пользовательские роуты
    '(tabs)': undefined;
    '(tabs)/index': undefined;
    '(tabs)/news': undefined;
    '(tabs)/news/[id]': { id: string };
    '(tabs)/services': undefined;
    '(tabs)/services/[id]': { id: string };
    '(tabs)/finance/paymentScreen': undefined;
    '(tabs)/profile': undefined;

    // Админские роуты
    '(admin)': undefined;
    '(admin)/login': undefined;
    '(admin)/news': undefined;
    '(admin)/news/create': undefined;
    '(admin)/news/[id]': { id: string };
    '(admin)/services': undefined;
    '(admin)/services/create': undefined;
    '(admin)/posts': undefined;
    '(admin)/posts/create': undefined;

    // Auth роуты
    '(auth)/login': undefined;
    '(auth)/register': undefined;

    // Модальные окна
    'modal': undefined;
    'request-success': undefined;
    'request': { title?: string; icon?: string };
};

// Объявляем глобальные типы для useRouter
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}