import { Component, OnInit } from '@angular/core';
import { LogService } from './log.service';
import { Task } from './tasks/task';
import { TaskService } from './tasks/task.service';
import { VersionCheckTask } from './tasks/version-check-task';
import { HttpClient } from '@angular/common/http';
import { UpdateService } from './net/update.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	constructor(
		private httpClient: HttpClient,
		private taskService: TaskService,
		private updateService: UpdateService,
		private logService: LogService) {
	}

	public ngOnInit(): void {
		try {
			this.run();
		} catch (e) {
			this.logService.error(e);
		}
	}

	private async run() {
		this.taskService.enqueue(
			new VersionCheckTask("checking version",
				this.httpClient,
				this.updateService,
				this.taskService));
	}
}
