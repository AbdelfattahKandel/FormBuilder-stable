import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { BuilderPreferencesService, StyleChoice, UiKitChoice } from '../../core/services/builder-preferences.service';

@Component({
  selector: 'app-get-started',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, RadioButtonModule, CardModule],
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetStartedComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _preferencesService = inject(BuilderPreferencesService);
  private readonly _router = inject(Router);

  readonly isLoading = signal(false);
  readonly currentStep = signal(1);

  _forPreferencesForm!: FormGroup;

  readonly styleOptions: Array<{ label: string; value: StyleChoice; icon: string; description: string }> = [
    {
      label: 'Tailwind CSS',
      value: 'tailwind',
      icon: 'pi pi-bolt',
      description: 'Utility-first CSS framework',
    },
    {
      label: 'Bootstrap',
      value: 'bootstrap',
      icon: 'pi pi-th-large',
      description: 'Popular CSS framework',
    },
    {
      label: 'Inline CSS',
      value: 'inline',
      icon: 'pi pi-code',
      description: 'Direct style attributes',
    },
  ];

  readonly uiKitOptions: Array<{ label: string; value: UiKitChoice; icon: string; description: string }> = [
    {
      label: 'PrimeNG',
      value: 'primeng',
      icon: 'pi pi-prime',
      description: 'Rich UI component library',
    },
    {
      label: 'Native HTML',
      value: 'native',
      icon: 'pi pi-globe',
      description: 'Standard HTML elements',
    },
  ];

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this._forPreferencesForm = this._fb.group({
      styleChoice: ['tailwind', [Validators.required]],
      uiKitChoice: ['primeng', [Validators.required]],
    });
  }

  onStartBuilding(): void {
    if (this._forPreferencesForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    const { styleChoice, uiKitChoice } = this._forPreferencesForm.value;

    this._preferencesService.setPreferences(styleChoice as StyleChoice, uiKitChoice as UiKitChoice);

    setTimeout(() => {
      this.isLoading.set(false);
      this._router.navigate(['/builder']);
    }, 300);
  }
}
