import { FieldType } from '../models/interfaces/type-field';
import { FieldStyle } from '../models/interfaces/field-style';
import { ValidatorConfig } from '../models/interfaces/validator-config';

/**
 * Field Configuration Interface
 * Represents a single form field configuration
 */
export interface FieldConfig {
  id: string;
  type: FieldType;
  formControlName: string;
  label: string;
  value: unknown;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  options?: FieldOption[];
  validators?: ValidatorConfig[];
  style?: FieldStyle;
  class?: string;
  metadata?: Record<string, unknown>;
  // Array-specific properties
  arrayFields?: FieldConfig[];
  arrayMinItems?: number;
  arrayMaxItems?: number;
  // Button-specific properties
  buttonType?: 'submit' | 'button' | 'reset';
  buttonAction?: string;
  buttonClass?: string;
  buttonStyle?: Record<string, string | number>;
  buttonIcon?: string;
  buttonIconPos?: 'left' | 'right';
  buttonLoading?: boolean;
  buttonDisabled?: boolean;
  buttonSize?: 'small' | 'medium' | 'large';
  buttonSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help';
}

/**
 * Field Option Interface
 * For select, radio, multi-select fields
 */
export interface FieldOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

/**
 * Form Control Data (from JSON export)
 */
export interface FieldControlData {
  formControlName?: string;
  formArrayName?: string;
  fieldType: FieldType;
  value: unknown;
  label?: string;
  placeholder?: string;
  options?: FieldOption[];
  validators?: ValidatorConfig[];
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  // Array-specific properties
  arrayFields?: FieldControlData[];
  arrayMinItems?: number;
  arrayMaxItems?: number;
  // Button-specific properties
  buttonType?: 'submit' | 'button' | 'reset';
  buttonAction?: string;
  buttonClass?: string;
  buttonStyle?: Record<string, string | number>;
  buttonIcon?: string;
  buttonIconPos?: 'left' | 'right';
  buttonLoading?: boolean;
  buttonDisabled?: boolean;
  buttonSize?: 'small' | 'medium' | 'large';
  buttonSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help';
}

/**
 * Field Control (JSON export format)
 */
export interface FieldControl {
  data: FieldControlData;
  class?: string;
  styles?: Record<string, string | number>;
}
