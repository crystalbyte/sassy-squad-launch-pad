import * as winston from 'winston';
import * as path from 'path';
import { remote } from 'electron';
import { Logger } from 'winston';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LogService {

	private logger: Logger;
	private errorSubject: ReplaySubject<Error>;

	constructor() {
		this.errorSubject = new ReplaySubject<Error>(1);
		this.errorSubject.next(undefined);

		let appPath = remote.app.getAppPath();
		this.logger = winston.createLogger({
			level: 'info',
			format: winston.format.json(),
			defaultMeta: { service: 'user-service' },
			transports: [
				//
				// - Write to all logs with level `info` and below to `combined.log`
				// - Write all logs error (and below) to `error.log`.
				//
				new winston.transports.File({
					filename: path.join(appPath, 'error.log'),
					format: winston.format.timestamp(),
					level: 'error'
				}),
				new winston.transports.File({
					filename: path.join(appPath, 'combined.log'),
					format: winston.format.timestamp()
				})
			]
		});

		//
		// If we're not in production then log to the `console` with the format:
		// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
		//
		if (process.env.NODE_ENV !== 'production') {
			this.logger.add(new winston.transports.Console({
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.colorize(),
					winston.format.prettyPrint()
				)
			}));
		}

		this.info(`Logger initialized at '${appPath}'.`);
	}

	public set level(level: string) {
		this.logger.level = level;
	}

	public get level(): string {
		return this.logger.level;
	}

	public clearStoredErrors() {
		this.errorSubject.next(undefined);
	}

	public get errors(): Observable<Error> {
		return this.errorSubject.asObservable();
	}

	public debug(message: string, ...meta: any[]): void {
		this.logger.debug(message, meta);
	}

	public info(message: string, ...meta: any[]): void {
		this.logger.info(message, meta);
	}

	public warn(message: string, ...meta: any[]): void {
		this.logger.warn(message, meta);
	}

	public error(e: Error, ...meta: any[]): void {
		this.logger.error(e.message, meta);
		this.errorSubject.next(e);
	}
}
