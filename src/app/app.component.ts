import { Component, OnInit } from '@angular/core';
import { LogService } from './diagnostics/log.service';
import { DisposableComponent } from './components/disposable-component';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
