import { Injectable, signal, computed } from '@angular/core';

export type StyleChoice = 'tailwind' | 'bootstrap' | 'inline';
export type UiKitChoice = 'primeng' | 'native';

const STORAGE_KEY_STYLE = 'formify_style_choice';
const STORAGE_KEY_UIKIT = 'formify_uikit_choice';

/**
 * BuilderPreferencesService
 * Manages user preferences for style framework and UI kit
 * Persists choices to localStorage
 */
@Injectable({
  providedIn: 'root',
})
export class BuilderPreferencesService {
  private readonly _styleChoice = signal<StyleChoice | null>(null);
  private readonly _uiKitChoice = signal<UiKitChoice | null>(null);

  readonly styleChoice = this._styleChoice.asReadonly();
  readonly uiKitChoice = this._uiKitChoice.asReadonly();

  readonly hasPreferences = computed(() => {
    return this._styleChoice() !== null && this._uiKitChoice() !== null;
  });

  constructor() {
    this.loadFromLocalStorage();
  }

  setStyleChoice(choice: StyleChoice): void {
    this._styleChoice.set(choice);
    this.saveToLocalStorage();
  }

  setUiKitChoice(choice: UiKitChoice): void {
    this._uiKitChoice.set(choice);
    this.saveToLocalStorage();
  }

  setPreferences(style: StyleChoice, uiKit: UiKitChoice): void {
    this._styleChoice.set(style);
    this._uiKitChoice.set(uiKit);
    this.saveToLocalStorage();
  }

  clearPreferences(): void {
    this._styleChoice.set(null);
    this._uiKitChoice.set(null);
    localStorage.removeItem(STORAGE_KEY_STYLE);
    localStorage.removeItem(STORAGE_KEY_UIKIT);
  }

  private saveToLocalStorage(): void {
    const style = this._styleChoice();
    const uiKit = this._uiKitChoice();

    if (style) {
      localStorage.setItem(STORAGE_KEY_STYLE, style);
    }
    if (uiKit) {
      localStorage.setItem(STORAGE_KEY_UIKIT, uiKit);
    }
  }

  private loadFromLocalStorage(): void {
    const style = localStorage.getItem(STORAGE_KEY_STYLE) as StyleChoice | null;
    const uiKit = localStorage.getItem(STORAGE_KEY_UIKIT) as UiKitChoice | null;

    if (style && this.isValidStyleChoice(style)) {
      this._styleChoice.set(style);
    }
    if (uiKit && this.isValidUiKitChoice(uiKit)) {
      this._uiKitChoice.set(uiKit);
    }
  }

  private isValidStyleChoice(value: string): value is StyleChoice {
    return ['tailwind', 'bootstrap', 'inline'].includes(value);
  }

  private isValidUiKitChoice(value: string): value is UiKitChoice {
    return ['primeng', 'native'].includes(value);
  }
}
