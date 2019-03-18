import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VersionModel } from '../models/version.model';
import { AppInfoModel } from '../models/app-info.model';
import { HttpClient } from '@angular/common/http';
import * as fs from 'fs';

@Injectable({
	providedIn: 'root'
})
export class UpdateService {

	constructor(private http: HttpClient) { }

	public async readLocalAppInfo(): Promise<AppInfoModel> {
		return new Promise((resolve, reject) => {
			fs.exists(environment.appInfoPath, exists => {
				if (!exists) {
					reject(`App info file not found.`);
					return;
				}

				fs.readFile(environment.appInfoPath, { encoding: "UTF-8" }, (_, data) => {
					var json = JSON.parse(data);
					return resolve(json);
				})
			});
		});
	}

	public async getCurrentVersion(): Promise<VersionModel> {
		var response = await this.http.get<VersionModel>(environment.versionCheckUrl, {
			responseType: "json"
		}).toPromise();

		return response;
	}
}
