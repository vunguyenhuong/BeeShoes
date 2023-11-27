package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.response.StatisticalDayResponse;
import com.poly.beeshoes.dto.response.StatisticalMonthlyResponse;

import java.util.List;

public interface StatisticalService {

    List<StatisticalDayResponse> getAllStatisticalDay();
    List<StatisticalMonthlyResponse> getAllStatisticalMonth();
}
