import { Component, ChangeDetectionStrategy, input, output, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { FieldConfig } from '../../../../core/interfaces/field-config.interface';
import { ArrayFieldEditorComponent } from '../../../../shared/components/array-field-editor/array-field-editor.component';
import { BuilderPreferencesService } from '../../../../core/services/builder-preferences.service';

// PrimeNG Control Components
import { InputtextComponent } from '../../../../shared/components/controls/primeng-controls/inputtext/inputtext.component';
import { PasswordComponent } from '../../../../shared/components/controls/primeng-controls/password/password.component';
import { InputnumberComponent } from '../../../../shared/components/controls/primeng-controls/inputnumber/inputnumber.component';
import { TextareaComponent } from '../../../../shared/components/controls/primeng-controls/textarea/textarea.component';
import { SelectComponent } from '../../../../shared/components/controls/primeng-controls/select/select.component';
import { MultiselectComponent } from '../../../../shared/components/controls/primeng-controls/multiselect/multiselect.component';
import { CheckboxComponent } from '../../../../shared/components/controls/primeng-controls/checkbox/checkbox.component';
import { RadiobuttonComponent } from '../../../../shared/components/controls/primeng-controls/radiobutton/radiobutton.component';
import { DatepickerComponent } from '../../../../shared/components/controls/primeng-controls/datepicker/datepicker.component';
import { AttachmentComponent } from '../../../../shared/components/controls/primeng-controls/attachment/attachment.component';

// Native Control Components
import { NativeInputtextComponent } from '../../../../shared/components/controls/native-controls/inputtext/inputtext.component';
import { NativePasswordComponent } from '../../../../shared/components/controls/native-controls/password/password.component';
import { NativeInputNumberComponent } from '../../../../shared/components/controls/native-controls/inputnumber/inputnumber.component';
import { NativeTextareaComponent } from '../../../../shared/components/controls/native-controls/textarea/textarea.component';
import { NativeSelectComponent } from '../../../../shared/components/controls/native-controls/select/select.component';
import { NativeMultiselectComponent } from '../../../../shared/components/controls/native-controls/multiselect/multiselect.component';
import { NativeCheckboxComponent } from '../../../../shared/components/controls/native-controls/checkbox/checkbox.component';
import { NativeRadiobuttonComponent } from '../../../../shared/components/controls/native-controls/radiobutton/radiobutton.component';
import { NativeDatepickerComponent } from '../../../../shared/components/controls/native-controls/datepicker/datepicker.component';
import { NativeAttachmentComponent } from '../../../../shared/components/controls/native-controls/attachment/attachment.component';

@Component({
  selector: 'app-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ArrayFieldEditorComponent,
    // PrimeNG Controls
    InputtextComponent,
    PasswordComponent,
    InputnumberComponent,
    TextareaComponent,
    SelectComponent,
    MultiselectComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    DatepickerComponent,
    AttachmentComponent,
    // Native Controls
    NativeInputtextComponent,
    NativePasswordComponent,
    NativeInputNumberComponent,
    NativeTextareaComponent,
    NativeSelectComponent,
    NativeMultiselectComponent,
    NativeCheckboxComponent,
    NativeRadiobuttonComponent,
    NativeDatepickerComponent,
    NativeAttachmentComponent,
  ],
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RendererComponent implements OnInit {
  private readonly _builderPreferences = inject(BuilderPreferencesService);

  field = input.required<FieldConfig>();
  fieldUpdated = output<FieldConfig>();

  previewForm!: FormGroup;

  constructor() {
    // Create form when field changes
    effect(() => {
      const currentField = this.field();
      this.createPreviewForm(currentField);
    });
  }

  ngOnInit(): void {
    this.createPreviewForm(this.field());
  }

  private createPreviewForm(field: FieldConfig): void {
    const controlName = field.formControlName || `preview_${field.type}_${Date.now()}`;
    const defaultValue = this.getDefaultValue(field.type);
    
    this.previewForm = new FormGroup({
      [controlName]: new FormControl({ value: defaultValue, disabled: true })
    });
  }

  private getDefaultValue(type: string): any {
    switch (type) {
      case 'checkbox':
        return false;
      case 'multi-select':
        return [];
      default:
        return '';
    }
  }

  isNativeLibrary(): boolean {
    return this._builderPreferences.uiKitChoice() === 'native';
  }

  onArrayFieldUpdated(updatedField: FieldConfig): void {
    this.fieldUpdated.emit(updatedField);
  }
}
