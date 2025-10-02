export function toSlug(str: string) {
  return str
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd') // map đ -> d
    .normalize('NFD') // tách dấu
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // bỏ ký tự không mong muốn
    .replace(/\s+/g, '-') // space -> -
    .replace(/-+/g, '-'); // bỏ dấu - thừa
}
