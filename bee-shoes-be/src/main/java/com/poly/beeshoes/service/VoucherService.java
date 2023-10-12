package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Voucher;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.VoucherRequest;
import com.poly.beeshoes.infrastructure.response.VoucherResponse;

public interface VoucherService {
    PageableObject<VoucherResponse> getAll(VoucherRequest request);
    Voucher getOne(Long id);

    Voucher add(VoucherRequest voucher);

    Voucher update(Long id, VoucherRequest voucher);

    String delete(Long id);

    boolean isVoucherCodeExists(String code);

    void updateStatus();

    void createScheduledVoucher();
}
