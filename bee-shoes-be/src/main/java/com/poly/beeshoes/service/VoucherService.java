package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Voucher;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.dto.request.VoucherRequest;
import com.poly.beeshoes.dto.response.VoucherResponse;

import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getAccountVoucher(Long id,VoucherRequest request);
    List<VoucherResponse> getPublicVoucher(VoucherRequest request);
    PageableObject<VoucherResponse> getAll(VoucherRequest request);
    VoucherResponse getOne(Long id);

    Voucher add(VoucherRequest voucher);

    Voucher update(Long id, VoucherRequest voucher);

    String delete(Long id);

    boolean isVoucherCodeExists(String code);

    void updateStatusVoucher();

    Voucher updateEndDate(Long id);
}
