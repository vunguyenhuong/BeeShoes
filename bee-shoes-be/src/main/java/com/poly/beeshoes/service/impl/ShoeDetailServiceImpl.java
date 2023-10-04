package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Images;
import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.converter.ShoeDetailConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.request.ShoeDetailRequest;
import com.poly.beeshoes.infrastructure.response.ShoeDetailResponse;
import com.poly.beeshoes.repository.IImagesRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import com.poly.beeshoes.repository.IShoeRepository;
import com.poly.beeshoes.service.ShoeDetailService;
import com.poly.beeshoes.util.CloudinaryUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.concurrent.Future;

@Service
public class ShoeDetailServiceImpl implements ShoeDetailService {
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Autowired
    private IImagesRepository imagesRepository;
    @Autowired
    private ShoeDetailConvert shoeDetailConvert;
    @Autowired
    private IShoeRepository shoeRepository;


    @Override
    public PageableObject<ShoeDetailResponse> getAll(ShoeDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(shoeDetailRepository.getAll(request, pageable));
    }

    @Override
    public ShoeDetail getOne(Long id) {
        return shoeDetailRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public ShoeDetail create(ShoeDetailRequest request) {
        ShoeDetail convert = shoeDetailConvert.convertRequestToEntity(request);
        ShoeDetail check = shoeDetailRepository.findByShoeIdAndColorIdAndSizeId(request.getShoe(), request.getColor(), request.getSize());
        if (check!= null) {
            check.setQuantity(request.getQuantity());
            shoeDetailRepository.save(check);
        }
        ShoeDetail shoeDetailSave = shoeDetailRepository.save(convert);
        Shoe shoe = shoeDetailSave.getShoe();
        shoe.setUpdateAt(LocalDateTime.now());
        shoeRepository.save(shoe);
        if(request.getListImages().size()>=5)
            throw new RestApiException("Chỉ được thêm tối đa 5 hình ảnh!");
        if (shoeDetailSave != null) {
            for (String x : request.getListImages()) {
                imagesRepository.save(Images.builder().shoeDetail(shoeDetailSave).name(x).build());
            }
        }
        return shoeDetailSave;
    }

    @Override
    @Transactional
    public ShoeDetail update(Long id, ShoeDetailRequest request) {
        ShoeDetail shoeDetailSave = new ShoeDetail();
        ShoeDetail old = shoeDetailRepository.findById(id).get();
        if (shoeDetailRepository.findByShoeIdAndColorIdAndSizeId(request.getShoe(), request.getColor(), request.getSize()) != null) {
            if (old.getSize().getId() == request.getSize() && old.getShoe().getId() == request.getShoe() && old.getColor().getId() == request.getColor() && old.getSole().getId() == request.getSole()) {
                shoeDetailSave = shoeDetailRepository.save(shoeDetailConvert.convertRequestToEntity(old, request));
                if(shoeDetailSave!=null){
                    for (String x: request.getListImages()) {
                        imagesRepository.save(Images.builder().shoeDetail(shoeDetailSave).name(x).build());
                    }
                }
                return shoeDetailSave;
            }
            throw new RestApiException("Phiên bản này đã tồn tại!");
        }
        return shoeDetailRepository.save(shoeDetailConvert.convertRequestToEntity(old, request));
    }

    @Override
    public ShoeDetail delete(Long id) {
        return null;
    }
}
