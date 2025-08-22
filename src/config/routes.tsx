// Tự động nhập tất cả các file routes.ts từ thư mục modules
const routeModules = import.meta.glob('../modules/*/routes.tsx', { eager: true });

// Tổng hợp tất cả các route từ các module
const routes = Object.values(routeModules).flatMap((module: any) => module.default);

export default routes;
