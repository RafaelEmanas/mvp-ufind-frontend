import { Injectable, signal, computed } from '@angular/core';

export interface Toast {
  message: string;
  type: 'error' | 'success';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toast = signal<Toast | null>(null);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private isExiting = signal(false);

  toastData = computed(() => this.toast());
  isVisible = computed(() => this.toast() !== null && !this.isExiting());

  show(message: string, type: 'error' | 'success') {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.isExiting.set(false);
    this.toast.set({ message, type });

    this.timeoutId = setTimeout(() => {
      this.hide();
    }, 5000);
  }

  hide() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isExiting.set(true);
    setTimeout(() => {
      this.toast.set(null);
    }, 300);
  }
}
