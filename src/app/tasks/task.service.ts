import { Injectable } from '@angular/core';
import { Queue } from 'typescript-collections';
import { Task } from './task';
import { Observable, ReplaySubject } from 'rxjs';
import { LogService } from '../diagnostics/log.service';

@Injectable({
	providedIn: 'root'
})
export class TaskService {
	private tasks: Queue<Task>;
	private activeTaskChangeSubject: ReplaySubject<Task>;
	private busyChangeSubject: ReplaySubject<boolean>;

	constructor(private logService: LogService) {
		this.tasks = new Queue<Task>();
		this.activeTaskChangeSubject = new ReplaySubject<Task>(1);
		this.busyChangeSubject = new ReplaySubject<boolean>(1);
	}

	public activeTask: Task;
	public get busyChanges(): Observable<boolean> {
		return this.busyChangeSubject.asObservable();
	}

	public get activeTaskChanges(): Observable<Task> {
		return this.activeTaskChangeSubject.asObservable();
	}

	public enqueue(task: Task) {
		this.tasks.enqueue(task);
	}

	public dequeue() {
		this.tasks.dequeue();
	}

	public reset(): any {
		this.tasks.clear();
	}

	public async process() {
		try {
			this.busyChangeSubject.next(true);

			while (this.tasks.size() > 0) {
				this.activeTask = this.tasks.dequeue();
				this.activeTaskChangeSubject.next(this.activeTask);
				await this.activeTask.run();
			}
		} catch (e) {
			this.logService.error(e);
		} finally {
			this.activeTask = undefined;
			this.busyChangeSubject.next(false);
		}
	}
}
