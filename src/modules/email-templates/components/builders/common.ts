export const MAIN_BG_COLOR = 'bg-white';

export const MAIN_TXT_COLOR = 'text-black';

export const BTN_CLS = 'border rounded px-2 py-1 w-full';

export const MAIN_BORDER_COLOR = 'border-gray-200';

export const ROUND_BORDER_COLOR = `rounded border ${MAIN_BORDER_COLOR}`;

export function cx(...inputs: any[]): string {
  const inp = Array.isArray(inputs[0]) ? inputs[0] : [...inputs];
  return inp.filter(Boolean).join(' ');
}
