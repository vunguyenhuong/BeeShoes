import BaseUI from './layouts/admin/BaseUI';
import AddStaff from './pages/admin/account/staff/AddStaff';
import Staff from './pages/admin/account/staff/Staff';
import StaffDetail from './pages/admin/account/staff/StaffDetail';
import Bill from './pages/admin/bill/Bill';
import BillDetail from './pages/admin/bill/BillDetail';

import Order from './pages/admin/order/Order';
import AddProduct from './pages/admin/product/shoe-detail/AddShoe';
import ProductAttribute from './pages/admin/product/attribute/ProductAttribute';
import Voucher from './pages/admin/voucher/Voucher';
import AddVoucherForm from "./pages/admin/voucher/AddVoucher";
import VoucherDetail from "./pages/admin/voucher/VoucherDetail";
import ShoeInfo from './pages/admin/product/shoe/ShoeInfo';
import Shoe from './pages/admin/product/shoe/Shoe';
import AddCustomer from './pages/admin/account/customer/AddCustomer';
import CustomerDetail from './pages/admin/account/customer/CustomerDetail';
import Customer from './pages/admin/account/customer/Customer';
import ImageGallery from './pages/admin/ImageGallery';
import DetailProduct from './pages/client/DetailProduct';
import Size from './pages/admin/product/attribute/Size';
import Color from './pages/admin/product/attribute/Color';
import Sole from './pages/admin/product/attribute/Sole';
import Brand from './pages/admin/product/attribute/Brand';
import Category from './pages/admin/product/attribute/Category';
import Promotion from './pages/admin/promotion/Promotion';
import AddPromotion from './pages/admin/promotion/AddPromotion';

const publicRouters = [
    { path: "/", element: BaseUI },
    { path: "/admin/order", element: Order },
    { path: "/admin/bill", element: Bill },
    { path: "/admin/bill/:id", element: BillDetail },
    { path: "/admin/product", element: Shoe },
    { path: "/admin/product/add", element: AddProduct },
    { path: "/admin/product/attribute", element: ProductAttribute },
    { path: "/admin/product/:id", element: ShoeInfo },
    { path: "/admin/voucher", element: Voucher },
    { path: "/admin/voucher/add", element: AddVoucherForm },
    { path: "/admin/voucher/:id", element: VoucherDetail },
    { path: "/admin/staff", element: Staff },
    { path: "/admin/staff/add", element: AddStaff },
    { path: "/admin/staff/:id", element: StaffDetail },
    { path: "/admin/customer", element: Customer },
    { path: "/admin/customer/add", element: AddCustomer },
    { path: "/admin/customer/:id", element: CustomerDetail },
    { path: "/admin/image-gallery", element: ImageGallery },
    { path: "/admin/product/detail/:id", element: DetailProduct },

    { path: "/admin/size", element: Size },
    { path: "/admin/color", element: Color },
    { path: "/admin/sole", element: Sole },
    { path: "/admin/brand", element: Brand },
    { path: "/admin/category", element: Category },

    { path: "/admin/promotion", element: Promotion },
    { path: "/admin/promotion/create", element: AddPromotion },
    // { path: '*', element: NotFound}
];

const privateRouters = [];

export { publicRouters, privateRouters };