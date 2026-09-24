export function rupeesToMinor(text: string): number {
  const match = /^Rs\.\s*(\d+)(?:\.(\d{1,2}))?$/.exec(text.trim());
  if (!match) throw new Error('Unexpected rupee amount format');
  const amount = Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
  if (!Number.isSafeInteger(amount)) throw new Error('Amount exceeds safe integer range');
  return amount;
}
