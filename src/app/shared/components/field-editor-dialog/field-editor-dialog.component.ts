import { Component, ChangeDetectionStrategy, inject, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldConfig, FieldOption } from '../../../core/interfaces/field-config.interface';
import { FieldType } from '../../../core/models/interfaces/type-field';

@Component({
  selector: 'app-field-editor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './field-editor-dialog.component.html',
  styleUrl: './field-editor-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldEditorDialogComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);

  field = input.required<FieldConfig>();
  fieldSaved = output<FieldConfig>();
  cancelled = output<void>();

  _forFieldForm!: FormGroup;
  readonly optionsText = signal('');

  readonly fieldTypes: Array<{ label: string; value: FieldType }> = [
    { label: 'Text Input', value: 'input-text' },
    { label: 'Password', value: 'password' },
    { label: 'Number', value: 'input-number' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Select', value: 'select' },
    { label: 'Multi-Select', value: 'multi-select' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Radio', value: 'radio' },
    { label: 'Date Picker', value: 'datepicker' },
    { label: 'File Upload', value: 'attachment' },
    { label: 'Array', value: 'array' },
    { label: 'Submit Button', value: 'submit' },
  ];

  readonly columnOptions = [
    { label: '1 Column', value: 1 },
    { label: '2 Columns', value: 2 },
    { label: '3 Columns', value: 3 },
    { label: '4 Columns', value: 4 },
  ];

  readonly buttonSizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];

  readonly buttonSeverityOptions = [
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
    { label: 'Success', value: 'success' },
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warning' },
    { label: 'Danger', value: 'danger' },
    { label: 'Help', value: 'help' },
  ];

  readonly iconPositionOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
  ];

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const field = this.field();

    this._forFieldForm = this._fb.group({
      label: [field.label, [Validators.required]],
      formControlName: [field.formControlName, [Validators.required]],
      type: [field.type, [Validators.required]],
      placeholder: [field.placeholder || ''],
      required: [field.required || false],
      disabled: [field.disabled || false],
      readonly: [field.readonly || false],
      columns: [field.style?.columns || 2],
      buttonAction: [field.buttonAction || 'submit'],
      buttonIcon: [field.buttonIcon || ''],
      buttonIconPos: [field.buttonIconPos || 'right'],
      buttonSize: [field.buttonSize || 'medium'],
      buttonSeverity: [field.buttonSeverity || 'primary'],
    });

    // Set options text if field has options
    if (field.options && field.options.length > 0) {
      const optionsStr = field.options
        .map((opt) => `${opt.label}:${opt.value}`)
        .join('\n');
      this.optionsText.set(optionsStr);
    }
  }

  needsOptions(): boolean {
    const type = this._forFieldForm?.get('type')?.value;
    return type === 'select' || type === 'multi-select' || type === 'radio';
  }

  isSubmitButton(): boolean {
    const type = this._forFieldForm?.get('type')?.value;
    return type === 'submit';
  }

  onSave(): void {
    if (this._forFieldForm.invalid) {
      return;
    }

    const formValue = this._forFieldForm.value;
    const field = this.field();

    // Parse options if needed
    let options: FieldOption[] | undefined = undefined;
    if (this.needsOptions() && this.optionsText()) {
      options = this.parseOptions(this.optionsText());
    }

    const updatedField: FieldConfig = {
      ...field,
      label: formValue.label,
      formControlName: formValue.formControlName,
      type: formValue.type,
      placeholder: formValue.placeholder,
      required: formValue.required,
      disabled: formValue.disabled,
      readonly: formValue.readonly,
      options,
      buttonAction: formValue.buttonAction,
      buttonType: formValue.type === 'submit' ? 'submit' : undefined,
      buttonIcon: formValue.buttonIcon,
      buttonIconPos: formValue.buttonIconPos,
      buttonSize: formValue.buttonSize,
      buttonSeverity: formValue.buttonSeverity,
      style: {
        ...field.style,
        columns: formValue.columns,
      },
      class: `col-span-${formValue.columns} w-full`,
    };

    this.fieldSaved.emit(updatedField);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private parseOptions(text: string): FieldOption[] {
    return text
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        const [label, value] = line.split(':').map((s) => s.trim());
        return {
          label: label || value,
          value: value || label,
        };
      });
  }
}
