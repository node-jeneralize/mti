const logger = (m: string) => {
  console.log(`🌱< ${m}`);
};

/**
 * メッセージを標準出力に流す
 * @param message 表示する文字列 Array でも可能
 */
export const logMessage = (message: string | string[]) => {
  if (Array.isArray(message)) {
    return message.map((m) => {
      logger(m);
    });
  }

  logger(message);
};
