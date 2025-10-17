import { ChangeDetectionStrategy, Component, input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/interfaces/field-config.interface';

@Component({
  selector: 'app-native-attachment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class NativeAttachmentComponent {
  field = input.required<FieldConfig>();
  imageUrl: string | null = null;
  private readonly _generatedControlId = `attachment_${crypto.randomUUID()}`;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControlName as any;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field().formControlName;
    if (typeof fc === 'string' && fc.trim()) {
      return fc;
    }
    return null;
  }

  controlId(): string {
    return this.controlName() ?? this._generatedControlId;
  }

  isDisabled(): boolean {
    const control = this.formControlInst();
    if (control) {
      return control.disabled;
    }
    return !!this.field().disabled;
  }

  displayValue(): string | null {
    const control = this.formControlInst();
    const value = control ? control.value : this.field().value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return String(value);
  }

  acceptTypes(): string | undefined {
    const props = (this.field() as any).componentProps;
    const accept: unknown = props?.accept ?? props?.acceptTypes;
    if (typeof accept === 'string' && accept.trim()) {
      return accept;
    }
    return undefined;
  }

  onFileSelected(event: Event) {
    if (this.isDisabled()) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Preview only for images
    if (file.type && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imageUrl = null;
    }

    const ctrl = this.formControlInst();
    
    // Just set the file name for now (no upload service)
    if (ctrl) {
      ctrl.setValue(file.name);
      ctrl.markAsDirty();
      ctrl.markAsTouched();
    }
  }

  triggerFileInput() {
    if (this.isDisabled()) {
      return;
    }
    this.fileInput.nativeElement.click();
  }
}
