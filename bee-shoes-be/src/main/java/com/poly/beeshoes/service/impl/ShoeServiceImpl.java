package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.dto.request.shoe.FindShoeReqeust;
import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.converter.ShoeConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.dto.request.shoe.ShoeRequest;
import com.poly.beeshoes.dto.response.ShoeResponse;
import com.poly.beeshoes.dto.response.promotion.ShoePromotionResponse;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import com.poly.beeshoes.repository.IShoeRepository;
import com.poly.beeshoes.service.ShoeService;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class ShoeServiceImpl implements ShoeService {
    @Autowired
    private IShoeRepository shoeRepository;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Autowired
    private ShoeConvert shoeConvert;

    @Override
    public PageableObject<ShoeResponse> getAll(FindShoeReqeust request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        FindShoeReqeust customRequest = FindShoeReqeust.builder()
                .colors(request.getColor() != null ? Arrays.asList(request.getColor().split(",")) : null)
                .sizes(request.getSize() != null ? Arrays.asList(request.getSize().split(",")) : null)
                .soles(request.getSole() != null ? Arrays.asList(request.getSole().split(",")) : null)
                .categories(request.getCategory() != null ? Arrays.asList(request.getCategory().split(",")) : null)
                .brands(request.getBrand() != null ? Arrays.asList(request.getBrand().split(",")) : null)
                .size(request.getSize())
                .color(request.getColor())
                .sole(request.getSole())
                .name(request.getName())
                .brand(request.getBrand())
                .category(request.getCategory())
                .minPrice(request.getMinPrice())
                .maxPrice(request.getMaxPrice())
                .category(request.getCategory())
                .brand(request.getBrand())
                .status(request.getStatus())
                .build();
        return new PageableObject<>(shoeRepository.getAllShoe(customRequest, pageable));
    }

    @Override
    public Shoe getOne(Long id) {
        return shoeRepository.findById(id).orElse(null);
    }

    @Override
    public Shoe create(ShoeRequest request) {
        if (shoeRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RestApiException(request.getName() + " đã tồn tại!");
        }
        if(request.getName().length() > 50){
            throw new RestApiException("Tên sản phẩm có vẻ quá dài, vui lòng thử lại!");
        }
        Shoe shoe = shoeConvert.convertRequestToEntity(request);
        return shoeRepository.save(shoe);
    }

    @Override
    public Shoe update(Long id, ShoeRequest request) {
        Shoe oldShoe = shoeRepository.findById(id).get();
        if (shoeRepository.existsByNameIgnoreCase(request.getName())) {
            if (oldShoe.getName().equals(request.getName())) {
                return shoeRepository.save(shoeConvert.convertRequestToEntity(oldShoe, request));
            }
            throw new RestApiException(request.getName() + " đã tồn tại!");
        } else {
            if(request.getName().length() > 50){
                throw new RestApiException("Tên sản phẩm có vẻ quá dài, vui lòng thử lại!");
            }
            return shoeRepository.save(shoeConvert.convertRequestToEntity(oldShoe, request));
        }
    }

    @Override
    public Shoe changeStatus(Long id) {
        Shoe shoe = shoeRepository.findById(id).get();
        shoe.setDeleted(shoe.getDeleted() == false ? true : false);
        shoeRepository.save(shoe);
        shoeDetailRepository.findByShoe(shoe).forEach(shoeDetail -> {
            shoeDetail.setDeleted(shoeDetail.getDeleted() == false ? true : false);
            shoeDetailRepository.save(shoeDetail);
        });
        return shoe;
    }

    @Override
    public List<ShoePromotionResponse> getAllShoeInPromotion(Long promotion) {
        return shoeRepository.getAllShoeInPromotion(promotion);
    }

    @Override
    public List<ShoeResponse> getTopSell(Integer top) {
        return shoeRepository.topSell(top);
    }
}
