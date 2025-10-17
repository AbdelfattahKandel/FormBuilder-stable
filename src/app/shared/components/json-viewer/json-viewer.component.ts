import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-json-viewer',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './json-viewer.component.html',
  styleUrl: './json-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonViewerComponent {
  jsonString = input.required<string>();
  readonly copied = signal(false);

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.jsonString()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
