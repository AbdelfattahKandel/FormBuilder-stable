import { Component, ChangeDetectionStrategy, input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { FieldConfig } from '../../../core/interfaces/field-config.interface';
import { BuilderPreferencesService } from '../../../core/services/builder-preferences.service';

// Import all control components
import { InputtextComponent } from '../controls/primeng-controls/inputtext/inputtext.component';
import { PasswordComponent } from '../controls/primeng-controls/password/password.component';
import { InputnumberComponent } from '../controls/primeng-controls/inputnumber/inputnumber.component';
import { TextareaComponent } from '../controls/primeng-controls/textarea/textarea.component';
import { SelectComponent } from '../controls/primeng-controls/select/select.component';
import { MultiselectComponent } from '../controls/primeng-controls/multiselect/multiselect.component';
import { CheckboxComponent } from '../controls/primeng-controls/checkbox/checkbox.component';
import { RadiobuttonComponent } from '../controls/primeng-controls/radiobutton/radiobutton.component';
import { DatepickerComponent } from '../controls/primeng-controls/datepicker/datepicker.component';
import { AttachmentComponent } from '../controls/primeng-controls/attachment/attachment.component';

import { NativeInputtextComponent } from '../controls/native-controls/inputtext/inputtext.component';
import { NativePasswordComponent } from '../controls/native-controls/password/password.component';
import { NativeInputNumberComponent } from '../controls/native-controls/inputnumber/inputnumber.component';
import { NativeTextareaComponent } from '../controls/native-controls/textarea/textarea.component';
import { NativeSelectComponent } from '../controls/native-controls/select/select.component';
import { NativeMultiselectComponent } from '../controls/native-controls/multiselect/multiselect.component';
import { NativeCheckboxComponent } from '../controls/native-controls/checkbox/checkbox.component';
import { NativeRadiobuttonComponent } from '../controls/native-controls/radiobutton/radiobutton.component';
import { NativeDatepickerComponent } from '../controls/native-controls/datepicker/datepicker.component';
import { NativeAttachmentComponent } from '../controls/native-controls/attachment/attachment.component';

@Component({
  selector: 'app-array-render',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // PrimeNG
    InputtextComponent,
    PasswordComponent,
    InputnumberComponent,
    TextareaComponent,
    SelectComponent,
    MultiselectComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    DatepickerComponent,
    AttachmentComponent,
    // Native
    NativeInputtextComponent,
    NativePasswordComponent,
    NativeInputNumberComponent,
    NativeTextareaComponent,
    NativeSelectComponent,
    NativeMultiselectComponent,
    NativeCheckboxComponent,
    NativeRadiobuttonComponent,
    NativeDatepickerComponent,
    NativeAttachmentComponent,
  ],
  templateUrl: './array-render.component.html',
  styleUrl: './array-render.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayRenderComponent implements OnInit {
  private readonly _builderPreferences = inject(BuilderPreferencesService);

  arrayField = input.required<FieldConfig>();
  parentForm = input.required<FormGroup>();

  ngOnInit(): void {
    this.initializeFormArray();
  }

  private initializeFormArray(): void {
    const formArrayName = this.arrayField().formControlName || 'items';
    const existingArray = this.parentForm().get(formArrayName) as FormArray;

    if (!existingArray) {
      const newArray = new FormArray([this.createItemGroup()]);
      this.parentForm().addControl(formArrayName, newArray);
    }
  }

  private createItemGroup(): FormGroup {
    const fields = this.arrayField().arrayFields || [];
    const group: any = {};

    fields.forEach((field) => {
      const controlName = field.formControlName || field.id || `field_${Date.now()}`;
      group[controlName] = new FormControl('');
    });

    return new FormGroup(group);
  }

  getFormArray(): FormArray {
    const formArrayName = this.arrayField().formControlName || 'items';
    return this.parentForm().get(formArrayName) as FormArray;
  }

  addItem(): void {
    this.getFormArray().push(this.createItemGroup());
  }

  removeItem(index: number): void {
    this.getFormArray().removeAt(index);
  }

  isNativeLibrary(): boolean {
    return this._builderPreferences.uiKitChoice() === 'native';
  }
}
