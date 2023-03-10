const logger = (m: string) => {
  console.log(`π±< ${m}`);
};

/**
 * γ‘γγ»γΌγΈγζ¨ζΊεΊεγ«ζ΅γ
 * @param message θ‘¨η€Ίγγζε­ε Array γ§γε―θ½
 */
export const logMessage = (message: string | string[]) => {
  if (Array.isArray(message)) {
    return message.map((m) => {
      logger(m);
    });
  }

  logger(message);
};
