package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.VoucherRequest;
import com.poly.beeshoes.infrastructure.response.VoucherResponse;
import com.poly.beeshoes.repository.IVoucherRepository;
import com.poly.beeshoes.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class VoucherServiceImpl implements VoucherService {
    @Autowired
    private IVoucherRepository repository;

    @Override
    public PageableObject<VoucherResponse> getAll(VoucherRequest request) {
        return new PageableObject<>(repository.getAllVoucher(request, PageRequest.of(request.getPage()-1 > 0 ? request.getPage()-1 : 0, request.getSizePage())));
    }
}
