import { Task } from './task';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpProgressEvent, HttpRequest } from '@angular/common/http';
import { ReleaseTrigger } from '../events/release-triggers';
import { take, tap, last, catchError } from 'rxjs/operators';
import { LogService } from '../diagnostics/log.service';

export class ClientDownloadTask extends Task {

	private trigger: ReleaseTrigger;

	constructor(
		private http: HttpClient,
		private logService: LogService) {
		super('Downloading Game ...');

		this.trigger = new ReleaseTrigger();
		this.reportsProgress = true;
	}

	public async run(): Promise<void> {
		const request = new HttpRequest('GET', environment.clientDownloadUrl, undefined, {
			reportProgress: true,
			responseType: 'blob'
		});

		await this.http.request(request)
			.pipe(tap(this.onRequestEventTriggered), last(), catchError(this.onErrorOccurred));
	}

	private onErrorOccurred(error: any): any {
		this.logService.error(error);
	}

	private onRequestEventTriggered(event: any): void {
		if (event.type === HttpEventType.DownloadProgress) {
			const progress = <HttpProgressEvent>event.type;
			this.reportProgress({
				total: progress.total,
				actual: progress.loaded
			});
		}
	}
}
