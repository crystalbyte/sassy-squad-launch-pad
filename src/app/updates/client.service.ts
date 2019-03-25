import { Injectable } from '@angular/core';
import { ClientInfoModel } from './client-info.model';
import { environment } from '../../environments/environment';
import * as fs from 'fs';

@Injectable({
	providedIn: 'root'
})
export class ClientService {

	constructor() { }

	public async getClientInfo(): Promise<ClientInfoModel> {
		return new Promise((resolve, _) => {
			fs.exists(environment.appInfoPath, exists => {
				if (!exists) {
					return resolve({
						name: 'Sassy Squad',
						publisher: 'Nutaku Publishing',
						version: 'none'
					});
				}

				fs.readFile(environment.appInfoPath, { encoding: 'UTF-8' }, (_, data) => {
					const json = JSON.parse(data);
					return resolve(json);
				});
			});
		});
	}
}
