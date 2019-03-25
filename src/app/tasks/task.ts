import { Observable, ReplaySubject } from 'rxjs';
import { ProgressReport } from '../updates/progress-report';

export abstract class Task {

	private progressChangeSubject: ReplaySubject<ProgressReport>;

	public get progressChanges(): Observable<ProgressReport> {
		return this.progressChangeSubject;
	}

	public abstract run(): Promise<void>;

	constructor() {
		this.progressChangeSubject = new ReplaySubject<ProgressReport>(1);
	}

	protected reportProgress(update: ProgressReport) {
		this.progressChangeSubject.next(update);
	}
}
