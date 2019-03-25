import { Observable, ReplaySubject } from 'rxjs';
import { ProgressReport } from '../updates/progress-report';

export abstract class Task {

	private progressChangesInternal: ReplaySubject<ProgressReport>;

	public action: string;
	public reportsProgress = false;
	public get progressChanges(): Observable<ProgressReport> {
		return this.progressChangesInternal;
	}

	public abstract run(): Promise<void>;

	constructor(action: string) {
		this.action = action;
		this.progressChangesInternal = new ReplaySubject<ProgressReport>(1);
	}

	protected reportProgress(update: ProgressReport) {
		this.progressChangesInternal.next(update);
	}
}
