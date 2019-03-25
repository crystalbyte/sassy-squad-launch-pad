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
		return new Promise((resolve, reject) => {
			fs.exists(environment.appInfoPath, exists => {
				if (!exists) {
					reject(`App info file not found.`);
					return;
				}

				fs.readFile(environment.appInfoPath, { encoding: 'UTF-8' }, (_, data) => {
					const json = JSON.parse(data);
					return resolve(json);
				});
			});
		});
	}
}
