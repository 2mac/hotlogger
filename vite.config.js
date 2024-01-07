import { initDbListener, initWsServer } from './src/lib/server/socket';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const wsServer = {
	name: 'wsServer',
	configureServer(server) {
		if (!server.httpServer)
			return;

		initWsServer(server.httpServer);
		
		server.httpServer.on('listening', () => {
			const addr = server.httpServer.address();
			initDbListener('localhost', addr.port);
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), wsServer]
});
