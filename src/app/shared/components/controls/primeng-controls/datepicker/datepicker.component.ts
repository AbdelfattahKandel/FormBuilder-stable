import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/interfaces/field-config.interface';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [DatePickerModule, ReactiveFormsModule],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class DatepickerComponent {
  @Input() field!: FieldConfig;

  private isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field?.formControlName as unknown;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field?.formControlName as unknown;
    return typeof fc === 'string' ? fc : null;
  }
}
