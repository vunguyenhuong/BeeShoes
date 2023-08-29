import BaseUI from './layouts/admin/BaseUI';
import AddStaff from './pages/admin/account/staff/AddStaff';
import Staff from './pages/admin/account/staff/Staff';
import StaffDetail from './pages/admin/account/staff/StaffDetail';
import Bill from './pages/admin/bill/Bill';
import BillDetail from './pages/admin/bill/BillDetail';

import Order from './pages/admin/order/Order';
import OrderDetail from './pages/admin/order/OrderDetail';
import AddProduct from './pages/admin/product/shoe-detail/AddShoe';
import ShoeDetail from './pages/admin/product/shoe-detail/ShoeDetail';
import ShoeDetailUpdate from './pages/admin/product/shoe-detail/ShoeDetailUpdate';
import ProductAttribute from './pages/admin/product/attribute/ProductAttribute';
import Voucher from './pages/admin/voucher/Voucher';
import ShoeInfo from './pages/admin/product/shoe/ShoeInfo';
import Shoe from './pages/admin/product/shoe/Shoe';
import AddCustomer from './pages/admin/account/customer/AddCustomer';
import CustomerDetail from './pages/admin/account/customer/CustomerDetail';
import Customer from './pages/admin/account/customer/Customer';
import ImageGallery from './pages/admin/ImageGallery';
import DetailProduct from './pages/client/DetailProduct';
const publicRouters = [
    { path: "/", element: BaseUI },
    // { path: "/admin/dashboard", element: Dashboard },
    // { path: "/admin/profile", element: Profile },
    // { path: "/admin/thong-ke", element: Dashboard },
    { path: "/admin/order", element: Order },
    { path: "/admin/order/:id", element: OrderDetail },
    { path: "/admin/bill", element: Bill },
    { path: "/admin/bill/:id", element: BillDetail },
    // { path: "/admin/bill/create", element: CreateBill },
    { path: "/admin/product", element: Shoe },
    { path: "/admin/product-list", element: ShoeDetail },
    { path: "/admin/product/add", element: AddProduct },
    { path: "/admin/product/attribute", element: ProductAttribute },
    { path: "/admin/product/:id", element: ShoeInfo },
    { path: "/admin/voucher", element: Voucher },
    { path: "/admin/voucher/:id", element: Voucher },
    { path: "/admin/staff", element: Staff },
    { path: "/admin/staff/add", element: AddStaff },
    { path: "/admin/staff/:id", element: StaffDetail },
    { path: "/admin/customer", element: Customer },
    { path: "/admin/customer/add", element: AddCustomer },
    { path: "/admin/customer/:id", element: CustomerDetail },
    { path: "/admin/image-gallery", element: ImageGallery },
    { path: "/admin/product/detail/:id", element: DetailProduct },
    // { path: '*', element: NotFound}
];

const privateRouters = [];

export { publicRouters, privateRouters };