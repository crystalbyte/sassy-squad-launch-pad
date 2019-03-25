import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { VersionModel } from './version.model';
import { ClientInfoModel } from './client-info.model';
import { HttpClient } from '@angular/common/http';
import * as fs from 'fs';

@Injectable({
	providedIn: 'root'
})
export class UpdateService {

	constructor(private http: HttpClient) { }

	public async getVersion(): Promise<VersionModel> {
		const response = await this.http.get<VersionModel>(environment.versionCheckUrl, {
			responseType: 'json'
		}).toPromise();

		return response;
	}
}
