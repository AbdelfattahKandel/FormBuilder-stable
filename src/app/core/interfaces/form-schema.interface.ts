import { FieldControl } from './field-config.interface';
import { StyleChoice } from '../services/builder-preferences.service';

/**
 * Form Schema Interface
 * Represents a single form within a group
 */
export interface FormSchema {
  id: string;
  formGroup: string;
  containerClass?: string;
  containerStyles?: Record<string, string | number>;
  controls: FieldControl[];
}

/**
 * Complete Export Schema Interface
 * Top-level structure for JSON export/import
 */
export interface ExportSchema {
  styleFramework: StyleChoice;
  forms: Record<string, FormSchema[]>;
}

/**
 * Group Data Interface
 * Internal representation of a group with its forms
 */
export interface GroupData {
  name: string;
  forms: FormSchema[];
}
