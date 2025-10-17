import { ChangeDetectionStrategy, Component, OnInit, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/interfaces/field-config.interface';

@Component({
  selector: 'app-native-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class NativeTextareaComponent implements OnInit {
  field = input.required<FieldConfig>();

  private readonly _fallbackId = `textarea_${crypto.randomUUID()}`;
  private readonly _fallbackValue = signal<string>('');
  private _isFallbackInitialized = false;

  ngOnInit(): void {
    this.initializeFallbackValue();
  }

  private isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControlName as unknown;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field().formControlName as unknown;
    if (typeof fc === 'string' && fc.trim()) {
      return fc;
    }
    const id = this.field().id;
    if (typeof id === 'string' && id.trim()) {
      return id;
    }
    if (typeof id === 'number') {
      return `textarea_${id}`;
    }
    return null;
  }

  controlId(): string {
    return this.controlName() ?? this._fallbackId;
  }

  isDisabled(): boolean {
    const control = this.formControlInst();
    if (control) {
      return control.disabled;
    }
    return !!this.field().disabled;
  }

  rows(): number {
    return 3;
  }

  maxLength(): number | null {
    return null;
  }

  placeholder(): string {
    return this.field().placeholder ?? this.field().label ?? '';
  }

  fallbackValue(): string {
    this.initializeFallbackValue();
    return this._fallbackValue();
  }

  onFallbackInput(event: Event): void {
    if (this.formControlInst()) {
      return;
    }
    const target = event.target as HTMLTextAreaElement | null;
    if (!target) {
      return;
    }
    const value = target.value;
    this._fallbackValue.set(value);
    (this.field() as any).value = value;
  }

  private initializeFallbackValue(): void {
    if (this._isFallbackInitialized || this.formControlInst()) {
      return;
    }
    const currentValue = (this.field() as any).value;
    const normalized = currentValue === null || currentValue === undefined ? '' : String(currentValue);
    this._fallbackValue.set(normalized);
    this._isFallbackInitialized = true;
  }
}
