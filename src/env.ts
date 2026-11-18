import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	API_BASE_URL: {
		public: false,
		static: false,
		schema: (value?: string) => value?.trim() ?? ''
	},
	REVALIDATE_SECRET: {
		public: false,
		static: false,
		schema: (value?: string) => value?.trim() ?? ''
	},
	PUBLIC_SITE_URL: {
		public: true,
		static: true,
		schema: (value?: string) => value?.trim() || 'http://localhost:3000'
	},
	PUBLIC_MEDIA_PUBLIC_DOMAIN: {
		public: true,
		static: true,
		schema: (value?: string) => value?.trim() ?? ''
	}
});
