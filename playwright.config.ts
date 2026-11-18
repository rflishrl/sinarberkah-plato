import fs from 'node:fs';
import { defineConfig } from '@playwright/test';

const localChromium =
	process.platform === 'win32' && process.env.LOCALAPPDATA
		? `${process.env.LOCALAPPDATA}/ms-playwright/chromium-1247/chrome-win64/chrome.exe`
		: undefined;

export default defineConfig({
	webServer: {
		command: 'bun run build && bun run preview -- --port 4173 --host 127.0.0.1',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	use: {
		baseURL: 'http://127.0.0.1:4173',
		launchOptions:
			localChromium && fs.existsSync(localChromium) ? { executablePath: localChromium } : undefined
	},
	testMatch: ['test/**/*.e2e.{ts,js}', 'src/**/*.e2e.{ts,js}']
});
