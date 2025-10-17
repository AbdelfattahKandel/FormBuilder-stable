import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { BuilderPreferencesService } from '../../../../core/services/builder-preferences.service';
import { FieldType } from '../../../../core/models/interfaces/type-field';

interface PaletteTool {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-palette',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList],
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteComponent {
  private readonly _preferencesService = inject(BuilderPreferencesService);

  readonly uiKitChoice = this._preferencesService.uiKitChoice;

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
    { type: 'array', label: 'Array', icon: 'pi-th-large', description: 'Repeatable fields' },
    { type: 'submit', label: 'Submit Button', icon: 'pi-send', description: 'Form submit' },
  ];
}
