import { Injectable } from '@angular/core';
import { ClientInfoModel } from './client-info.model';
import { environment } from '../../environments/environment';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({
	providedIn: 'root'
})
export class ClientService {

	constructor() { }

	public async getClientInfo(): Promise<ClientInfoModel> {
		return new Promise((resolve, _) => {
			let p = path.join(environment.installationPath, environment.appJson);
			fs.exists(p, exists => {
				if (!exists) {
					return resolve({
						name: 'Sassy Squad',
						publisher: 'Nutaku Publishing',
						version: 'none'
					});
				}

				fs.readFile(p, { encoding: 'UTF-8' }, (_, data) => {
					const json = JSON.parse(data);
					return resolve(json);
				});
			});
		});
	}
}
