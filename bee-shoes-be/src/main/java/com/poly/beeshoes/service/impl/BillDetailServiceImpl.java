package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.entity.BillHistory;
import com.poly.beeshoes.entity.PromotionDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.constant.BillDetailStatusConstant;
import com.poly.beeshoes.infrastructure.constant.BillStatusConstant;
import com.poly.beeshoes.infrastructure.converter.BillDetailConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.dto.request.billdetail.BillDetailRequest;
import com.poly.beeshoes.dto.response.BillDetailResponse;
import com.poly.beeshoes.repository.IBillDetailRepository;
import com.poly.beeshoes.repository.IBillHistoryRepository;
import com.poly.beeshoes.repository.IBillRepository;
import com.poly.beeshoes.repository.IPromotionDetailRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import com.poly.beeshoes.service.BillDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class BillDetailServiceImpl implements BillDetailService {

    @Autowired
    private IBillDetailRepository billDetailRepository;
    @Autowired
    private BillDetailConvert billDetailConvert;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Autowired
    private IPromotionDetailRepository promotionDetailRepository;
    @Autowired
    private IBillRepository billRepository;
    @Autowired
    private IBillHistoryRepository billHistoryRepository;

    @Override
    public PageableObject<BillDetailResponse> getAll(BillDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(billDetailRepository.getAllBillDetail(request, pageable));
    }

    @Override
    public BillDetail getOne(Long id) {
        return billDetailRepository.findById(id).orElse(null);
    }

    @Override
    public BillDetail create(BillDetailRequest request) {
        PromotionDetail promotionDetail = promotionDetailRepository.findByShoeDetailCode(request.getShoeDetail());
        BillDetail billDetail = billDetailConvert.convertRequestToEntity(request);
        ShoeDetail shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
        if (request.getQuantity() < 1) {
            throw new RestApiException("Số lượng phải lớn hơn 1!");
        } else if (request.getQuantity() > shoeDetail.getQuantity()) {
            throw new RestApiException("Quá số lượng cho phép!");
        }
        shoeDetail.setQuantity(shoeDetail.getQuantity() - request.getQuantity());
        shoeDetailRepository.save(shoeDetail);
        BillDetail existBillDetail = billDetailRepository.findByShoeDetailCodeAndBillIdAndStatus(request.getShoeDetail(), request.getBill(), false);
        if (existBillDetail != null) {
            existBillDetail.setPrice(promotionDetail != null ? promotionDetail.getPromotionPrice() : shoeDetail.getPrice());
            existBillDetail.setQuantity(existBillDetail.getQuantity() + request.getQuantity());
            if(existBillDetail.getPrice().compareTo(request.getPrice()) < 0){
                existBillDetail.setPrice(request.getPrice());
            }
            return billDetailRepository.save(existBillDetail);
        }
        BillDetail billDetail1 = billDetailRepository.save(billDetail);

        Bill bill = billDetail1.getBill();
        if (bill.getStatus() != BillStatusConstant.TAO_DON_HANG) {
            Double caculateTotalMoney = 0.0;
            for (BillDetail x : billDetailRepository.findByBillId(billDetail.getBill().getId())) {
                caculateTotalMoney += x.getQuantity() * x.getPrice().doubleValue();
            }
            bill.setTotalMoney(BigDecimal.valueOf(caculateTotalMoney).subtract(bill.getMoneyReduce()));

            if (bill.getStatus() == BillStatusConstant.CHO_GIAO || bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN || bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN) {
                BillHistory billHistory = new BillHistory();
                billHistory.setBill(bill);
                billHistory.setNote("Đã thêm " + request.getQuantity() + " giày \"" + shoeDetail.getShoe().getName() + " [" + shoeDetail.getColor().getName() + "-" + shoeDetail.getSize().getName() + "]\"");
                billHistory.setStatus(BillStatusConstant.CHINH_SUA_DON_HANG);
                billHistoryRepository.save(billHistory);
            }
            billRepository.save(bill);
        }
        return billDetail1;
    }

    @Override
    public BillDetail update(Long id, BillDetailRequest request) {
        BillDetail old = billDetailRepository.findById(id).get();
        return billDetailRepository.save(billDetailConvert.convertRequestToEntity(old, request));
    }

    @Override
    public BillDetail delete(Long id) {
        BillDetail billDetail = billDetailRepository.findById(id).get();
        ShoeDetail shoeDetail = billDetail.getShoeDetail();
        shoeDetail.setQuantity(shoeDetail.getQuantity() + billDetail.getQuantity());
        billDetailRepository.delete(billDetail);

        Bill bill = billDetail.getBill();
        if (bill.getStatus() != BillStatusConstant.TAO_DON_HANG) {
            Double caculateTotalMoney = 0.0;
            for (BillDetail x : billDetailRepository.findByBillId(billDetail.getBill().getId())) {
                caculateTotalMoney += x.getQuantity() * x.getPrice().doubleValue();
            }
            bill.setTotalMoney(BigDecimal.valueOf(caculateTotalMoney).subtract(bill.getMoneyReduce()));

            if (bill.getStatus() == BillStatusConstant.CHO_GIAO || bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN || bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN) {
                BillHistory billHistory = new BillHistory();
                billHistory.setBill(bill);
                billHistory.setNote("Đã xóa " + " giày \"" + shoeDetail.getShoe().getName() + " [" + shoeDetail.getColor().getName() + "-" + shoeDetail.getSize().getName() + "]\"");
                billHistory.setStatus(BillStatusConstant.CHINH_SUA_DON_HANG);
                billHistoryRepository.save(billHistory);
            }
            billRepository.save(bill);
        }
        return billDetail;
    }

    @Override
    public BillDetail updateQuantity(Long id, Integer newQuantity, BigDecimal price) {
        BillDetail billDetail = billDetailRepository.findById(id).get();
        ShoeDetail shoeDetail = billDetail.getShoeDetail();
        if (newQuantity > (shoeDetail.getQuantity() + billDetail.getQuantity())) {
            throw new RestApiException("Quá số lượng cho phép!");
        }
        if (newQuantity <= 0) {
            throw new RestApiException("Vui lòng nhập số lượng hợp lệ!");
        }
        shoeDetail.setQuantity(shoeDetail.getQuantity() + billDetail.getQuantity() - newQuantity);
        billDetail.setQuantity(newQuantity);
        if(billDetail.getPrice().compareTo(price) < 0){
            billDetail.setPrice(price);
        }
        billDetailRepository.save(billDetail);
        shoeDetailRepository.save(shoeDetail);

        Bill bill = billDetail.getBill();
        if (bill.getStatus() != BillStatusConstant.TAO_DON_HANG) {
            Double caculateTotalMoney = 0.0;
            for (BillDetail x : billDetailRepository.findByBillId(billDetail.getBill().getId())) {
                caculateTotalMoney += x.getQuantity() * x.getPrice().doubleValue();
            }
            bill.setTotalMoney(BigDecimal.valueOf(caculateTotalMoney).subtract(bill.getMoneyReduce()));

            if (bill.getStatus() == BillStatusConstant.CHO_GIAO || bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN || bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN) {
                BillHistory billHistory = new BillHistory();
                billHistory.setBill(bill);
                billHistory.setNote("Đã sửa số lượng " + " giày \"" + shoeDetail.getShoe().getName() + " [" + shoeDetail.getColor().getName() + "-" + shoeDetail.getSize().getName() + "]\" lên \"" + newQuantity + "\"");
                billHistory.setStatus(BillStatusConstant.CHINH_SUA_DON_HANG);
                billHistoryRepository.save(billHistory);
            }
            billRepository.save(bill);
        }
        return billDetail;
    }
}
