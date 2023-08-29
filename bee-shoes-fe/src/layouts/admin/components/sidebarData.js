const sidebarData = [
    {
        "key": "tongQuan",
        "title": "Tổng quan",
        "icon": "fa-gauge",
        "path": "/admin/product-list"
    },
    {
        "key": "qlgiaodich",
        "title": "Quản lý giao dịch",
        "icon": "fa-money-bill-wave",
        "children": [
            {
                "key": "banHang",
                "title": "Bán hàng",
                "icon": "fa-truck-fast",
                "path": "/admin/order"
            },
            {
                "key": "qlDonHang",
                "title": "Quản lý đơn hàng",
                "icon": "fa-wallet",
                "path": "/admin/bill"
            }
        ]
    },
    {
        "key": "qlsanpham",
        "title": "Quản lý sản phẩm",
        "icon": "fa-brands fa-slack",
        "path": "/services",
        "children": [
            {
                "key": "sanPham",
                "title": "Sản phẩm",
                "icon": "fa-seedling",
                "path": "/admin/product"
            },
            {
                "key": "thuocTinh",
                "title": "Thuộc tính sản phẩm",
                "icon": "fa-brands fa-battle-net",
                "children": [
                    {
                        "key": "kichCo",
                        "title": "Kích cỡ",
                        "icon": "fa-maximize",
                        "path": "/admin/product"
                    },
                    {
                        "key": "mauSac",
                        "title": "Màu sắc",
                        "icon": "fa-droplet",
                        "path": "/services/service2"
                    },
                    {
                        "key": "deGiay",
                        "title": "Đế giày",
                        "icon": "fa-shoe-prints",
                        "path": "/admin/product"
                    },
                ]
            }
        ]
    },
    {
        "key": "qlTaiKhoan",
        "title": "Quản lý tài khoản",
        "icon": "fa-user",
        "children": [
            {
                "key": "qlNhanVien",
                "title": "Quản lý nhân viên",
                "icon": "fa-user-secret",
                "path": "/admin/staff"
            },
            {
                "key": "qlKhachHang",
                "title": "Quản lý khách hàng",
                "icon": "fa-ghost",
                "path": "/admin/customer"
            }
        ]
    },
    {
        "key": "qlVoucher",
        "title": "Quản lý Voucher",
        "icon": "fa-gift",
        "path": "/admin/product"
    },
    {
        "key": "imagesGallery",
        "title": "Thư viện hình ảnh",
        "icon": "fa-image",
        "path": "/admin/image-gallery"
    },
]

export default sidebarData;