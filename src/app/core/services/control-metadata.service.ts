import { Injectable } from '@angular/core';
import { FieldType } from '../models/interfaces/type-field';

export interface ControlMetadata {
  type: FieldType;
  component: string;
  defaultValue: any;
  hasOptions: boolean;
  category: 'input' | 'select' | 'date' | 'file' | 'special';
}

@Injectable({
  providedIn: 'root',
})
export class ControlMetadataService {
  private readonly _metadata: Map<FieldType, ControlMetadata> = new Map([
    [
      'input-text',
      {
        type: 'input-text',
        component: 'InputtextComponent',
        defaultValue: '',
        hasOptions: false,
        category: 'input',
      },
    ],
    [
      'password',
      {
        type: 'password',
        component: 'PasswordComponent',
        defaultValue: '',
        hasOptions: false,
        category: 'input',
      },
    ],
    [
      'input-number',
      {
        type: 'input-number',
        component: 'InputnumberComponent',
        defaultValue: 0,
        hasOptions: false,
        category: 'input',
      },
    ],
    [
      'textarea',
      {
        type: 'textarea',
        component: 'TextareaComponent',
        defaultValue: '',
        hasOptions: false,
        category: 'input',
      },
    ],
    [
      'select',
      {
        type: 'select',
        component: 'SelectComponent',
        defaultValue: null,
        hasOptions: true,
        category: 'select',
      },
    ],
    [
      'multi-select',
      {
        type: 'multi-select',
        component: 'MultiselectComponent',
        defaultValue: [],
        hasOptions: true,
        category: 'select',
      },
    ],
    [
      'checkbox',
      {
        type: 'checkbox',
        component: 'CheckboxComponent',
        defaultValue: false,
        hasOptions: false,
        category: 'input',
      },
    ],
    [
      'radio',
      {
        type: 'radio',
        component: 'RadiobuttonComponent',
        defaultValue: null,
        hasOptions: true,
        category: 'select',
      },
    ],
    [
      'datepicker',
      {
        type: 'datepicker',
        component: 'DatepickerComponent',
        defaultValue: null,
        hasOptions: false,
        category: 'date',
      },
    ],
    [
      'attachment',
      {
        type: 'attachment',
        component: 'AttachmentComponent',
        defaultValue: null,
        hasOptions: false,
        category: 'file',
      },
    ],
    [
      'array',
      {
        type: 'array',
        component: 'ArrayComponent',
        defaultValue: [],
        hasOptions: false,
        category: 'special',
      },
    ],
    [
      'submit',
      {
        type: 'submit',
        component: 'ButtonComponent',
        defaultValue: null,
        hasOptions: false,
        category: 'special',
      },
    ],
  ]);

  getMetadata(type: FieldType): ControlMetadata | undefined {
    return this._metadata.get(type);
  }

  getDefaultValue(type: FieldType): any {
    return this._metadata.get(type)?.defaultValue ?? '';
  }

  hasOptions(type: FieldType): boolean {
    return this._metadata.get(type)?.hasOptions ?? false;
  }

  getAllTypes(): FieldType[] {
    return Array.from(this._metadata.keys());
  }
}
