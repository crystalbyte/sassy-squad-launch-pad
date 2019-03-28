import * as process from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Task } from './task';
import { environment } from '../../environments/environment';
import { ReleaseTrigger } from '../events/release-triggers';
import { remote } from 'electron';
import { LogService } from '../diagnostics/log.service';

export class LaunchTask extends Task {

	constructor(private logService: LogService) {
		super();
	}

	public async run(): Promise<void> {
		const appPath = remote.app.getAppPath();
		const p = path.join(appPath, environment.installationPath, environment.executable);
		this.logService.info(`Launching client at path ${p}.`);

		this.reportProgress({
			action: 'Launching ...',
			mode: 'indeterminate',
		});

		const trigger = new ReleaseTrigger();
		
		if (!fs.existsSync(p)) {
			throw new Error('Unable to launch the game. Executable not found!');
		}

		let launchError: any = undefined;
		process.execFile(p, {
			cwd: path.join(appPath, environment.installationPath),
		}, e => {
			launchError = e;
			trigger.release();
		});

		await trigger.releases.toPromise();

		if (launchError) {
			throw new Error(`Unable to launch the game. ${launchError}`);
		}

		this.reportProgress({
			action: '',
			mode: 'determinate',
			actual: 1,
			total: 1
		});

		this.logService.info(`Client launch completed.`);
	}
}
