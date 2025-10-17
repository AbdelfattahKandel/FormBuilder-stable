import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/interfaces/field-config.interface';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [PasswordModule, ReactiveFormsModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class PasswordComponent {
field = input.required<FieldConfig>();
  private isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControlName as unknown;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field().formControlName as unknown;
    return typeof fc === 'string' ? fc : null;
  }
}
