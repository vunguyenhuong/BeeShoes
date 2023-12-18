package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.entity.BillHistory;
import com.poly.beeshoes.entity.PaymentMethod;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.constant.BillStatusConstant;
import com.poly.beeshoes.infrastructure.constant.PaymentMethodConstant;
import com.poly.beeshoes.infrastructure.converter.PaymentMethodConvert;
import com.poly.beeshoes.dto.request.PaymentMethodRequest;
import com.poly.beeshoes.dto.response.PaymentMethodResponse;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.repository.IBillHistoryRepository;
import com.poly.beeshoes.repository.IBillRepository;
import com.poly.beeshoes.repository.IPaymentMethodRepository;
import com.poly.beeshoes.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {
    @Autowired
    private IPaymentMethodRepository repository;
    @Autowired
    private PaymentMethodConvert paymentMethodConvert;
    @Autowired
    private IBillRepository billRepository;
    @Autowired
    private IBillHistoryRepository billHistoryRepository;

    @Override
    public List<PaymentMethodResponse> getByBill(Long idBill) {
        return repository.getByBill(idBill);
    }

    @Override
    public ResponseObject create(PaymentMethodRequest request) {
        PaymentMethod paymentMethod = repository.save(paymentMethodConvert.convertRequestToEntity(request));
        List<PaymentMethod> paymentMethods = repository.findByBillIdAndType(request.getBill(), request.getType());
        Bill bill = paymentMethod.getBill();
        Double totalPayment = 0.0;
        for (PaymentMethod x: paymentMethods) {
            totalPayment+=x.getTotalMoney().doubleValue();
        }
        if (BigDecimal.valueOf(totalPayment).compareTo(bill.getTotalMoney().add(bill.getMoneyShip())) >= 0) {
            BillHistory history1 = new BillHistory();
            history1.setBill(bill);
            history1.setStatus(BillStatusConstant.XAC_NHAN_THONG_TIN_THANH_TOAN);
            history1.setNote("Đã thanh toán đủ tiền");
            billHistoryRepository.save(history1);
        }
        if(request.getType() == PaymentMethodConstant.TIEN_HOAN && bill.getStatus() == BillStatusConstant.TRA_HANG){
            bill.setMoneyReduce(BigDecimal.ZERO);
            billRepository.save(bill);
        }

        return new ResponseObject(paymentMethod);
    }
}
