import type { HeroSlide, Material, PatternSlide, Service } from '#lib/types/api.js';

export const heroSlides: HeroSlide[] = [
	{
		id: 'cutting',
		title: 'Jasa Cutting dan Ornament',
		description:
			'Melayani segala macam ornamen bermotif dan sebagainya serta menyediakan jasa potong plat besi.',
		ctaLabel: 'Layanan Kami',
		ctaHref: '#services',
		image: {
			src: '/images/hero-1.png',
			alt: 'Pekerja memotong plat besi dengan gerinda sampai memercikkan api'
		}
	},
	{
		id: 'las',
		title: 'Las & Konstruksi',
		description:
			'Pembuatan interior dan exterior pintu pagar, railing tangga, kanopi, plafon dan lainnya.',
		ctaLabel: 'Layanan Kami',
		ctaHref: '#services',
		image: {
			src: '/images/about-grinding.png',
			alt: 'Pekerja menggerinda rangka besi di bengkel'
		}
	},
	{
		id: 'sketsel',
		title: 'Sketsel & Plat Instan',
		description: 'Pembuatan sketsel siap pakai ataupun instan dengan finishing terbaik.',
		ctaLabel: 'Layanan Kami',
		ctaHref: '#services',
		image: {
			src: '/images/about-welding.webp',
			alt: 'Pekerja mengelas pipa besi di bengkel'
		}
	}
];

export const services: Service[] = [
	{
		id: 'cutting',
		icon: 'cutting',
		title: 'Jasa Cutting',
		description: 'Seperti plat, akrilik, PVC, MDF mentahan tanpa proses finishing'
	},
	{
		id: 'las',
		icon: 'las',
		title: 'Las & Konstruksi',
		description: 'Pembuatan interior/exterior pintu pagar, railing tangga, kanopi, plafon dll.'
	},
	{
		id: 'sketsel',
		icon: 'sketsel',
		title: 'Sketsel & Plat Instan',
		description: 'Pembuatan sketsel siap pakai ataupun instan dengan finishing terbaik'
	}
];

export const materials: Material[] = [
	{
		name: 'Plat Besi',
		thickness: 'Tebal 2-5mm',
		notes: ['Mentahan/finishing', 'Indoor/outdoor']
	},
	{
		name: 'Akrilik',
		thickness: 'Tebal 2-5mm',
		notes: ['Mentahan/finishing', 'Indoor/outdoor']
	},
	{
		name: 'PVC',
		thickness: 'Tebal',
		notes: ['Banyak warna', 'Bagus untuk hiasan']
	},
	{
		name: 'MDF',
		thickness: 'Tebal 9mm',
		notes: ['Mentahan/finishing', 'Indoor/outdoor']
	}
];

export const patternSlides: PatternSlide[] = Array.from({ length: 5 }, (_, i) => ({
	id: `pattern-${i + 1}`,
	kind: 'strip' as const,
	src: '/images/pattern-gallery.png',
	alt: 'Lima contoh pola ornamen, LC 071 sampai LC 075'
}));
