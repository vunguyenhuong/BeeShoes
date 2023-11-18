package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Address;
import com.poly.beeshoes.dto.request.AddressRequest;
import com.poly.beeshoes.dto.response.AddressResponse;
import org.springframework.data.domain.Page;

public interface AddressService {
    Page<AddressResponse> getByAccount(AddressRequest request);

    Address create(AddressRequest request);

    Address update(Long idAddress, AddressRequest request);

    Address delete(Long idAddress);
}
