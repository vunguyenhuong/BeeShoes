package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Address;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.AddressRequest;
import com.poly.beeshoes.infrastructure.response.AddressResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AddressService {
    Page<AddressResponse> getByAccount(AddressRequest request);

    Address create(AddressRequest request);

    Address update(Long idAddress, AddressRequest request);

    Address delete(Long idAddress);
}
