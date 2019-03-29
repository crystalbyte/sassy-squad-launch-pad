import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as path from 'path';
import { remote } from 'electron';
import { Task } from './task';
import { LogService } from '../diagnostics/log.service';
import { ReleaseTrigger } from '../events/release-triggers';
import { environment } from '../../environments/environment';
import { AppService } from '../app.service';
import { AppState } from '../app-state';

export class InstallTask extends Task {

	constructor(
		private blob: Blob,
		private logService: LogService,
		private appService: AppService) {
		super();
	}

	public async run(): Promise<void> {

		this.logService.info("Downloading game client ...");

		this.reportProgress({
			action: 'Installing client ...',
			mode: 'indeterminate'
		});

		const execPath = environment.production
			? process.env.PORTABLE_EXECUTABLE_DIR
			: remote.app.getAppPath();
			
		const installPath = path.join(execPath, environment.installationPath);
		const downloadPath = path.join(execPath, environment.downloadPath);

		const cleanUpTrigger = new ReleaseTrigger();
		if (fs.existsSync(downloadPath)) {
			this.logService.info("Removing current game client ...");
			rimraf(downloadPath, () => {
				this.logService.info("Game client successfully removed.");
				cleanUpTrigger.release();
			});

			await cleanUpTrigger.releases.toPromise();
		}

		const unzipTrigger = new ReleaseTrigger();

		const reader = new FileReader();
		reader.onloadend = _ => {
			const buffer: ArrayBuffer = <ArrayBuffer>reader.result;
			const zip = new AdmZip(Buffer.from(buffer));
			this.logService.info("Decompressing files ...");
			zip.extractAllToAsync(downloadPath, true, e => {
				this.logService.info("File decompression successfully completed.");

				if (e) {
					this.logService.error(e);
					return;
				}

				unzipTrigger.release();
			});
		};

		reader.readAsArrayBuffer(this.blob);

		await unzipTrigger.releases.toPromise();

		const copyTrigger = new ReleaseTrigger();
		if (fs.existsSync(installPath)) {
			rimraf(installPath, () => {
				copyTrigger.release();
			});

			await copyTrigger.releases.toPromise();
		}

		fs.renameSync(downloadPath, installPath);

		this.reportProgress({
			action: '',
			mode: 'determinate',
			total: 1,
			actual: 1
		});

		this.appService.state = AppState.Ready;
		this.logService.info("Client installation completed.");
	}
}
