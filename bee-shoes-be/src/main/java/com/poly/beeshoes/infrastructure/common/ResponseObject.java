package com.poly.beeshoes.infrastructure.common;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseObject {
    private boolean isSuccess = false;
    private Object data;
    private String message;
    public <T> ResponseObject(T obj) {
        processResponseObject(obj);
    }

    public void processResponseObject(Object obj) {
        if (obj != null) {
            this.isSuccess = true;
            this.data = obj;
            this.message = "Thành công!";
        }else {
            this.message = "Thất bại!";
        }
    }
}
