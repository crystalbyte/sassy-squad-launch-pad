import { Task } from './task';

export class LaunchGameTask extends Task {

	constructor() {
		super('Launching Game ...');
	}

	public async run(): Promise<void> {
		return undefined;
	}
}
