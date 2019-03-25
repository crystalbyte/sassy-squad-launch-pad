import { Component, OnInit } from '@angular/core';
import { remote } from 'electron';
import { TaskService } from '../../tasks/task.service';
import { DisposableComponent } from '../../components/disposable-component';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { UpdateService } from '../../updates/update.service';
import { ProgressReport } from '../../updates/progress-report';

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

	public ngOnInit() {
		this.prod = environment.production;
		this.modes = this.taskService.activeTaskChanges
			.pipe(map(x => x.reportsProgress ? 'determinate' : 'indeterminate'));

		this.values = this.taskService.activeTaskChanges
			.pipe(switchMap(x => x.progressChanges), map(x => x.actual / x.total), tap(x => console.log(x)));
	}

	public quit(_: Event) {
		const window = remote.getCurrentWindow();
		window.close();
	}

	public refresh(_: Event) {
		this.appService.run();
	}
}
