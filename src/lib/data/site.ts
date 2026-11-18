import { PUBLIC_SITE_URL } from '$app/env/public';

const SITE_URL = (PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export interface NavLink {
	label: string;
	href: string;
}

export interface SocialLink {
	label: string;
	href: string;
}

export const siteConfig = {
	name: 'Sinar Berkah',
	tagline: 'Jasa pembuatan ornamen',
	description:
		'Sinar Berkah melayani jasa cutting plat besi, akrilik, PVC dan MDF, pembuatan ornamen bermotif, las & konstruksi, serta sketsel dengan pengiriman ke seluruh Indonesia.',
	url: SITE_URL,
	locale: 'id_ID',

	contact: {
		address: 'Jl. Kolonel Sugiono No. 248, Gadang, Kec. Sukun, Kota Malang, Jawa Timur 65149',
		phoneDisplay: '+62 812-7400-0418',
		phoneHref: 'tel:+6281274000418',
		whatsappGeneral: '6281274000418',
		whatsappOrder: '6281274000418',
		email: undefined as string | undefined
	},

	location: {
		streetAddress: 'Jl. Kolonel Sugiono No. 248, Gadang, Kec. Sukun',
		locality: 'Malang',
		region: 'Jawa Timur',
		postalCode: '65149',
		latitude: -8.01621454302296,
		longitude: 112.62621790243087
	},

	mapEmbedUrl:
		'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5292.802055350692!2d112.62621790243087!3d-8.01621454302296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd627f10eef89ef%3A0xf6f5bedc8ad588a3!2sBengkel%20Sinar%20Berkah!5e0!3m2!1sen!2sid!4v1676877622831!5m2!1sen!2sid',

	aboutVideoUrl: undefined as string | undefined,
	socialLinks: [] as SocialLink[]
} as const;

export const navLinks: NavLink[] = [
	{ label: 'Beranda', href: '/' },
	{ label: 'Produk', href: '/products' },
	{ label: 'Portofolio', href: '/portfolio' },
	{ label: 'Galeri Pola', href: '/gallery' }
];

export const footerLinks: NavLink[] = [
	{ label: 'Layanan', href: '/#services' },
	{ label: 'Portofolio', href: '/portfolio' },
	{ label: 'Galeri Pola', href: '/gallery' },
	{ label: 'Bahan', href: '/#materials' },
	{ label: 'Produk', href: '/products' }
];
