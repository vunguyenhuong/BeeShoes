package com.poly.beeshoes.service;

import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.VoucherRequest;
import com.poly.beeshoes.infrastructure.response.VoucherResponse;

public interface VoucherService {
    PageableObject<VoucherResponse> getAll(VoucherRequest request);
}
