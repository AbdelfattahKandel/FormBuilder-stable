import { Injectable, inject } from '@angular/core';
import { GroupManagerService } from './group-manager.service';
import { BuilderPreferencesService } from './builder-preferences.service';
import { ExportSchema, FormSchema } from '../interfaces/form-schema.interface';
import { FieldConfig, FieldControlData } from '../interfaces/field-config.interface';
import { generateFormId } from '../utils/uuid.utils';
import { ControlMetadataService } from './control-metadata.service';

/**
 * SchemaSerializerService
 * Handles export and import of form schemas
 * Format: { styleFramework, forms: { groupName: [FormSchema] } }
 */
@Injectable({
  providedIn: 'root',
})
export class SchemaSerializerService {
  private readonly _groupManager = inject(GroupManagerService);
  private readonly _preferencesService = inject(BuilderPreferencesService);
  private readonly _controlMetadata = inject(ControlMetadataService);

  /**
   * Export all groups to JSON string
   */
  exportToJson(): string {
    const groups = this._groupManager.getAllGroups();
    const styleFramework = this._preferencesService.styleChoice() || 'tailwind';

    const forms: Record<string, FormSchema[]> = {};

    groups.forEach((fields, groupName) => {
      const formSchema: any = {
        containerClass:
          styleFramework === 'tailwind'
            ? 'container grid grid-cols-4 gap-1 p-2 bg-white border border-slate-200 rounded-lg shadow-sm max-w-7xl mx-auto'
            : styleFramework === 'bootstrap'
            ? 'container row g-2 p-2 bg-white border rounded shadow-sm'
            : undefined,
        controls: fields.map((field) => this.mapFieldToControl(field, styleFramework)),
      };

      // Add containerStyles only for inline style
      if (styleFramework === 'inline') {
        formSchema.containerStyles = {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.25rem',
          padding: '0.5rem',
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          maxWidth: '80rem',
          margin: '0 auto',
        };
      }

      forms[groupName] = formSchema;
    });

    const exportSchema: ExportSchema = {
      styleFramework,
      forms,
    };

    return JSON.stringify(exportSchema, null, 2);
  }

  private mapFieldToControlData(field: FieldConfig): FieldControlData {
    return {
      formControlName: field.formControlName,
      fieldType: field.type,
      value: field.value ?? '',
      label: field.label,
      placeholder: field.placeholder,
      options: field.options,
      validators: field.validators,
      required: field.required,
      disabled: field.disabled,
      readonly: field.readonly,
    };
  }

  private mapFieldToControl(field: FieldConfig, styleFramework: string): any {
    const columns = field.style?.columns || 2;
    const metadata = this._controlMetadata.getMetadata(field.type);

    // Build simplified control object
    const control: any = {
      fieldType: field.type,
      formControlName: field.formControlName,
      label: field.label,
      value: field.value ?? metadata?.defaultValue ?? '',
    };

    // Add optional fields only if they have values
    if (field.placeholder) {
      control.placeholder = field.placeholder;
    }
    if (field.required) {
      control.required = true;
    }
    if (field.disabled) {
      control.disabled = true;
    }
    if (field.readonly) {
      control.readonly = true;
    }
    if (field.options && field.options.length > 0) {
      control.options = field.options;
    }
    if (field.validators && field.validators.length > 0) {
      control.validators = field.validators;
    }

    // Handle special field types
    if (field.type === 'array') {
      control.formArrayName = field.formControlName;
      control.arrayFields = field.arrayFields?.map((f) => this.mapFieldToControlData(f)) || [];
      if (field.arrayMinItems) control.arrayMinItems = field.arrayMinItems;
      if (field.arrayMaxItems) control.arrayMaxItems = field.arrayMaxItems;
      delete control.formControlName;
    } else if (field.type === 'submit') {
      control.buttonType = field.buttonType || 'submit';
      if (field.buttonAction) control.buttonAction = field.buttonAction;
      if (field.buttonClass) control.buttonClass = field.buttonClass;
      if (field.buttonIcon) control.buttonIcon = field.buttonIcon;
      if (field.buttonIconPos) control.buttonIconPos = field.buttonIconPos;
      delete control.formControlName;
    }

    // Apply styling based on framework
    if (styleFramework === 'tailwind') {
      control.class = `col-span-${columns} w-full`;
    } else if (styleFramework === 'bootstrap') {
      control.class = `col-${columns * 3} mb-3`;
    } else {
      control.styles = {
        gridColumn: `span ${columns}`,
        width: '100%',
      };
    }

    return control;
  }

  /**
   * Import schema from JSON string
   */
  importFromJson(jsonString: string): boolean {
    try {
      const schema = JSON.parse(jsonString) as ExportSchema;

      if (!schema.forms || typeof schema.forms !== 'object') {
        throw new Error('Invalid schema format');
      }

      // Clear existing groups
      this._groupManager.clearAllGroups();

      // Import groups
      const groupsMap = new Map<string, FieldConfig[]>();

      Object.entries(schema.forms).forEach(([groupName, formSchemaOrArray]: [string, any]) => {
        const fields: FieldConfig[] = [];

        // Support both old format (array) and new format (object)
        const formSchemas = Array.isArray(formSchemaOrArray) ? formSchemaOrArray : [formSchemaOrArray];

        formSchemas.forEach((formSchema) => {
          formSchema.controls.forEach((control: any) => {
            // Support both old format (control.data) and new format (flat control)
            const controlData = control.data || control;
            
            // Determine formControlName based on field type
            let formControlName = '';
            if (controlData.fieldType === 'array') {
              formControlName = controlData.formArrayName || 'array';
            } else if (controlData.fieldType === 'submit') {
              formControlName = `submit_${Date.now()}`;
            } else {
              formControlName = controlData.formControlName || `field_${Date.now()}`;
            }

            const field: FieldConfig = {
              id: `field_${Date.now()}_${Math.random()}`,
              type: controlData.fieldType,
              formControlName,
              label: controlData.label || '',
              value: controlData.value,
              placeholder: controlData.placeholder,
              required: controlData.required || false,
              disabled: controlData.disabled || false,
              readonly: controlData.readonly || false,
              hidden: false,
              options: controlData.options,
              validators: controlData.validators || [],
              style: {},
              class: control.class || (control.data ? undefined : controlData.class) || 'col-span-2 w-full',
            };

            fields.push(field);
          });
        });

        groupsMap.set(groupName, fields);
      });

      this._groupManager.setGroups(groupsMap);

      // Update style preference if provided
      if (schema.styleFramework) {
        this._preferencesService.setStyleChoice(schema.styleFramework);
      }

      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  /**
   * Download schema as JSON file
   */
  downloadJson(filename: string = 'formify-schema'): void {
    const json = this.exportToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
