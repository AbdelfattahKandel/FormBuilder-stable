import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldConfig } from '../../../../../core/interfaces/field-config.interface';

@Component({
  selector: 'app-image-input',
  imports: [],
  templateUrl : './image-input.component.html',
  styleUrl: './image-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageInputComponent { 

  field = input.required<FieldConfig>();

}
