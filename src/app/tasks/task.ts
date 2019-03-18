import { Observable, ReplaySubject } from 'rxjs';
import { ProgressUpdate } from '../net/progress-report';

export abstract class Task {

	private progressChangesInternal: ReplaySubject<ProgressUpdate>;

	public name: string;
	public get progressChanges(): Observable<ProgressUpdate> {
		return this.progressChangesInternal;
	}

	public abstract run(): Promise<void>;

	constructor(name: string) {
		this.name = name;
		this.progressChangesInternal = new ReplaySubject<ProgressUpdate>(1);
	}

	protected reportProgress(update: ProgressUpdate) {
		this.progressChangesInternal.next(update);
	}
}