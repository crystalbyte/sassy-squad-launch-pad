import { AppState } from './app-state';
import { Injectable } from '@angular/core';
import { TaskService } from './tasks/task.service';
import { UpdateService } from './updates/update.service';
import { ClientService } from './updates/client.service';
import { LogService } from './diagnostics/log.service';
import { ReplaySubject, Observable } from 'rxjs';
import { WaitForOnlineTask } from './tasks/wait-for-online-task';


@Injectable({
	providedIn: 'root'
})
export class AppService {

	private stateChangeSubject: ReplaySubject<AppState>;
	private clientRunChangeSubject: ReplaySubject<boolean>;

	constructor(
		private taskService: TaskService,
		private clientService: ClientService,
		private updateService: UpdateService,
		private logService: LogService) {

		this.stateChangeSubject = new ReplaySubject<AppState>(1);
		this.clientRunChangeSubject = new ReplaySubject<boolean>(1);
	}

	public get stateChanges(): Observable<AppState> {
		return this.stateChangeSubject.asObservable();
	}

	public get clientRunChanges(): Observable<boolean> {
		return this.clientRunChangeSubject.asObservable();
	}

	public set state(value: AppState) {
		this.stateChangeSubject.next(value);
	}

	public set isClientRunning(running: boolean) {
		this.clientRunChangeSubject.next(running);
	}

	public async run() {
		try {
			this.logService.info('App started.');

			this.taskService.reset();
			this.taskService.enqueue(
				new WaitForOnlineTask(
					this,
					this.updateService,
					this.clientService,
					this.taskService,
					this.logService));

			await this.taskService.process();
		} catch (e) {
			this.logService.error(e);
		}
	}
}
