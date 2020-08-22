import ServerSetup from './app';

(async () => {
	const server = new ServerSetup();
	
	await server.init();
	server.startApp();
})();
