import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { StartPageComponent } from './pages/start-page/start-page.component';

@NgModule({
	declarations: [
		AppComponent,
		StartPageComponent
	],
	imports: [
		BrowserModule,
		CommonModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatProgressBarModule,
		MatButtonModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor() { }
}
