import { ReplaySubject, Observable } from 'rxjs';

export class ReleaseTrigger {
	private releaseSubject: ReplaySubject<void>;

	constructor() {
		this.releaseSubject = new ReplaySubject<void>(1);
	}

	public get releases(): Observable<void> {
		return this.releaseSubject.asObservable();
	}

	public release(): void {
		this.releaseSubject.next();
		this.releaseSubject.complete();
	}
}
