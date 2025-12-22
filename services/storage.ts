import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';
const CONTACT_KEY = '@registration_contact';
const RESET_PASSWORD_CONTACT_KEY = '@reset_password_contact';
const RESET_PASSWORD_CODE_KEY = '@reset_password_code';

export const storage = {
  /**
   * Сохраняет токен аутентификации
   */
  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  /**
   * Получает сохраненный токен
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Сохраняет данные пользователя
   */
  async saveUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  /**
   * Получает сохраненные данные пользователя
   */
  async getUser(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Сохраняет контакт для регистрации (для передачи между экранами)
   */
  async saveRegistrationContact(contact: string): Promise<void> {
    try {
      await AsyncStorage.setItem(CONTACT_KEY, contact);
    } catch (error) {
      console.error('Error saving registration contact:', error);
      throw error;
    }
  },

  /**
   * Получает сохраненный контакт регистрации
   */
  async getRegistrationContact(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(CONTACT_KEY);
    } catch (error) {
      console.error('Error getting registration contact:', error);
      return null;
    }
  },

  /**
   * Очищает сохраненный контакт регистрации
   */
  async clearRegistrationContact(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONTACT_KEY);
    } catch (error) {
      console.error('Error clearing registration contact:', error);
    }
  },

  /**
   * Сохраняет контакт для восстановления пароля
   */
  async saveResetPasswordContact(contact: string): Promise<void> {
    try {
      await AsyncStorage.setItem(RESET_PASSWORD_CONTACT_KEY, contact);
    } catch (error) {
      console.error('Error saving reset password contact:', error);
      throw error;
    }
  },

  /**
   * Получает сохраненный контакт для восстановления пароля
   */
  async getResetPasswordContact(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(RESET_PASSWORD_CONTACT_KEY);
    } catch (error) {
      console.error('Error getting reset password contact:', error);
      return null;
    }
  },

  /**
   * Очищает сохраненный контакт для восстановления пароля
   */
  async clearResetPasswordContact(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([RESET_PASSWORD_CONTACT_KEY, RESET_PASSWORD_CODE_KEY]);
    } catch (error) {
      console.error('Error clearing reset password contact:', error);
    }
  },

  /**
   * Сохраняет проверенный код для восстановления пароля
   */
  async saveResetPasswordCode(code: string): Promise<void> {
    try {
      await AsyncStorage.setItem(RESET_PASSWORD_CODE_KEY, code);
    } catch (error) {
      console.error('Error saving reset password code:', error);
      throw error;
    }
  },

  /**
   * Получает сохраненный код для восстановления пароля
   */
  async getResetPasswordCode(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(RESET_PASSWORD_CODE_KEY);
    } catch (error) {
      console.error('Error getting reset password code:', error);
      return null;
    }
  },

  /**
   * Очищает все данные аутентификации
   */
  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, CONTACT_KEY, RESET_PASSWORD_CONTACT_KEY]);
    } catch (error) {
      console.error('Error clearing auth:', error);
      throw error;
    }
  },

  /**
   * Проверяет, авторизован ли пользователь
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  },
};


