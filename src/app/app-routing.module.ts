import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FoyerComponent } from './ui/foyer/foyer.component';

const routes: Routes = [
	{
		path: '',
		component: FoyerComponent,
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
