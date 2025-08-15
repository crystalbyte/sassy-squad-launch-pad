import { Component, OnInit } from '@angular/core';
import { LogService } from './diagnostics/log.service';
import { DisposableComponent } from './components/disposable-component';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import { ConnectionError } from './updates/connection-error';
import { AppState } from './app-state';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent extends DisposableComponent implements OnInit {

	constructor(
		private appService: AppService,
		public logService: LogService) {
		super();

		this.logService.errors
			.pipe(
				filter(x => x !== undefined),
				takeUntil(this.trigger.releases))
			.subscribe(async err => {
				if (err instanceof ConnectionError) {
					this.appService.state = AppState.Offline;
				}

				this.appService.run();
			});
	}

	public errors: Observable<string>;

	public retry(_: Event) {
		this.appService.run();
	}

	public ngOnInit(): void {
		this.errors = this.logService.errors
			.pipe(map(x => {

				if (x instanceof Error) {
					return x.message;
				}

				return x;
			}));

		this.appService.run();
	}
}
