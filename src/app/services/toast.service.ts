import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'error' | 'success';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<Toast | null>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'error' | 'success') {
    this.toastSubject.next({ message, type });
  }

  hide() {
    this.toastSubject.next(null);
  }
}
