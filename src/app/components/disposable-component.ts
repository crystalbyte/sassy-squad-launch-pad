import { OnDestroy } from '@angular/core';
import { ReleaseTrigger } from '../events/release-triggers';

export abstract class DisposableComponent implements OnDestroy {

	protected trigger: ReleaseTrigger;

	constructor() {
		this.trigger = new ReleaseTrigger();
	}

	public ngOnDestroy(): void {
		this.trigger.release();
	}
}
