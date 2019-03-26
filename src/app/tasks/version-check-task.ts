import { Task } from './task';
import { UpdateService } from '../updates/update.service';
import { ClientService } from '../updates/client.service';
import { AppService } from '../app.service';
import { AppState } from '../app-state';

export class VersionCheckTask extends Task {

	constructor(
		private appService: AppService,
		private updateService: UpdateService,
		private clientService: ClientService) {
		super();
	}

	public async run(): Promise<void> {
		this.reportProgress({
			action: 'Checking Game Version ...',
			mode: "indeterminate"
		});

		const local = await this.clientService.getClientInfo();
		const remote = await this.updateService.getVersion();
		this.appService.state = local.version === remote.version 
			? AppState.Launchable 
			: AppState.UpdateRequired;

		this.reportProgress({
			action: '',
			mode: "determinate",
			actual: 1,
			total: 1
		});
	}
}
