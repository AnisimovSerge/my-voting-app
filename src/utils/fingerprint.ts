// src/utils/fingerprint.ts

import FingerprintJS from "@fingerprintjs/fingerprintjs";

// Асинхронная функция для получения unique-токена устройства
export const generateFingerprint = async () => {
  const agent = await FingerprintJS.load();
  const result = await agent.get();
  return result.visitorId;
};

// Функция проверки уникальности устройства
export const isUniqueDevice = async (deviceToken: string) => {
  // Здесь можно реализовать механизм проверки уникальности в базе данных
  // Например, проверка наличия deviceToken в коллекции tokens в Firebase
  // Возвращаем true, если устройство уникальное
  return true;
};

// Функционал, связанный с хранением и очисткой отпечатков устройств
export const storeDeviceInfo = async (deviceToken: string) => {
  // Хранение deviceToken в базе данных (например, в Firebase)
  // ...
};

// Вспомогательная функция для удаления устаревших записей
export const cleanupOldFingerprints = async () => {
  // Чистка старых отпечатков устройств, если требуется
  // ...
};

