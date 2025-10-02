export function toSlug(str: string) {
  return str
    .normalize('NFD') // tách dấu khỏi chữ cái
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // xóa ký tự đặc biệt
    .replace(/\s+/g, '-') // thay space bằng -
    .replace(/-+/g, '-'); // bỏ thừa dấu -
}
