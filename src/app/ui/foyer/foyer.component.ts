import { Component, OnInit } from '@angular/core';
import { remote } from 'electron';

@Component({
	selector: 'app-foyer',
	templateUrl: './foyer.component.html',
	styleUrls: ['./foyer.component.scss']
})
export class FoyerComponent implements OnInit {

	constructor() { }

	public ngOnInit() {

	}

	public quit(_: Event) {
		let window = remote.getCurrentWindow();
		window.close();
	}
}
