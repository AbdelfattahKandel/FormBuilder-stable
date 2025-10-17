import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GroupManagerService } from '../../../../core/services/group-manager.service';
import { FieldConfig } from '../../../../core/interfaces/field-config.interface';
import { generateId } from '../../../../core/utils/uuid.utils';
import { RendererComponent } from '../renderer/renderer.component';
import { FieldEditorDialogComponent } from '../../../../shared/components/field-editor-dialog/field-editor-dialog.component';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, ButtonModule, DialogModule, RendererComponent, FieldEditorDialogComponent],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent {
  private readonly _groupManager = inject(GroupManagerService);
  private readonly _messageService = inject(MessageService);

  readonly currentGroup = this._groupManager.currentGroup;
  readonly currentGroupFields = this._groupManager.currentGroupFields;
  readonly selectedFieldId = signal<string | null>(null);
  readonly showFieldEditor = signal(false);
  readonly editingField = signal<FieldConfig | null>(null);

  onDrop(event: CdkDragDrop<any>): void {
    if (event.previousContainer === event.container) {
      // Reorder within canvas
      const fields = [...this.currentGroupFields()];
      moveItemInArray(fields, event.previousIndex, event.currentIndex);
      this._groupManager.reorderFieldsInCurrentGroup(fields);
    } else {
      // Drop from palette - use event.item.data
      const tool = event.item.data;
      
      if (!tool || !tool.type) {
        console.error('Invalid tool data:', tool);
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
        buttonType: tool.type === 'submit' ? 'submit' : undefined,
        buttonAction: tool.type === 'submit' ? 'submit' : undefined,
        buttonIcon: tool.type === 'submit' ? 'pi pi-check' : undefined,
        buttonIconPos: tool.type === 'submit' ? 'right' : undefined,
        buttonSize: tool.type === 'submit' ? 'medium' : undefined,
        buttonSeverity: tool.type === 'submit' ? 'primary' : undefined,
        buttonLoading: false,
        buttonDisabled: false,
        arrayFields: tool.type === 'array' ? [] : undefined,
        arrayMinItems: tool.type === 'array' ? 1 : undefined,
        arrayMaxItems: tool.type === 'array' ? 10 : undefined,
        style: {
          columns: 2,
          width: '100%',
        },
        class: 'col-span-2 w-full',
      };

      this._groupManager.addFieldToCurrentGroup(newField);
      this._messageService.add({
        severity: 'success',
        summary: 'Field Added',
        detail: `${tool.label} added to canvas`,
      });
    }
  }

  onSelectField(fieldId: string): void {
    this.selectedFieldId.set(fieldId);
  }

  onEditField(field: FieldConfig): void {
    this.editingField.set(field);
    this.showFieldEditor.set(true);
  }

  onFieldSaved(updatedField: FieldConfig): void {
    this._groupManager.updateFieldInCurrentGroup(updatedField.id, updatedField);
    this.showFieldEditor.set(false);
    this.editingField.set(null);
    this._messageService.add({
      severity: 'success',
      summary: 'Field Updated',
      detail: 'Field properties updated successfully',
    });
  }

  onFieldEditorCancelled(): void {
    this.showFieldEditor.set(false);
    this.editingField.set(null);
  }

  onFieldUpdated(updatedField: FieldConfig): void {
    this._groupManager.updateFieldInCurrentGroup(updatedField.id, updatedField);
    this._messageService.add({
      severity: 'success',
      summary: 'Array Updated',
      detail: 'Array fields updated successfully',
    });
  }

  onRemoveField(fieldId: string): void {
    this._groupManager.removeFieldFromCurrentGroup(fieldId);
    if (this.selectedFieldId() === fieldId) {
      this.selectedFieldId.set(null);
    }
    this._messageService.add({
      severity: 'info',
      summary: 'Field Removed',
      detail: 'Field removed from canvas',
    });
  }

  trackByFieldId(index: number, field: FieldConfig): string {
    return field.id;
  }
}
