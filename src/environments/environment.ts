// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	appJson: 'app.json',
	executable: "SassySquad.exe",
	productName: "Sassy Squad Launcher",
	versionCheckUrl: 'https://dev.sassy.crystalbyte.de/api/version',
	clientDownloadUrl: 'https://drive.google.com/uc?authuser=0&id=1GTdIeMv8l3a0PRBcegxx9g2Q793FyW3G&export=download',
	nutakuGameStoreUrl: "https://www.nutaku.net/games/download/sassy-squad/",
	installationPath: "./client",
	downloadPath: "./$temp"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
