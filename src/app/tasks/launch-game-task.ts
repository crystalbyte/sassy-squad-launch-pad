import * as process from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Task } from './task';
import { environment } from '../../environments/environment';
import { ReleaseTrigger } from '../events/release-triggers';

export class LaunchGameTask extends Task {

	constructor() {
		super();
	}

	public async run(): Promise<void> {

		this.reportProgress({
			mode: 'indeterminate',
			action: 'Launching ...'
		});

		const trigger = new ReleaseTrigger();
		const p = path.join(environment.installationPath, environment.executable);
		if (!fs.existsSync(p)) {
			throw new Error('Unable to launch the game. The executable not found!');
		}

		process.execFile(p, {
			cwd: environment.installationPath,
		}, _ => {
			trigger.release();
		});

		await trigger.releases.toPromise();
	}
}
