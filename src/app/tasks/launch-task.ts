import * as childProcess from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Task } from './task';
import { environment } from '../../environments/environment';
import { remote } from 'electron';
import { LogService } from '../diagnostics/log.service';
import { AppService } from '../app.service';

export class LaunchTask extends Task {

	constructor(
		private logService: LogService,
		private appService: AppService) {
		super();
	}

	public async run(): Promise<void> {
		const execPath = environment.production
			? process.env.PORTABLE_EXECUTABLE_DIR
			: remote.app.getAppPath();

		const p = path.join(execPath, environment.installationPath, environment.executable);
		this.logService.info(`Launching client at path ${p}.`);

		this.reportProgress({
			action: 'Launching ...',
			mode: 'indeterminate',
		});


		if (!fs.existsSync(p)) {
			throw new Error('Unable to launch the game. Executable not found!');
		}

		this.appService.isClientRunning = true;
		var child = childProcess.spawn(p, [], {
			detached: true,
			cwd: path.join(execPath, environment.installationPath),
		});

		child.unref();
		child.on("close", () => {
			this.appService.isClientRunning = false;
			this.appService.run();
		});

		this.reportProgress({
			action: '',
			mode: 'determinate',
			actual: 1,
			total: 1
		});

		this.logService.info(`Client launch completed.`);
	}
}
