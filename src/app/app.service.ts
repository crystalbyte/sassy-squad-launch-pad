import { Injectable } from '@angular/core';
import { TaskService } from './tasks/task.service';
import { UpdateService } from './updates/update.service';
import { ClientService } from './updates/client.service';
import { VersionCheckTask } from './tasks/version-check-task';
import { LogService } from './diagnostics/log.service';
import { ReplaySubject, Observable } from 'rxjs';
import { AppState } from './app-state';

@Injectable({
	providedIn: 'root'
})
export class AppService {

	private stateChangeSubject: ReplaySubject<AppState>;

	constructor(
		private taskService: TaskService,
		private clientService: ClientService,
		private updateService: UpdateService,
		private logService: LogService) {

		this.stateChangeSubject = new ReplaySubject<AppState>(1);
	}

	public get stateChanges(): Observable<AppState> {
		return this.stateChangeSubject.asObservable();
	}

	public set state(value: AppState) {
		this.stateChangeSubject.next(value);
	}

	public async run() {
		try {
			this.taskService.reset();
			this.taskService.enqueue(
				new VersionCheckTask(
					this,
					this.updateService,
					this.clientService,
					this.logService));

			await this.taskService.process();
		} catch (e) {
			this.logService.error(e);
		}
	}
}
