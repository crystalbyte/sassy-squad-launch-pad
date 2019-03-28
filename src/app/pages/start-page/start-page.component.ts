import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { remote } from 'electron';
import { TaskService } from '../../tasks/task.service';
import { DisposableComponent } from '../../components/disposable-component';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import { Observable, interval } from 'rxjs';
import { map, switchMap, takeUntil, filter } from 'rxjs/operators';
import { LaunchTask } from '../../tasks/launch-task';
import { DownloadTask } from '../../tasks/download-task';
import { HttpClient } from '@angular/common/http';
import { LogService } from '../../diagnostics/log.service';

@Component({
	selector: 'app-start-page',
	templateUrl: './start-page.component.html',
	styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent extends DisposableComponent implements OnInit, AfterViewInit {

	private slides = [
		"assets/slides/L_02.jpg",
		"assets/slides/L_03.jpg",
		"assets/slides/L_04.jpg",
		"assets/slides/L_05.jpg",
		"assets/slides/L_06.jpg",
		"assets/slides/L_07.jpg",
		"assets/slides/L_08.jpg",
		"assets/slides/L_09.jpg"
	];

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

	@ViewChild("background")
	public background: ElementRef;

	public ngAfterViewInit(): void {
		interval(15000)
			.pipe(takeUntil(this.trigger.releases))
			.subscribe(x => this.onTimerElapsed(x));
	}


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
				filter(x => x.total !== undefined),
				map(x => (x.actual / x.total) * 100));

		this.messages = this.taskService.activeTaskChanges
			.pipe(
				switchMap(x => x.progressChanges),
				map(x => x.action));

		this.logService.errors
			.pipe(
				filter(x => x !== undefined),
				takeUntil(this.trigger.releases))
			.subscribe(_ => {
				this.appService.run();
			});
	}

	public error(_: Event) {
		this.logService.error(new Error('test'));
	}

	public update(_: Event) {
		this.logService.clearStoredErrors();
		this.taskService.reset();
		this.taskService.enqueue(new DownloadTask(
			this.httpClient,
			this.taskService,
			this.appService,
			this.logService));

		this.taskService.process();
	}

	public play(_: Event) {
		this.logService.clearStoredErrors();
		this.taskService.reset();
		this.taskService.enqueue(new LaunchTask(this.logService));

		this.taskService.process();
	}

	public quit(_: Event) {
		const window = remote.getCurrentWindow();
		window.close();
	}

	public refresh(_: Event) {
		this.appService.run();
	}

	private onTimerElapsed(_: number) {
		this.changeSliderImage();
	}

	private changeSliderImage(): any {
		var e = this.slides[Math.floor(Math.random() * this.slides.length)];
		var div = <HTMLDivElement>this.background.nativeElement;
		div.style.backgroundImage = `url("${e}")`;
	}
}
