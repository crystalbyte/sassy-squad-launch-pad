import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { VersionModel } from './version.model';
import { HttpClient } from '@angular/common/http';
import { remote } from 'electron';

@Injectable({
	providedIn: 'root'
})
export class UpdateService {

	constructor(private http: HttpClient) { }

	public async getVersion(): Promise<VersionModel> {
		const response = await this.http.get<VersionModel>(environment.versionCheckUrl, {
			responseType: 'json'
		}).toPromise();

		if (!response.data.launcherVersion) {
			// Let's inject the current version in case the server is not yet setup
			response.data.launcherVersion = remote.app.getVersion();
		}

		return response;
	}
}
