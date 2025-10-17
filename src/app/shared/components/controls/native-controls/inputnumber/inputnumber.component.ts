import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/interfaces/field-config.interface';

@Component({
  selector: 'app-native-inputnumber',
  standalone: true,
  imports: [InputNumberModule, ReactiveFormsModule],
  templateUrl: './inputnumber.component.html',
  styleUrl: './inputnumber.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class NativeInputNumberComponent {
  field = input.required<FieldConfig>();

  private isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControlName as unknown;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field().formControlName;
    return typeof fc === 'string' ? fc : null;
  }
}
