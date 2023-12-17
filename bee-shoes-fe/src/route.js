import AddStaff from "./pages/admin/account/staff/AddStaff";
import Staff from "./pages/admin/account/staff/Staff";
import StaffDetail from "./pages/admin/account/staff/StaffDetail";
import Bill from "./pages/admin/bill/Bill";
import BillDetail from "./pages/admin/bill/BillDetail";

import Order from "./pages/admin/order/Order";
import AddProduct from "./pages/admin/product/shoe-detail/AddShoe";
import ProductAttribute from "./pages/admin/product/attribute/ProductAttribute";
import Voucher from "./pages/admin/voucher/Voucher";
import AddVoucherForm from "./pages/admin/voucher/AddVoucher";
import VoucherDetail from "./pages/admin/voucher/VoucherDetail";
import ShoeInfo from "./pages/admin/product/shoe/ShoeInfo";
import Shoe from "./pages/admin/product/shoe/Shoe";
import AddCustomer from "./pages/admin/account/customer/AddCustomer";
import CustomerDetail from "./pages/admin/account/customer/CustomerDetail";
import Customer from "./pages/admin/account/customer/Customer";
import ImageGallery from "./pages/admin/ImageGallery";
import DetailProduct from "./pages/client/DetailProduct";
import Size from "./pages/admin/product/attribute/Size";
import Color from "./pages/admin/product/attribute/Color";
import Sole from "./pages/admin/product/attribute/Sole";
import Brand from "./pages/admin/product/attribute/Brand";
import Category from "./pages/admin/product/attribute/Category";
import Promotion from "./pages/admin/promotion/Promotion";
import AddPromotion from "./pages/admin/promotion/AddPromotion";
import PromotionDetail from "./pages/admin/promotion/update/PromotionDetail";
import Statistic from "./pages/admin/statistic/Statistic";
import withAuth from "./auth";
import Payment from "./pages/admin/payment/Payment";
import UserProfile from "./pages/admin/settings/UserProfile";

const publicRouters = [
  { path: "/", element: withAuth(Statistic) },
  { path: "/admin/order", element: withAuth(Order) },
  { path: "/admin/bill", element: withAuth(Bill) },
  { path: "/admin/bill/:id", element: withAuth(BillDetail) },
  { path: "/admin/product", element: withAuth(Shoe) },
  { path: "/admin/product/add", element: withAuth(AddProduct) },
  { path: "/admin/product/attribute", element: withAuth(ProductAttribute) },
  { path: "/admin/product/:id", element: withAuth(ShoeInfo) },
  { path: "/admin/voucher", element: withAuth(Voucher) },
  { path: "/admin/voucher/add", element: withAuth(AddVoucherForm) },
  { path: "/admin/voucher/:id", element: withAuth(VoucherDetail) },
  { path: "/admin/staff", element: withAuth(Staff) },
  { path: "/admin/staff/add", element: withAuth(AddStaff) },
  { path: "/admin/staff/:id", element: withAuth(StaffDetail) },
  { path: "/admin/customer", element: withAuth(Customer) },
  { path: "/admin/customer/add", element: withAuth(AddCustomer) },
  { path: "/admin/customer/:id", element: withAuth(CustomerDetail) },
  { path: "/admin/image-gallery", element: withAuth(ImageGallery) },
  { path: "/admin/product/detail/:id", element: withAuth(DetailProduct) },

  { path: "/admin/size", element: withAuth(Size) },
  { path: "/admin/color", element: withAuth(Color) },
  { path: "/admin/sole", element: withAuth(Sole) },
  { path: "/admin/brand", element: withAuth(Brand) },
  { path: "/admin/category", element: withAuth(Category) },

  { path: "/admin/promotion", element: withAuth(Promotion) },
  { path: "/admin/promotion/:id", element: withAuth(PromotionDetail) },
  { path: "/admin/promotion/create", element: withAuth(AddPromotion) },

  { path: "/admin/vnpay-payment", element: withAuth(Payment) },
  { path: "/admin/profile", element: withAuth(UserProfile) },
  // { path: '*', element: NotFound}
];

const privateRouters = [];

export { publicRouters, privateRouters };
