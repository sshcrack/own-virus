import { RLKey } from '../interfaces/readline';

/**
 * Check if the given code is special
 * @example Left arrow key
 */
export function isSpecial(key: RLKey) {
  return key.code !== undefined || key.code !== null;
}

/**
 * Check if any combos of keys are pressed
 * @param key Key you want to check
 */

export function isKeyCombo(key: RLKey) {
  return key.sequence.length >= 2
}

/**
 * Check if the key given is a alphanumeric key
 * @param key The key you want to check
 */

export function isAlphanumericKey(key: RLKey) {
  return !key.ctrl && !key.meta && !isKeyCombo(key)
}

export function isBackspace(key: RLKey) {
  return key.name === "backspace"
}

export function isWordDelete(key: RLKey) {
  return key.ctrl && key.sequence === "\\x17"
}

export function isTab(key: RLKey) {
  return key.name !== "tab"
}

export function isAbort(key: RLKey) {
  return key.ctrl && key.name === "c"
}

export function isReturn(key: RLKey) {
  return key.name === "return"
}