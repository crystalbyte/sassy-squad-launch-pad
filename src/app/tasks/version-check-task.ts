import { Task } from './task';
import { HttpClient } from '@angular/common/http';
import { UpdateService } from '../updates/update.service';
import { TaskService } from './task.service';
import { LaunchGameTask } from './launch-game-task';
import { ClientDownloadTask } from './client-download-task';
import { ClientService } from '../updates/client.service';
import { LogService } from '../diagnostics/log.service';

export class VersionCheckTask extends Task {

	constructor(
		private httpClient: HttpClient,
		private updateService: UpdateService,
		private clientService: ClientService,
		private taskService: TaskService,
		private logService: LogService) {
		super();
	}

	public async run(): Promise<void> {
		this.reportProgress({
			action: 'Checking Game Version ...',
			mode: "indeterminate"
		});

		const local = await this.clientService.getClientInfo();
		const remote = await this.updateService.getVersion();

		if (local.version !== remote.version) {
			this.taskService.enqueue(new ClientDownloadTask(
				this.httpClient,
				this.taskService,
				this.logService));

		} else {
			this.taskService.enqueue(new LaunchGameTask());
		}
	}
}
