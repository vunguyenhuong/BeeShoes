package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Address;
import com.poly.beeshoes.infrastructure.converter.AddressConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.dto.request.AddressRequest;
import com.poly.beeshoes.dto.response.AddressResponse;
import com.poly.beeshoes.repository.IAddressRepository;
import com.poly.beeshoes.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AddressServiceImpl implements AddressService {
    @Autowired
    private IAddressRepository addressRepository;
    @Autowired
    private AddressConvert addressConvert;

    @Override
    public Page<AddressResponse> getByAccount(AddressRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return addressRepository.getAddress(request, pageable);
    }

    @Override
    public Address create(AddressRequest request) {
        return addressRepository.save(addressConvert.convertRequestToEntity(request));
    }

    @Override
    public Address update(Long idAddress, AddressRequest request) {
        Address addressUpdate = addressConvert.convertRequestToEntity(idAddress, request);
        if (request.getDefaultAddress()) {
            Address addressDefault = addressRepository.findByAccountIdAndDefaultAddress(addressUpdate.getAccount().getId(), true);
            if (addressDefault != null) {
                addressDefault.setDefaultAddress(false);
                addressRepository.save(addressDefault);
            }
         }
        return addressRepository.save(addressUpdate);
    }

    @Override
    public Address delete(Long idAddress) {
        Address address = addressRepository.findById(idAddress).get();

        if (addressRepository.findByAccountIdAndDeleted(address.getAccount().getId(), false).size() > 1) {
            address.setDeleted(true);
            return addressRepository.save(address);
        } else {
            throw new RestApiException("Không thể xóa địa chỉ này!");
        }
    }
}
