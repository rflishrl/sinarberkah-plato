/** Membuat tautan WhatsApp. `phone` memakai format internasional tanpa tanda "+" atau spasi. */
export function whatsappLink(phone: string, message = "Halo!"): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
