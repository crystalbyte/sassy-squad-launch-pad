import { Component, OnInit } from '@angular/core';
import { LogService } from './diagnostics/log.service';
import { DisposableComponent } from './components/disposable-component';
import { AppService } from './app.service';

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

	public ngOnInit(): void {
		this.appService.run();
	}
}
