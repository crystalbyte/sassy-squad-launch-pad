import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskService } from './tasks/task.service';
import { UpdateService } from './updates/update.service';
import { ClientService } from './updates/client.service';
import { VersionCheckTask } from './tasks/version-check-task';
import { LogService } from './diagnostics/log.service';

@Injectable({
	providedIn: 'root'
})
export class AppService {

	constructor(
		private httpClient: HttpClient,
		private taskService: TaskService,
		private updateService: UpdateService,
		private clientService: ClientService,
		private logService: LogService) { }

	public async run() {
		try {
			this.taskService.reset();
			this.taskService.enqueue(
				new VersionCheckTask(
					this.httpClient,
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
