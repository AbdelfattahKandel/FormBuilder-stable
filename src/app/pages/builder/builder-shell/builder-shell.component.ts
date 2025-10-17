import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BuilderPreferencesService } from '../../../core/services/builder-preferences.service';
import { GroupManagerService } from '../../../core/services/group-manager.service';
import { SchemaSerializerService } from '../../../core/services/schema-serializer.service';
import { PaletteComponent } from '../components/palette/palette.component';
import { CanvasComponent } from '../components/canvas/canvas.component';
import { JsonViewerComponent } from '../../../shared/components/json-viewer/json-viewer.component';

@Component({
  selector: 'app-builder-shell',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToolbarModule,
    TabViewModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    PaletteComponent,
    CanvasComponent,
    JsonViewerComponent,
  ],
  providers: [MessageService],
  templateUrl: './builder-shell.component.html',
  styleUrl: './builder-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderShellComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _preferencesService = inject(BuilderPreferencesService);
  private readonly _groupManager = inject(GroupManagerService);
  private readonly _schemaSerializer = inject(SchemaSerializerService);
  private readonly _messageService = inject(MessageService);

  readonly styleChoice = this._preferencesService.styleChoice;
  readonly uiKitChoice = this._preferencesService.uiKitChoice;
  readonly groupNames = this._groupManager.groupNames;
  readonly currentGroup = this._groupManager.currentGroup;
  readonly hasGroups = this._groupManager.hasGroups;

  readonly showAddGroupDialog = signal(false);
  readonly newGroupName = signal('');
  readonly showJsonDialog = signal(false);
  readonly generatedJson = signal('');

  ngOnInit(): void {
    // Redirect if no preferences set
    if (!this._preferencesService.hasPreferences()) {
      this._router.navigate(['/get-started']);
      return;
    }

    // Add default group if none exists
    if (!this.hasGroups()) {
      this._groupManager.addGroup('default');
    }
  }

  onAddGroup(): void {
    this.showAddGroupDialog.set(true);
  }

  onConfirmAddGroup(): void {
    const name = this.newGroupName().trim();
    if (!name) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Invalid Name',
        detail: 'Group name cannot be empty',
      });
      return;
    }

    const success = this._groupManager.addGroup(name);
    if (success) {
      this._messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Group "${name}" added successfully`,
      });
      this.showAddGroupDialog.set(false);
      this.newGroupName.set('');
    } else {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Group name already exists',
      });
    }
  }

  onCancelAddGroup(): void {
    this.showAddGroupDialog.set(false);
    this.newGroupName.set('');
  }

  onSelectGroup(groupName: string): void {
    this._groupManager.selectGroup(groupName);
  }

  onRemoveGroup(groupName: string): void {
    const success = this._groupManager.removeGroup(groupName);
    if (success) {
      this._messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Group "${groupName}" removed`,
      });
    }
  }

  onViewJson(): void {
    try {
      const json = this._schemaSerializer.exportToJson();
      this.generatedJson.set(json);
      this.showJsonDialog.set(true);
    } catch (error) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to generate JSON',
      });
    }
  }

  onExportJson(): void {
    try {
      this._schemaSerializer.downloadJson('formify-schema');
      this._messageService.add({
        severity: 'success',
        summary: 'Export Success',
        detail: 'Schema exported successfully',
      });
    } catch (error) {
      this._messageService.add({
        severity: 'error',
        summary: 'Export Error',
        detail: 'Failed to export schema',
      });
    }
  }

  onImportJson(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const jsonString = reader.result as string;
          const success = this._schemaSerializer.importFromJson(jsonString);

          if (success) {
            this._messageService.add({
              severity: 'success',
              summary: 'Import Success',
              detail: 'Schema imported successfully',
            });
          } else {
            this._messageService.add({
              severity: 'error',
              summary: 'Import Error',
              detail: 'Invalid schema format',
            });
          }
        } catch (error) {
          this._messageService.add({
            severity: 'error',
            summary: 'Import Error',
            detail: 'Failed to read file',
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  onBackToSettings(): void {
    this._router.navigate(['/get-started']);
  }
}
