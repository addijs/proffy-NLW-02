import { ServerSetup } from './app';

enum ExitStatus {
	Failure = 1,
	Success = 0
}

// Tratando de promisses não resolvidas

process.on('unhandledRejection', (reason, promise) => {
	console.log(`App exiting due to an unhandled promise: ${promise} and reason ${reason}`);
	throw reason;
});

// Tratando de qualquer exception não tratada ocorrida na app

process.on('uncaughtException', error => {
	console.log(`App exiting due to an uncaught exception: ${error}`);
	process.exit(ExitStatus.Failure);
});

(async () => {
	try {
		const setup = new ServerSetup();
		await setup.init();
		setup.startApp();

		const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

		exitSignals.forEach(signal => process.on(signal, async () => {
			try {
				await setup.close();
				console.log('\nApp exited successfully');
				process.exit(ExitStatus.Success);
			} catch (err) {
				console.log(`\nApp exited with error: ${err}`);
				process.exit(ExitStatus.Failure);
			}
		}))
	} catch (err) {
		console.log(err);
		console.log(`\nApp exited with error: ${err}`);
		process.exit(ExitStatus.Failure);
	}
})();
