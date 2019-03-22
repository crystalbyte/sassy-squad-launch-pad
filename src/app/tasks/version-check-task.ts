import { Task } from './task';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { ReleaseTrigger } from '../events/release-triggers';
import { Version } from '@angular/core';
import { UpdateService } from '../net/update.service';
import { TaskService } from './task.service';
import { LaunchGameTask } from './launch-game-task';
import { ClientDownloadTask } from './client-download-task';

export class VersionCheckTask extends Task {

	constructor(name: string,
		private httpClient: HttpClient,
		private updateService: UpdateService,
		private taskService: TaskService) {
		super(name);
	}

	public async run(): Promise<void> {
		// var local = await this.updateService.readLocalAppInfo();
		const local = {
			version: '1.0.0.0'
		};

		const version = await this.updateService.getCurrentVersion();

		if (local.version !== version.version) {
			this.taskService.enqueue(new ClientDownloadTask('downloading', this.httpClient));
		} else {
			this.taskService.enqueue(new LaunchGameTask('launching'));
		}

		return undefined;
	}
}
