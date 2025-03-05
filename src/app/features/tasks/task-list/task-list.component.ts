import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDTO, TaskFilterDTO, TaskStatusEnum } from '../../../core/models/task.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { TaskDetailsModalComponent } from '../task-details-modal/task-details-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  standalone: true,
  imports: [CommonModule, TaskDetailsModalComponent, ReactiveFormsModule]
})
export class TaskListComponent {
  filterForm: FormGroup;
  statusOptions = Object.values(TaskStatusEnum);
  filterVisible = false;
  dateErrors = {
    createdOn: false,
    deadline: false
  };
  tasks: TaskDTO[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 10;
  hasNextPage = false;
  selectedTask?: TaskDTO;
  isModalOpen = false;
  modalMode: 'create' | 'view' | 'edit' = 'view';

  constructor(private fb: FormBuilder, private taskService: TaskService, private toastr: ToastrService) {
    this.filterForm = this.fb.group({
      identifier: [null],
      title: [null],
      status: [''],
      createdOnStartDate: [null],
      createdOnEndDate: [null],
      deadlineStartDate: [null],
      deadlineEndDate: [null],
      sortField: ['deadline'],
      sortDirection: ['desc']
    });

    this.filterForm.get('createdOnStartDate')?.valueChanges.subscribe(() => this.validateCreatedOnDates());
    this.filterForm.get('createdOnEndDate')?.valueChanges.subscribe(() => this.validateCreatedOnDates());
    this.filterForm.get('deadlineStartDate')?.valueChanges.subscribe(() => this.validateDeadlineDates());
    this.filterForm.get('deadlineEndDate')?.valueChanges.subscribe(() => this.validateDeadlineDates());
  }

  validateCreatedOnDates(): void {

    let startDateString = this.filterForm.get('createdOnStartDate')?.value;
    let endDateString = this.filterForm.get('createdOnEndDate')?.value;

    let startDate = new Date(startDateString);
    let endDate = new Date(endDateString);

    if ((startDateString && endDateString) && startDate > endDate) {
      this.dateErrors.createdOn = true;
    } else {
      this.dateErrors.createdOn = false;
    }
  }

  validateDeadlineDates(): void {

    let startDateString = this.filterForm.get('deadlineStartDate')?.value;
    let endDateString = this.filterForm.get('deadlineEndDate')?.value;

    let startDate = new Date(startDateString);
    let endDate = new Date(endDateString);

    if ((startDateString && endDateString) && startDate > endDate) {
      this.dateErrors.deadline = true;
    } else {
      this.dateErrors.deadline = false;
    }
  }

  ngOnInit() {
    this.loadTasks({
      identifier: null,
      title: null,
      status: null,
      createdOnStartDate: null,
      createdOnEndDate: null,
      deadlineStartDate: null,
      deadlineEndDate: null
    }, 0, this.pageSize, 'deadline,asc');
  }

  loadTasks(filter: TaskFilterDTO, page: number, size: number, sort: string) {
    this.loading = true;
    this.error = null;

    this.taskService.getTasks(filter, page, size, sort).subscribe({
      next: (response) => {
        this.tasks = response?.content ?? [];
        this.loading = false;
        this.hasNextPage = response?.hasNextPage ?? false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar as tasks. Tente novamente.';
        this.loading = false;
        this.toastr.error('Erro ao carregar as tasks. Tente novamente.');
        console.error('Erro:', err);
      }
    });
  }

  getStatusColor(status: TaskStatusEnum): string {
    let colors = {
      [TaskStatusEnum.PENDING]: 'bg-gray-100 text-gray-800',
      [TaskStatusEnum.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
      [TaskStatusEnum.COMPLETED]: 'bg-green-100 text-green-800'
    };
    return colors[status];
  }

  applyFilter(): void {
    this.currentPage = 0;
    this.validateCreatedOnDates();
    this.validateDeadlineDates();

    if (this.dateErrors.createdOn || this.dateErrors.deadline) {
      return;
    }

    let filter: TaskFilterDTO = {
      identifier: this.filterForm.get('identifier')?.value || null,
      title: this.filterForm.get('title')?.value || null,
      status: this.filterForm.get('status')?.value || null,
      createdOnStartDate: this.filterForm.get('createdOnStartDate')?.value,
      createdOnEndDate: this.filterForm.get('createdOnEndDate')?.value,
      deadlineStartDate: this.filterForm.get('deadlineStartDate')?.value,
      deadlineEndDate: this.filterForm.get('deadlineEndDate')?.value
    };

    const sortField = this.filterForm.get('sortField')?.value;
    const sortDirection = this.filterForm.get('sortDirection')?.value;
    const sort = `${sortField},${sortDirection}`;

    this.loadTasks(filter, this.currentPage, this.pageSize, sort);
  }

  toggleSortDirection(): void {
    const currentDirection = this.filterForm.get('sortDirection')?.value;
    this.filterForm.patchValue({
      sortDirection: currentDirection === 'asc' ? 'desc' : 'asc'
    });
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    const filter: TaskFilterDTO = {
      identifier: this.filterForm.get('identifier')?.value || '',
      title: this.filterForm.get('title')?.value || '',
      status: this.filterForm.get('status')?.value || null,
      createdOnStartDate: this.filterForm.get('createdOnStartDate')?.value,
      createdOnEndDate: this.filterForm.get('createdOnEndDate')?.value,
      deadlineStartDate: this.filterForm.get('deadlineStartDate')?.value,
      deadlineEndDate: this.filterForm.get('deadlineEndDate')?.value
    };

    const sortField = this.filterForm.get('sortField')?.value;
    const sortDirection = this.filterForm.get('sortDirection')?.value;
    const sort = `${sortField},${sortDirection}`;

    this.loadTasks(filter, this.currentPage, this.pageSize, sort);
  }

  changePageSize(event: Event): void {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.pageSize = newSize;
    this.currentPage = 0;
  }

  refreshTasks(): void {
    this.applyFilter();
  }

  openCreateTask(): void {
    this.selectedTask = undefined;
    this.modalMode = 'create';
    this.isModalOpen = true;
  }

  openTaskDetails(task: TaskDTO): void {
    this.selectedTask = task;
    this.modalMode = 'view';
    this.isModalOpen = true;
  }

  onSaveTask(taskData: TaskDTO): void {
    if (taskData.identifier) {
      this.taskService.updateTask(taskData.identifier, taskData).subscribe({
        next: (response) => {
          this.toastr.success('Task atualizada com sucesso!', 'Sucesso');
          this.applyFilter();
          this.isModalOpen = false;
        },
        error: (error) => {
          this.isModalOpen = false;
          console.error('Erro ao atualizar task:', error);
          this.toastr.error(
            error.error?.message || 'Não foi possível atualizar a task. Tente novamente.',
            'Erro'
          );
        }
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: (response) => {
          this.toastr.success('Task criada com sucesso!', 'Sucesso');
          this.applyFilter();
          this.isModalOpen = false;
        },
        error: (error) => {
          console.error('Erro ao criar task:', error);
          this.toastr.error(
            error.error?.message || 'Não foi possível criar a task. Tente novamente.',
            'Erro'
          );
        }
      });
    }
  }

  onDeleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.isModalOpen = false;
        this.toastr.success('Task excluída com sucesso!', 'Sucesso');
        this.applyFilter();
      },
      error: (error) => {
        this.isModalOpen = false;
        console.error('Erro ao excluir task:', error);
        this.toastr.error(
          error.error?.message || 'Não foi possível excluir a task. Tente novamente.',
          'Erro'
        );
      }
    });
  }
}
