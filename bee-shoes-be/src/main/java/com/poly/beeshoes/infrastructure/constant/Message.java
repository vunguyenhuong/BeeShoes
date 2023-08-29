package com.poly.beeshoes.infrastructure.constant;

public enum Message {

    SUCCESS("Success"),
    ERROR_UNKNOWN("Error Unknown"),
    NOT_EXISTS("Không tồn tại"),

    NAME_EXISTS("Tên đã tồn tại!"),
    CODE_EXISTS("Mã đã tồn tại!"),
    CHANGED_STATUS_ERROR("không thể xác nhận hóa đơn"),

    BILL_NOT_EXIT("Hóa đơn không tồn tại "),
    ACCOUNT_NOT_EXIT("Tài khoản không tồn tại"),
    ACCOUNT_NOT_PERMISSION("Tài khoản không có quyền tạo hóa đơn"),
    BILL_NOT_REFUND("Hóa đơn không thể trả hàng"),
    ERROR_QUANTITY("Số lượng không đủ"),
    ERROR_TOTALMONEY("Tiền trả phải lớn hơn hoặc bằng phải trả"),
    PHONENUMBER_USER_EXIST("Số điện thoại người dùng đã tồn tại"),
    VOUCHER_NOT_USE("không thể sử dụng voucher"),
    STATUS_ADDRESS_EXIST("Trạng thái đang sử dụng đã được dùng cho địa chỉ khác"),
    EMAIL_USER_EXIST("Email người dùng đã tồn tại"),
    PASSWORD_NOT_EXISTS("Password không đúng"),
    NOT_PAYMENT("Đơn hàng không thể tiếp tục thanh toán");






    private String message;

    Message(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
