import { Observable, ReplaySubject } from 'rxjs';

export class ReleaseTrigger {
	public releases: ReplaySubject<void>;

	constructor() {
		this.releases = new ReplaySubject<void>(1);
	}

	public release(): void {
		this.releases.next();
		this.releases.complete();
	}
}
