import { Task } from './task';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest, HttpHeaders, HttpDownloadProgressEvent } from '@angular/common/http';
import { tap, last, takeUntil } from 'rxjs/operators';
import { LogService } from '../diagnostics/log.service';
import { TaskService } from './task.service';
import { InstallTask } from './install-task';
import { AppService } from '../app.service';
import { ReleaseTrigger } from '../events/release-triggers';

export class DownloadTask extends Task {

	private action = 'Downloading client ...';
	private errorTrigger: ReleaseTrigger;

	constructor(
		private http: HttpClient,
		private taskService: TaskService,
		private appService: AppService,
		private logService: LogService) {
		super();

		this.errorTrigger = new ReleaseTrigger();
	}

	public async run(): Promise<void> {
		try {
			this.logService.info('Downloading client ...');

			this.reportProgress({
				action: `${this.action}`,
				mode: 'determinate'
			});

			const request: any = new HttpRequest('GET', environment.clientDownloadUrl, undefined, {
				reportProgress: true,
				responseType: 'blob',
				headers: new HttpHeaders({
					'Accept': 'application/octet-stream',
					'Access-Control-Allow-Headers': 'Content-Length',
					'Access-Control-Expose-Headers': 'Content-Length'
				})
			});

			const response: any = await this.http.request(request)
				.pipe(
					takeUntil(this.errorTrigger.releases),
					tap(x => this.onRequestEventTriggered(x)),
					last())
				.toPromise();

			this.taskService.enqueue(new InstallTask(
				response.body,
				this.logService,
				this.appService));

			this.logService.info('Client download successfully completed.');
		} catch (e) {
			this.errorTrigger.release();
			throw e;
		}
	}

	private onRequestEventTriggered(event: any): any {
		if (event.type === HttpEventType.Response) {
			return event;
		}

		if (event.type === HttpEventType.DownloadProgress) {
			const progress = <HttpDownloadProgressEvent>event;
			// We can only show progress when the server has sent the Content-Length header.
			if (progress.total) {
				const percentage = Math.floor((progress.loaded / progress.total) * 100);
				this.reportProgress({
					total: progress.total,
					actual: progress.loaded,
					action: `${this.action} ${percentage}%`,
					mode: 'determinate'
				});
			} else {
				this.reportProgress({
					action: `${this.action}`,
					mode: 'indeterminate'
				});
			}
		}
	}
}
