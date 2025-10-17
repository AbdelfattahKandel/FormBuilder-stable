import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/interfaces/field-config.interface';

@Component({
  selector: 'app-native-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class NativeDatepickerComponent {
  field = input.required<FieldConfig>();
  private readonly _generatedId = `datepicker_${crypto.randomUUID()}`;

  private isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControlName as unknown;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field().formControlName;
    if (typeof fc === 'string' && fc.trim()) {
      return fc;
    }
    return null;
  }

  controlId(): string {
    return this.controlName() ?? this._generatedId;
  }

  isDisabled(): boolean {
    const control = this.formControlInst();
    if (control) {
      return control.disabled;
    }
    return !!this.field().disabled;
  }

  minDate(): string | undefined {
    return undefined;
  }

  maxDate(): string | undefined {
    return undefined;
  }

  placeholder(): string {
    const current = this.field();
    return current.placeholder ?? current.label ?? '';
  }

  displayValue(): string | null {
    const control = this.formControlInst();
    const value = control ? control.value : this.field().value;
    if (!value) {
      return null;
    }
    return String(value);
  }

  openPicker(input: HTMLInputElement): void {
    if (this.isDisabled()) {
      return;
    }
    const picker = (input as HTMLInputElement & { showPicker?: () => void });
    if (typeof picker.showPicker === 'function') {
      picker.showPicker();
      return;
    }
    input.focus();
    input.click();
  }
}
