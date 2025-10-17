import { ChangeDetectionStrategy, Component, input, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/interfaces/field-config.interface';
import { Image } from 'primeng/image';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-attachment',
  standalone: true,
  imports: [ReactiveFormsModule, Image, ButtonModule],
  templateUrl: './attachment.component.html',
  styleUrl: './attachment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class AttachmentComponent {
  field = input.required<FieldConfig>();
  imageUrl: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControlName as unknown;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field().formControlName;
    return typeof fc === 'string' ? fc : null;
  }

  onFileSelected(event: Event) {
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
    
    // Just set the file name (no upload service)
    if (ctrl) {
      ctrl.setValue(file.name);
      ctrl.markAsDirty();
      ctrl.markAsTouched();
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
}
