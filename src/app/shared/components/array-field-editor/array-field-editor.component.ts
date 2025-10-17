import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FieldConfig } from '../../../core/interfaces/field-config.interface';
import { FieldType } from '../../../core/models/interfaces/type-field';
import { generateId } from '../../../core/utils/uuid.utils';
import { FieldEditorDialogComponent } from '../field-editor-dialog/field-editor-dialog.component';
import { ArrayRenderComponent } from '../array-render/array-render.component';

interface PaletteTool {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-array-field-editor',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, ButtonModule, DialogModule, FieldEditorDialogComponent, ArrayRenderComponent],
  templateUrl: './array-field-editor.component.html',
  styleUrl: './array-field-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayFieldEditorComponent {
  field = input.required<FieldConfig>();
  parentForm = input<FormGroup>(new FormGroup({}));
  fieldUpdated = output<FieldConfig>();

  readonly showEditor = signal(false);
  readonly arrayFields = signal<FieldConfig[]>([]);
  readonly showFieldEditor = signal(false);
  readonly editingField = signal<FieldConfig | null>(null);

  // Available tools (excluding array and submit for nested fields)
  readonly tools: PaletteTool[] = [
    { type: 'input-text', label: 'Text Input', icon: 'pi-pencil', description: 'Single line text' },
    { type: 'password', label: 'Password', icon: 'pi-lock', description: 'Password field' },
    { type: 'input-number', label: 'Number', icon: 'pi-hashtag', description: 'Numeric input' },
    { type: 'textarea', label: 'Textarea', icon: 'pi-align-left', description: 'Multi-line text' },
    { type: 'select', label: 'Select', icon: 'pi-list', description: 'Dropdown list' },
    { type: 'multi-select', label: 'Multi Select', icon: 'pi-check-square', description: 'Multiple selection' },
    { type: 'checkbox', label: 'Checkbox', icon: 'pi-check', description: 'Single checkbox' },
    { type: 'radio', label: 'Radio', icon: 'pi-circle', description: 'Radio buttons' },
    { type: 'datepicker', label: 'Date Picker', icon: 'pi-calendar', description: 'Date selection' },
    { type: 'attachment', label: 'File Upload', icon: 'pi-upload', description: 'File attachment' },
  ];

  openEditor(): void {
    this.arrayFields.set([...(this.field().arrayFields || [])]);
    this.showEditor.set(true);
  }

  onDrop(event: CdkDragDrop<FieldConfig[]>): void {
    if (event.previousContainer === event.container) {
      // Reorder within array
      const fields = [...this.arrayFields()];
      moveItemInArray(fields, event.previousIndex, event.currentIndex);
      this.arrayFields.set(fields);
    } else {
      // Drop from palette
      const tool = event.item.data;
      
      if (!tool || !tool.type) {
        return;
      }

      const newField: FieldConfig = {
        id: generateId('field'),
        type: tool.type,
        formControlName: `${tool.type}_${Date.now()}`,
        label: tool.label,
        value: '',
        placeholder: `Enter ${tool.label.toLowerCase()}`,
        required: false,
        disabled: false,
        readonly: false,
        hidden: false,
        validators: [],
        options:
          tool.type === 'select' || tool.type === 'multi-select' || tool.type === 'radio'
            ? [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
              ]
            : undefined,
        style: {
          columns: 1,
          width: '100%',
        },
        class: 'w-full',
      };

      this.arrayFields.update((fields) => [...fields, newField]);
    }
  }

  onEditField(field: FieldConfig): void {
    this.editingField.set(field);
    this.showFieldEditor.set(true);
  }

  onFieldEditorSaved(updatedField: FieldConfig): void {
    this.arrayFields.update((fields) =>
      fields.map((f) => (f.id === updatedField.id ? updatedField : f))
    );
    this.showFieldEditor.set(false);
    this.editingField.set(null);
  }

  onFieldEditorCancelled(): void {
    this.showFieldEditor.set(false);
    this.editingField.set(null);
  }

  onRemoveField(fieldId: string): void {
    this.arrayFields.update((fields) => fields.filter((f) => f.id !== fieldId));
  }

  onSave(): void {
    const updatedField: FieldConfig = {
      ...this.field(),
      arrayFields: this.arrayFields(),
    };
    this.fieldUpdated.emit(updatedField);
    this.showEditor.set(false);
  }

  onCancel(): void {
    this.showEditor.set(false);
  }

  trackByFieldId(index: number, field: FieldConfig): string {
    return field.id;
  }
}
