import { Component, inject, signal, OnDestroy } from '@angular/core';
import { ToastService, Toast as ToastData } from '../../services/toast.service';
import { Subscription } from 'rxjs';
import { TOAST_VISIBLE_DURATION_MS, TOAST_FADE_DURATION_MS } from '../../constants/app.constants';

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
export class Toast implements OnDestroy {
  private toastService = inject(ToastService);
  private subscription?: Subscription;

  toast = signal<ToastData | null>(null);
  isVisible = signal<boolean>(false);
  private timeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    this.subscription = this.toastService.toast$.subscribe((toast) => {
      this.showToast(toast);
    });
  }

  showToast(toast: ToastData | null) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (toast) {
      this.isVisible.set(true);
      this.toast.set(toast);

      this.timeoutId = setTimeout(() => {
        this.hideToast();
      }, TOAST_VISIBLE_DURATION_MS);
    } else {
      this.hideToast();
    }
  }

  hideToast() {
    this.isVisible.set(false);
    setTimeout(() => {
      this.toast.set(null);
    }, TOAST_FADE_DURATION_MS);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
