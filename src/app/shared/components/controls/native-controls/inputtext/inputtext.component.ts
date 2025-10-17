import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/interfaces/field-config.interface';

@Component({
  selector: 'app-native-inputtext',
  standalone: true,
  imports: [ReactiveFormsModule],
  
  templateUrl: './inputtext.component.html',
  styleUrls: ['./inputtext.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class NativeInputtextComponent {
  field = input.required<FieldConfig>();

  controlName(): string {
    const current = this.field();
    const fc = current.formControlName;
    if (typeof fc === 'string' && fc.trim()) {
      return fc;
    }
    if (current.id != null) {
      return String(current.id);
    }
    return `field_${crypto.randomUUID()}`;
  }
}
