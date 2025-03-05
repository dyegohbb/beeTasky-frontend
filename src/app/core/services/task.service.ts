import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskDTO, TaskFilterDTO } from '../models/task.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'api/tasks';

  constructor(private http: HttpClient) { }

  getTasks(filter: TaskFilterDTO, page: number, size: number, sort: string): Observable<ApiResponse<TaskDTO[]>> {
    let params = new HttpParams();

    if (filter.identifier) {
      params = params.set('taskIdentifier', filter.identifier);
    }
    if (filter.title) {
      params = params.set('title', filter.title);
    }
    if (filter.status) {
      params = params.set('status', filter.status);
    }

    if (filter.createdOnStartDate) {
      const createdOnStart = new Date(filter.createdOnStartDate);
      params = params.set('createdOnStartDate', createdOnStart.toISOString().replace('Z', ''));
    }
    if (filter.createdOnEndDate) {
      const createdOnEnd = new Date(filter.createdOnEndDate);
      params = params.set('createdOnEndDate', createdOnEnd.toISOString().replace('Z', ''));
    }
    if (filter.deadlineStartDate) {
      const deadlineStart = new Date(filter.deadlineStartDate);
      params = params.set('deadlineStartDate', deadlineStart.toISOString().replace('Z', ''));
    }
    if (filter.deadlineEndDate) {
      const deadlineEnd = new Date(filter.deadlineEndDate);
      params = params.set('deadlineEndDate', deadlineEnd.toISOString().replace('Z', ''));
    }    

    params = params.set('page', page)
              .set('size', size)
              .set('sort', sort);

    return this.http.get<ApiResponse<TaskDTO[]>>(this.apiUrl, { params });
  }

  createTask(task: TaskDTO): Observable<ApiResponse<TaskDTO>> {
    return this.http.post<ApiResponse<TaskDTO>>(this.apiUrl, {
      title: task.title,
      description: task.description,
      status: task.status,
      deadline: task.deadline
    });
  }

  updateTask(taskId: string, task: TaskDTO): Observable<ApiResponse<TaskDTO>> {
    return this.http.put<ApiResponse<TaskDTO>>(`${this.apiUrl}/${taskId}`, {
      title: task.title,
      description: task.description,
      status: task.status,
      deadline: task.deadline
    });
  }

  deleteTask(taskId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${taskId}`);
  }
}
