export class UserInput {
  private static input: string;
  private static prefix: string;

  static getInput() {
    return UserInput.input;
  }

  static setInput(str: string) {
    return UserInput.input = str;
  }

  static getPrefix() {
    return UserInput.prefix;
  }

  static setPrefix(str: string) {
    return UserInput.prefix = str;
  }
}