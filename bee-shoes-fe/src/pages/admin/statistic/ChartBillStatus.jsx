import { CChart } from '@coreui/react-chartjs'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import httpRequest from '~/utils/httpRequest';

function ChartBillStatus() {
    const [data, setData] = useState([]);

    const statusMapping = {
        TAO_HOA_DON: "Tạo hóa đơn",
        CHO_XAC_NHAN: "Chờ xác nhận",
        CHO_VAN_CHUYEN: "Chờ vận chuyển",
        VAN_CHUYEN: "vận chuyển",
        DA_THANH_TOAN: "Đã thanh toán",
        KHONG_TRA_HANG: "Không trả hàng",
        TRA_HANG: "Trả hàng",
        DA_HUY: "Đã Hủy",
    };

    const chartPieLabels = data.map((item) => item.statusName);
    const chartPieData = data.map((item) => item.totalCount);
    const chartPieColor = ["#E46651", "#00D8FF", "#FFCE56", "#9C27B0", "#41B883", "#4CAF50", "##FF5733", "#DD1B16",]

    useEffect(() => {
        httpRequest.get('/bill/statistic-bill-status').then(response => {
            setData(response.data);
        }).catch(e => {
            console.log(e);
        })
    }, []);
    return (
        <>
            <Title level={5}>TRẠNG THÁI ĐƠN HÀNG</Title>
            <div className="container">
                <CChart
                    type="pie"
                    data={{
                        datasets: [
                            {
                                backgroundColor: chartPieColor,
                                data: chartPieData,
                            },
                        ],
                        labels: chartPieLabels,
                    }}
                    options={{
                        plugins: {
                            legend: {
                                position: "bottom",
                                labels: {
                                    color: "#333",
                                    font: {
                                        size: 14,
                                    },
                                },
                            },
                        },
                    }}
                />
            </div>
        </>
    )
}

export default ChartBillStatus