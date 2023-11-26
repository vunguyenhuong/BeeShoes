const sidebarData = [
  {
    key: "tongQuan",
    title: "Tổng quan",
    icon: "fa-gauge",
    path: "/",
  },
  {
    key: "banHang",
    title: "Bán hàng",
    icon: "fa-truck-fast",
    path: "/admin/order",
  },
  {
    key: "qlsanpham",
    title: "Quản lý sản phẩm",
    icon: "fa-brands fa-slack",
    children: [
      {
        key: "sanPham",
        title: "Sản phẩm",
        icon: "fa-seedling",
        path: "/admin/product",
      },
      {
        key: "thuocTinh",
        title: "Thuộc tính sản phẩm",
        icon: "fa-brands fa-battle-net",
        children: [
          {
            key: "kichCo",
            title: "Kích cỡ",
            icon: "fa-maximize",
            path: "/admin/size",
          },
          {
            key: "mauSac",
            title: "Màu sắc",
            icon: "fa-droplet",
            path: "/admin/color",
          },
          {
            key: "deGiay",
            title: "Đế giày",
            icon: "fa-shoe-prints",
            path: "/admin/sole",
          },
          {
            key: "danhMuc",
            title: "Danh Mục",
            icon: "fa-solid fa-bezier-curve",
            path: "/admin/category",
          },
          {
            key: "thuongHieu",
            title: "Thương hiệu",
            icon: "fa-brands fa-airbnb",
            path: "/admin/brand",
          },
        ],
      },
    ],
  },
  {
    key: "qlTaiKhoan",
    title: "Quản lý tài khoản",
    icon: "fa-user",
    children: [
      {
        key: "qlNhanVien",
        title: "Quản lý nhân viên",
        icon: "fa-user-secret",
        path: "/admin/staff",
      },
      {
        key: "qlKhachHang",
        title: "Quản lý khách hàng",
        icon: "fa-ghost",
        path: "/admin/customer",
      },
    ],
  },
  {
    key: "qlgiamgia",
    title: "Giảm giá",
    icon: "fa-gift",
    children: [
      {
        key: "qlkhuyenmai",
        title: "Quản lý khuyến mại",
        icon: "fa-gifts",
        path: "/admin/promotion",
      },
      {
        key: "qlVoucher",
        title: "Quản lý Voucher",
        icon: "fa-ticket",
        path: "/admin/voucher",
      },
    ],
  },
  {
    key: "traHang",
    title: "Trả hàng",
    icon: "fa-right-left",
    path: "/admin/give-back",
  },
  {
    key: "imagesGallery",
    title: "Thư viện hình ảnh",
    icon: "fa-image",
    path: "/admin/image-gallery",
  },
  {
    key: "logout",
    title: "Thoát",
    icon: "fa-right-from-bracket",
    // path: "/admin/login",
  },
];

export default sidebarData;
