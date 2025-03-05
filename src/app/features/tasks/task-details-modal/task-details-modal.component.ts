import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TaskDTO } from '../../../core/models/task.model';

type ModalMode = 'create' | 'view' | 'edit';

@Component({
  selector: 'app-task-details-modal',
  templateUrl: './task-details-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TaskDetailsModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() task?: TaskDTO;
  @Input() mode: ModalMode = 'view';
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveTask = new EventEmitter<TaskDTO>();
  @Output() deleteTask = new EventEmitter<string>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']?.currentValue === true || changes['task']) {
      this.initForm();
      
      if (this.task) {
        this.mode = 'view';
      }
    }
  }

  private initForm() {
    this.form = this.fb.group({
      title: [{
        value: this.task?.title || '',
        disabled: this.mode === 'view'
      }, [Validators.required]],
      description: [{
        value: this.task?.description || '',
        disabled: this.mode === 'view'
      }],
      status: [{
        value: this.task?.status || 'PENDING',
        disabled: this.mode === 'view'
      }, [Validators.required]],
      deadline: [{
        value: this.task?.deadline,
        disabled: this.mode === 'view'
      }, [Validators.required, this.deadlineValidator()]]
    });
  }

  switchToEditMode(): void {
    this.mode = 'edit';
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.enable();
    });
  }

  getStatusColor(status: string | undefined): string {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  close(): void {
    if(this.mode === 'edit') {
      this.mode = 'view';
    }
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const taskData = {
        ...this.task,
        ...this.form.getRawValue(),
      };
      this.saveTask.emit(taskData);
      this.close();
    }
  }

  private deadlineValidator(): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const deadline = new Date(control.value);
      const now = new Date();
      
      if (deadline < now) {
        return { pastDate: true };
      }
      
      return null;
    };
  }

  get deadlineControl() {
    return this.form.get('deadline');
  }

  onDelete(): void {
    Swal.fire({
      title: 'Tem certeza?',
      html: `Você está prestes a excluir a task:<br><br>
             <b>${this.task?.title}</b><br><br>
             Esta ação não poderá ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed && this.task?.identifier) {
        this.deleteTask.emit(this.task.identifier);
        this.close();
      }
    });
  }

}
