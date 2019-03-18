import { Injectable } from '@angular/core';
import { Queue } from 'typescript-collections';
import { Task } from './task';

@Injectable({
	providedIn: 'root'
})
export class TaskService {

	private tasks: Queue<Task>;

	constructor() {
		this.tasks = new Queue<Task>();
	}

	public enqueue(task: Task) {
		this.tasks.enqueue(task);
	}

	public dequeue() {
		this.tasks.dequeue();
	}

	public active: Task;

	public async process(): Promise<void> {
		while (this.tasks.size() > 0) {
			this.active = this.tasks.dequeue();
			await this.active.run();
		}
	}
}
