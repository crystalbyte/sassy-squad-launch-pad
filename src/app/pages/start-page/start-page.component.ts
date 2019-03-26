import { Component, OnInit } from '@angular/core';
import { remote } from 'electron';
import { TaskService } from '../../tasks/task.service';
import { DisposableComponent } from '../../components/disposable-component';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import { Observable } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { LaunchGameTask } from '../../tasks/launch-game-task';
import { ClientDownloadTask } from '../../tasks/client-download-task';
import { HttpClient } from '@angular/common/http';
import { LogService } from '../../diagnostics/log.service';
import { AppState } from '../../app-state';

@Component({
	selector: 'app-start-page',
	templateUrl: './start-page.component.html',
	styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent extends DisposableComponent implements OnInit {

	constructor(
		public taskService: TaskService,
		private httpClient: HttpClient,
		private logService: LogService,
		private appService: AppService) {
		super();
	}

	public prod: boolean;
	public modes: Observable<string>;
	public values: Observable<number>;
	public messages: Observable<string>;
	public stateChanges: Observable<string>;
	public busyChanges: Observable<boolean>;
	public errors: Observable<Error>;

	public ngOnInit() {
		this.prod = environment.production;

		this.errors = this.logService.errors;
		this.busyChanges = this.taskService.busyChanges;
		this.stateChanges = this.appService.stateChanges.pipe(map(x => {
			return x.toString();
		}));

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

		this.logService.errors
			.pipe(
				takeUntil(this.trigger.releases))
			.subscribe(x => {
				this.appService.run();
			});
	}

	public update(_: Event) {
		this.logService.clear();
		this.taskService.reset();
		this.taskService.enqueue(new ClientDownloadTask(
			this.httpClient,
			this.taskService,
			this.appService,
			this.logService));

		this.taskService.process();
	}

	public play(_: Event) {
		this.logService.clear();
		this.taskService.reset();
		this.taskService.enqueue(new LaunchGameTask());

		this.taskService.process();
	}

	public quit(_: Event) {
		const window = remote.getCurrentWindow();
		window.close();
	}

	public refresh(_: Event) {
		this.appService.run();
	}
}
