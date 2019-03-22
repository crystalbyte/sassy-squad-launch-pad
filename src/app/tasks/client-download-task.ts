import { Task } from './task';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { ReleaseTrigger } from '../events/release-triggers';

export class ClientDownloadTask extends Task {

	private trigger: ReleaseTrigger;

	constructor(name: string, private http: HttpClient) {
		super(name);
		this.trigger = new ReleaseTrigger();
	}

	public async run(): Promise<void> {
		this.http.get(environment.clientDownloadUrl, {
			reportProgress: true
		}).subscribe(this.onRequestEventTriggered);

		await this.trigger.releases;
		return undefined;
	}

	private onRequestEventTriggered(event: any): void {
		if (event.type === HttpEventType.DownloadProgress) {
			var progress = <HttpProgressEvent>event.type;
			this.reportProgress({
				total: progress.total,
				actual: progress.loaded
			});
		}
		if (event.type === HttpEventType.Response) {
			this.trigger.release();
		}
	}
}