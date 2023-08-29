package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Images;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.converter.ShoeDetailConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.request.ShoeDetailRequest;
import com.poly.beeshoes.repository.IImagesRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import com.poly.beeshoes.service.ShoeDetailService;
import com.poly.beeshoes.util.CloudinaryUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private CloudinaryUtils cloudinaryUtils;


    @Override
    public PageableObject<ShoeDetail> getAll(ShoeDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(shoeDetailRepository.getAllShoeDetail(request, pageable));
    }

    @Override
    public ShoeDetail getOne(Long id) {
        return shoeDetailRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public ShoeDetail create(ShoeDetailRequest request) {
        if (shoeDetailRepository.existsByShoeIdAndColorIdAndSizeIdAndSoleId(
                request.getShoe(), request.getColor(), request.getSize(), request.getSole()
        )) {
            throw new RestApiException("Phiên bản này đã tồn tại!");
        }
        ShoeDetail shoeDetailSave = shoeDetailRepository.save(shoeDetailConvert.convertRequestToEntity(request));
        if (shoeDetailSave != null) {
            List<String> listImg = cloudinaryUtils.uploadMultipleImages(request.getListImages(), "product");
            try{
                for (String x : listImg) {
                    imagesRepository.save(Images.builder().shoeDetail(shoeDetailSave)
                            .name(x).build());
                }
            }catch (Exception e){
                throw new RestApiException(e.getMessage());
            }
        }
        return shoeDetailSave;
    }

    @Override
    public ShoeDetail update(Long id, ShoeDetailRequest request) {
        ShoeDetail old = shoeDetailRepository.findById(id).get();
        if (shoeDetailRepository.existsByShoeIdAndColorIdAndSizeIdAndSoleId(
                request.getShoe(), request.getColor(), request.getSize(), request.getSole()
        )) {
            if (old.getSize().getId() == request.getSize()
                    && old.getShoe().getId() == request.getShoe()
                    && old.getColor().getId() == request.getColor()
                    && old.getSole().getId() == request.getSole()) {
                return shoeDetailRepository.save(shoeDetailConvert.convertRequestToEntity(old, request));
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
