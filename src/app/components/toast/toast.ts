import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    @if (toast(); as toastData) {
      <div
        class="fixed bottom-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"
        [style.background-color]="toastData.type === 'success' ? '#2BAB6F' : '#EF4444'"
        [style.opacity]="isVisible() ? 1 : 0"
        [style.transform]="isVisible() ? 'translateY(0)' : 'translateY(20px)'"
      >
        <p class="text-white font-medium text-sm">{{ toastData.message }}</p>
      </div>
    }
  `,
  standalone: true,
})
export class Toast {
  private toastService = inject(ToastService);
  toast = this.toastService.toastData;
  isVisible = this.toastService.isVisible;
}
