import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-diaglog',
  imports: [],
  templateUrl: './confirm-diaglog.html',
  styleUrl: './confirm-diaglog.css',
})
export class ConfirmDiaglog {
  @Input () message!:string
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
