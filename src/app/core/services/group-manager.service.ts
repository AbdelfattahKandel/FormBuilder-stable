import { Injectable, signal, computed } from '@angular/core';
import { FieldConfig } from '../interfaces/field-config.interface';

/**
 * GroupManagerService
 * Manages form groups and their fields
 * Single page with multiple groups (no pages concept)
 */
@Injectable({
  providedIn: 'root',
})
export class GroupManagerService {
  private readonly _groups = signal<Map<string, FieldConfig[]>>(new Map());
  private readonly _currentGroup = signal<string | null>(null);

  readonly groups = this._groups.asReadonly();
  readonly currentGroup = this._currentGroup.asReadonly();

  readonly groupNames = computed(() => {
    return Array.from(this._groups().keys());
  });

  readonly currentGroupFields = computed(() => {
    const groupName = this._currentGroup();
    if (!groupName) return [];
    return this._groups().get(groupName) || [];
  });

  readonly hasGroups = computed(() => {
    return this._groups().size > 0;
  });

  addGroup(name: string): boolean {
    if (!name || this._groups().has(name)) {
      return false;
    }

    this._groups.update((groups) => {
      const newGroups = new Map(groups);
      newGroups.set(name, []);
      return newGroups;
    });

    // Auto-select first group
    if (!this._currentGroup()) {
      this._currentGroup.set(name);
    }

    return true;
  }

  removeGroup(name: string): boolean {
    if (!this._groups().has(name)) {
      return false;
    }

    this._groups.update((groups) => {
      const newGroups = new Map(groups);
      newGroups.delete(name);
      return newGroups;
    });

    // If current group was removed, select first available
    if (this._currentGroup() === name) {
      const firstGroup = this.groupNames()[0];
      this._currentGroup.set(firstGroup || null);
    }

    return true;
  }

  selectGroup(name: string): boolean {
    if (!this._groups().has(name)) {
      return false;
    }

    this._currentGroup.set(name);
    return true;
  }

  addFieldToCurrentGroup(field: FieldConfig): boolean {
    const groupName = this._currentGroup();
    if (!groupName) {
      return false;
    }

    return this.addFieldToGroup(groupName, field);
  }

  addFieldToGroup(groupName: string, field: FieldConfig): boolean {
    if (!this._groups().has(groupName)) {
      return false;
    }

    this._groups.update((groups) => {
      const newGroups = new Map(groups);
      const fields = newGroups.get(groupName) || [];
      newGroups.set(groupName, [...fields, field]);
      return newGroups;
    });

    return true;
  }

  removeFieldFromCurrentGroup(fieldId: string): boolean {
    const groupName = this._currentGroup();
    if (!groupName) {
      return false;
    }

    return this.removeFieldFromGroup(groupName, fieldId);
  }

  removeFieldFromGroup(groupName: string, fieldId: string): boolean {
    if (!this._groups().has(groupName)) {
      return false;
    }

    this._groups.update((groups) => {
      const newGroups = new Map(groups);
      const fields = newGroups.get(groupName) || [];
      const updatedFields = fields.filter((f) => f.id !== fieldId);
      newGroups.set(groupName, updatedFields);
      return newGroups;
    });

    return true;
  }

  updateFieldInCurrentGroup(fieldId: string, updates: Partial<FieldConfig>): boolean {
    const groupName = this._currentGroup();
    if (!groupName) {
      return false;
    }

    return this.updateFieldInGroup(groupName, fieldId, updates);
  }

  updateFieldInGroup(groupName: string, fieldId: string, updates: Partial<FieldConfig>): boolean {
    if (!this._groups().has(groupName)) {
      return false;
    }

    this._groups.update((groups) => {
      const newGroups = new Map(groups);
      const fields = newGroups.get(groupName) || [];
      const updatedFields = fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f));
      newGroups.set(groupName, updatedFields);
      return newGroups;
    });

    return true;
  }

  reorderFieldsInCurrentGroup(fields: FieldConfig[]): boolean {
    const groupName = this._currentGroup();
    if (!groupName) {
      return false;
    }

    this._groups.update((groups) => {
      const newGroups = new Map(groups);
      newGroups.set(groupName, [...fields]);
      return newGroups;
    });

    return true;
  }

  clearCurrentGroup(): boolean {
    const groupName = this._currentGroup();
    if (!groupName) {
      return false;
    }

    this._groups.update((groups) => {
      const newGroups = new Map(groups);
      newGroups.set(groupName, []);
      return newGroups;
    });

    return true;
  }

  clearAllGroups(): void {
    this._groups.set(new Map());
    this._currentGroup.set(null);
  }

  setGroups(groups: Map<string, FieldConfig[]>): void {
    this._groups.set(new Map(groups));

    // Auto-select first group if none selected
    if (!this._currentGroup() && groups.size > 0) {
      const firstGroup = Array.from(groups.keys())[0];
      this._currentGroup.set(firstGroup);
    }
  }

  getAllGroups(): Map<string, FieldConfig[]> {
    return new Map(this._groups());
  }
}
