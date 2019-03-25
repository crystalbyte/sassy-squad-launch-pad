import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import { Task } from './task';
import { TaskService } from './task.service';
import { LaunchGameTask } from './launch-game-task';
import { LogService } from '../diagnostics/log.service';
import { ReleaseTrigger } from '../events/release-triggers';
import { environment } from '../../environments/environment';

export class UnzipTask extends Task {

	private trigger: ReleaseTrigger;

	constructor(
		private blob: Blob,
		private logService: LogService,
		private taskService: TaskService) {
		super();

		this.trigger = new ReleaseTrigger();
	}

	public async run(): Promise<void> {
		this.reportProgress({
			action: 'Installing Game ...',
			mode: "indeterminate"
		});

		const path = environment.installationPath;
		if (fs.existsSync(path)) {
			fs.renameSync(path, `${path}$`);
		}

		const reader = new FileReader();
		reader.readAsArrayBuffer(this.blob);
		reader.onloadend = _ => {
			const buffer: ArrayBuffer = <ArrayBuffer>reader.result;
			let zip = new AdmZip(new Buffer(buffer));
			zip.extractAllToAsync(path, true, e => {
				this.logService.error(e);
			});

			this.trigger.release();
		}

		await this.trigger.releases.toPromise();

		this.taskService.enqueue(new LaunchGameTask());
	}
}
