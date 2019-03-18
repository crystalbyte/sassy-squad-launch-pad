import * as winston from 'winston';

import { Injectable } from '@angular/core';
import { Logger } from 'winston';

@Injectable({
	providedIn: 'root'
})
export class LogService {

	private logger: Logger;

	constructor() {
		this.logger = winston.createLogger({
			level: 'info',
			format: winston.format.json(),
			defaultMeta: { service: 'user-service' },
			transports: [
				//
				// - Write to all logs with level `info` and below to `combined.log` 
				// - Write all logs error (and below) to `error.log`.
				//
				new winston.transports.File({ filename: 'error.log', level: 'error' }),
				new winston.transports.File({ filename: 'combined.log' })
			]
		});

		//
		// If we're not in production then log to the `console` with the format:
		// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
		// 
		if (process.env.NODE_ENV !== 'production') {
			this.logger.add(new winston.transports.Console({
				format: winston.format.simple()
			}));
		}
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
	}
}