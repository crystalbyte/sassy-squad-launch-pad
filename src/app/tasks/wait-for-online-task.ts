import * as dns from 'dns';
import { Task } from './task';
import { interval, timer } from 'rxjs';
import { ReleaseTrigger } from '../events/release-triggers';
import { takeUntil, startWith } from 'rxjs/operators';
import { AppService } from '../app.service';
import { AppState } from '../app-state';
import { UpdateService } from '../updates/update.service';
import { ClientService } from '../updates/client.service';
import { LogService } from '../diagnostics/log.service';
import { TaskService } from './task.service';
import { VersionCheckTask } from './version-check-task';

export class WaitForOnlineTask extends Task {

	constructor(
		private appService: AppService,
		private updateService: UpdateService,
		private clientService: ClientService,
		private taskService: TaskService,
		private logService: LogService) {
		super();
	}

	public async run(): Promise<void> {
		this.reportProgress({
			action: 'Checking connectivity ...',
			mode: 'indeterminate',
			actual: 1,
			total: 1
		});

		await this.checkConnectivity();
		await timer(5000).toPromise();

		this.logService.clearStoredErrors();
		this.taskService.enqueue(
			new VersionCheckTask(
				this.appService,
				this.updateService,
				this.clientService,
				this.logService));
	}

	private checkConnectivity(): Promise<void> {
		const trigger = new ReleaseTrigger();
		return new Promise((resolve, _) => {
			interval(5000)
				.pipe(
					startWith(0),
					takeUntil(trigger.releases))
				.subscribe(() => {
					dns.resolve('www.google.com', error => {
						if (!error) {
							trigger.release();
							resolve();
						} else {
							this.appService.state = AppState.Offline;
							this.reportProgress({
								action: '',
								mode: 'determinate',
								actual: 1,
								total: 1
							});
						}
					});
				});
		});
	}
}
