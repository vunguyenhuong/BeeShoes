package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.response.statistic.StatisticalDayResponse;
import com.poly.beeshoes.dto.response.statistic.StatisticalMonthlyResponse;

import java.util.List;

public interface StatisticalService {

    List<StatisticalDayResponse> getAllStatisticalDay();
    List<StatisticalMonthlyResponse> getAllStatisticalMonth();
}
