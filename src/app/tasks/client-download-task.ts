import { Task } from './task';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest, HttpHeaders, HttpDownloadProgressEvent, HttpResponse } from '@angular/common/http';
import { tap, last, catchError } from 'rxjs/operators';
import { LogService } from '../diagnostics/log.service';
import { TaskService } from './task.service';
import { UnzipTask } from './unzip-task';

export class ClientDownloadTask extends Task {

	private action: string = 'Downloading Game ...';

	constructor(
		private http: HttpClient,
		private taskService: TaskService,
		private logService: LogService) {
		super();
	}

	public async run(): Promise<void> {
		console.log("Client download started ...");

		this.reportProgress({
			action: `${this.action}`,
			mode: "determinate"
		})

		const request: any = new HttpRequest('GET', environment.clientDownloadUrl, undefined, {
			reportProgress: true,
			responseType: 'blob',
			headers: new HttpHeaders({
				'Accept': 'application/octet-stream',
				'Access-Control-Allow-Headers': 'Content-Length',
				'Access-Control-Expose-Headers': 'Content-Length'
			})
		});

		let response: any = await this.http.request(request)
			.pipe(
				tap(x => this.onRequestEventTriggered(x)),
				last(),
				catchError(x => this.onErrorOccurred(x)))
			.toPromise();

		console.log("Client download finished.");

		this.taskService.enqueue(new UnzipTask(
			response.body,
			this.logService,
			this.taskService));
	}

	private onErrorOccurred(error: any): any {
		this.logService.error(error);
	}

	private onRequestEventTriggered(event: any): any {
		console.log(event);

		if (event.type === HttpEventType.Response) {
			return event;
		}

		if (event.type === HttpEventType.DownloadProgress) {
			const progress = <HttpDownloadProgressEvent>event;
			let percentage = Math.floor((progress.loaded / progress.total) * 100);
			this.reportProgress({
				total: progress.total,
				actual: progress.loaded,
				action: `${this.action} ${percentage}%`,
				mode: "determinate"
			});
		}
	}
}
