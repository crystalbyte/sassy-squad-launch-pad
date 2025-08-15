import { Task } from './task';
import { remote } from 'electron';
import { UpdateService } from '../updates/update.service';
import { ClientService } from '../updates/client.service';
import { AppService } from '../app.service';
import { AppState } from '../app-state';
import { LogService } from '../diagnostics/log.service';

export class VersionCheckTask extends Task {

	constructor(
		private appService: AppService,
		private updateService: UpdateService,
		private clientService: ClientService,
		private logService: LogService) {
		super();
	}

	public async run(): Promise<void> {

		this.logService.info('Checking client version ...');
		this.reportProgress({
			action: 'Checking client version ...',
			mode: 'indeterminate'
		});

		const localInfo = await this.clientService.getClientInfo();
		const remoteInfo = await this.updateService.getVersion();

		if (remoteInfo.launcherVersion !== remote.app.getVersion()) {
			this.logService.info('Launcher is out of date!');
			this.appService.state = AppState.LauncherUpdateRequired;
			return;
		}

		if (localInfo.version === 'none') {
			this.logService.info('Game client not found!');
			this.appService.state = AppState.InstallationRequired;
		} else {
			this.appService.state = localInfo.version === remoteInfo.version
				? AppState.Ready
				: AppState.UpdateRequired;

			if (this.appService.state === AppState.Ready) {
				this.logService.info('Game client is up to date.');
			} else {
				this.logService.info('Game client is out of date.');
			}
		}

		this.reportProgress({
			action: '',
			mode: 'determinate',
			actual: 1,
			total: 1
		});
	}
}
