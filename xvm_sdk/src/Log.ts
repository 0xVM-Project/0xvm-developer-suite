class Log {
  private static isEnabled: boolean = false;

  static enable(): void {
    this.isEnabled = true;
  }

  static disable(): void {
    this.isEnabled = false;
  }

  static info(message: string, ...args: any[]): void {
    if (this.isEnabled) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: any[]): void {
    if (this.isEnabled) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  static error(message: string, ...args: any[]): void {
    if (this.isEnabled) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  static debug(message: string, ...args: any[]): void {
    if (this.isEnabled) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}

export default Log;

