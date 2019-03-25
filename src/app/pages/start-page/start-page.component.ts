import { Component, OnInit } from '@angular/core';
import { remote } from 'electron';
import { TaskService } from '../../tasks/task.service';
import { DisposableComponent } from '../../components/disposable-component';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
	selector: 'app-start-page',
	templateUrl: './start-page.component.html',
	styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent extends DisposableComponent implements OnInit {

	constructor(
		public taskService: TaskService,
		private appService: AppService) {
		super();
	}

	public prod: boolean;
	public modes: Observable<string>;
	public values: Observable<number>;
	public messages: Observable<string>;

	public ngOnInit() {
		this.prod = environment.production;
		this.modes = this.taskService.activeTaskChanges
			.pipe(
				switchMap(x => x.progressChanges),
				map(x => x.mode));

		this.values = this.taskService.activeTaskChanges
			.pipe(
				switchMap(x => x.progressChanges),
				map(x => (x.actual / x.total) * 100));

		this.messages = this.taskService.activeTaskChanges
			.pipe(
				switchMap(x => x.progressChanges),
				map(x => x.action));
	}

	public quit(_: Event) {
		const window = remote.getCurrentWindow();
		window.close();
	}

	public refresh(_: Event) {
		this.appService.run();
	}
}
