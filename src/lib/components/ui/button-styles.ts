import { cn } from '#lib/utils.js';

export type ButtonVariant = 'primary' | 'dark' | 'outline';

const base =
	'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-none px-4 py-2 text-base leading-[22px] font-medium transition-colors duration-200 motion-reduce:transition-none lg:min-h-0';

const variants: Record<ButtonVariant, string> = {
	primary: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-hover',
	dark: 'bg-ink text-white hover:bg-black',
	outline: 'border border-ink text-ink hover:bg-ink hover:text-white'
};

export function buttonStyles(variant: ButtonVariant = 'primary', className?: string) {
	return cn(base, variants[variant], className);
}
