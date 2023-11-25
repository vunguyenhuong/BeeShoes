package com.poly.tool;

import com.poly.beeshoes.entity.*;
import com.poly.beeshoes.infrastructure.common.GenCode;
import com.poly.beeshoes.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.Date;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.poly.beeshoes.repository")
public class DBGenerator implements CommandLineRunner {

    @Autowired
    private IAccountRepository accountRepository;
    @Autowired
    private IAddressRepository addressRepository;
    @Autowired
    private IBillDetailRepository billDetailRepository;
    @Autowired
    private IBillHistoryRepository billHistoryRepository;
    @Autowired
    private IBillRepository billRepository;
    @Autowired
    private IBrandRepository brandRepository;
    @Autowired
    private ICategoryRepository categoryRepository;
    @Autowired
    private IColorRepository colorRepository;
    @Autowired
    private IImagesRepository imagesRepository;
    @Autowired
    private IPaymentMethodRepository paymentMethodRepository;
    @Autowired
    private IRoleRepository roleRepository;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Autowired
    private IShoeRepository shoeRepository;
    @Autowired
    private ISizeRepository sizeRepository;
    @Autowired
    private ISoleRepository soleRepository;
    @Autowired
    private IVoucherRepository voucherRepository;
    @Autowired
    private IAccountVoucherRepository accountVoucherRepository;
    @Autowired
    private IPromotionRepository promotionRepository;
    @Autowired
    IPromotionDetailRepository promotionDetailRepository;

    @Override
    public void run(String... args) throws Exception {
        // Category
        Category category1 = new Category();
        category1.setName("Chạy bộ");
        category1.setId(categoryRepository.save(category1).getId());

        Category category2 = new Category();
        category2.setName("Bóng đá");
        category2.setId(categoryRepository.save(category2).getId());

        // Brand
        Brand brand1 = new Brand();
        brand1.setName("Nike");
        brand1.setId(brandRepository.save(brand1).getId());

        Brand brand2 = new Brand();
        brand2.setName("Adidas");
        brand2.setId(brandRepository.save(brand2).getId());

        // Shoe
        Shoe shoe1 = new Shoe();
        shoe1.setName("Nike Air Max");
        shoe1.setDescription("Đây là mô tả");
        shoe1.setBrand(brand1);
        shoe1.setCategory(category1);
        shoe1.setId(shoeRepository.save(shoe1).getId());

        Shoe shoe2 = new Shoe();
        shoe2.setName("Adidas Superstar");
        shoe2.setDescription("hehehehehe");
        shoe2.setBrand(brand2);
        shoe2.setCategory(category2);
        shoe2.setId(shoeRepository.save(shoe2).getId());

        // Size
        Size size36 = new Size();
        size36.setName("36");
        size36.setId(sizeRepository.save(size36).getId());

        Size size37 = new Size();
        size37.setName("37");
        size37.setId(sizeRepository.save(size37).getId());

        Size size39 = new Size();
        size39.setName("39");
        size39.setId(sizeRepository.save(size39).getId());

        Size size40 = new Size();
        size40.setName("40");
        size40.setId(sizeRepository.save(size40).getId());

        Size size41 = new Size();
        size41.setName("41");
        size41.setId(sizeRepository.save(size41).getId());

        // Color
        Color colorRed = new Color();
        colorRed.setName("Đỏ");
        colorRed.setId(colorRepository.save(colorRed).getId());

        Color colorYellow = new Color();
        colorYellow.setName("Vàng");
        colorYellow.setId(colorRepository.save(colorYellow).getId());

        Color colorBlue = new Color();
        colorBlue.setName("Xanh");
        colorBlue.setId(colorRepository.save(colorBlue).getId());

        Color colorBlack = new Color();
        colorBlack.setName("Đen");
        colorBlack.setId(colorRepository.save(colorBlack).getId());

        Color colorWhite = new Color();
        colorWhite.setName("Trắng");
        colorWhite.setId(colorRepository.save(colorWhite).getId());
        // Sole
        Sole sole1 = new Sole();
        sole1.setName("Cao su");
        sole1.setId(soleRepository.save(sole1).getId());

        Sole sole2 = new Sole();
        sole2.setName("Đinh");
        sole2.setId(soleRepository.save(sole2).getId());

        Sole sole3 = new Sole();
        sole3.setName("Đặc");
        sole3.setId(soleRepository.save(sole3).getId());

        // ShoeDetail
        ShoeDetail shoeDetail1 = new ShoeDetail();
        shoeDetail1.setCode(GenCode.genCodeByName(shoe1.getName()
                + colorBlack.getName() + size37.getName() + sole1.getName()));
        shoeDetail1.setPrice(BigDecimal.valueOf(450000));
        shoeDetail1.setQuantity(50);
        shoeDetail1.setWeight(1.5);
        shoeDetail1.setShoe(shoe1);
        shoeDetail1.setColor(colorBlack);
        shoeDetail1.setSize(size37);
        shoeDetail1.setSole(sole1);
        shoeDetail1.setId(shoeDetailRepository.save(shoeDetail1).getId());

        ShoeDetail shoeDetail2 = new ShoeDetail();
        shoeDetail2.setCode(GenCode.genCodeByName(shoe2.getName()
                + colorWhite.getName() + size39.getName() + sole3.getName()));
        shoeDetail2.setPrice(BigDecimal.valueOf(750000));
        shoeDetail2.setQuantity(30);
        shoeDetail2.setWeight(1.0);
        shoeDetail2.setShoe(shoe2);
        shoeDetail2.setColor(colorWhite);
        shoeDetail2.setSize(size39);
        shoeDetail2.setSole(sole3);
        shoeDetail2.setId(shoeDetailRepository.save(shoeDetail2).getId());

        ShoeDetail shoeDetail3 = new ShoeDetail();
        shoeDetail3.setCode(GenCode.genCodeByName(shoe1.getName()
                + colorWhite.getName() + size40.getName() + sole1.getName()));
        shoeDetail3.setPrice(BigDecimal.valueOf(650000));
        shoeDetail3.setQuantity(25);
        shoeDetail3.setWeight(1.5);
        shoeDetail3.setShoe(shoe1);
        shoeDetail3.setColor(colorWhite);
        shoeDetail3.setSize(size40);
        shoeDetail3.setSole(sole1);
        shoeDetail3.setId(shoeDetailRepository.save(shoeDetail3).getId());

        // Image
        Images images1 = new Images();
        images1.setName("http://res.cloudinary.com/beeshoes/image/upload/v1696177712/account/sancw2l5mkss2nkyg3fv.webp");
        images1.setShoeDetail(shoeDetail1);
        images1.setId(imagesRepository.save(images1).getId());

        Images images2 = new Images();
        images2.setName("http://res.cloudinary.com/beeshoes/image/upload/v1696179651/account/dkx9yf7dfvbammb5ipg3.jpg");
        images2.setShoeDetail(shoeDetail2);
        images2.setId(imagesRepository.save(images2).getId());

        Images images3 = new Images();
        images3.setName("http://res.cloudinary.com/beeshoes/image/upload/v1696179651/account/dkx9yf7dfvbammb5ipg3.jpg");
        images3.setShoeDetail(shoeDetail3);
        images3.setId(imagesRepository.save(images3).getId());

        //Promotion
        Promotion promotion1 = new Promotion();
        promotion1.setCode("PRO1");
        promotion1.setName("Khuyến mại % TEST");
        promotion1.setStatus(1);
        promotion1.setValue(BigDecimal.valueOf(5));
        promotion1.setStartDate(LocalDateTime.of(2023, Month.OCTOBER, 15, 14, 0, 0));
        promotion1.setEndDate(LocalDateTime.of(2033, Month.OCTOBER, 15, 14, 0, 0));
        promotion1.setId(promotionRepository.save(promotion1).getId());

        Promotion promotion2 = new Promotion();
        promotion2.setCode("PRO2");
        promotion2.setName("Khuyến mại TEST");
        promotion2.setStatus(1);
        promotion2.setValue(BigDecimal.valueOf(10));
        promotion2.setStartDate(LocalDateTime.of(2023, Month.OCTOBER, 15, 14, 0, 0));
        promotion2.setEndDate(LocalDateTime.of(2033, Month.OCTOBER, 15, 14, 0, 0));
        promotion2.setId(promotionRepository.save(promotion2).getId());

        //PromotionDetail
        PromotionDetail promotionDetail1 = new PromotionDetail();
        promotionDetail1.setPromotion(promotion1);
        promotionDetail1.setShoeDetail(shoeDetail1);
        promotionDetail1.setPromotionPrice(BigDecimal.valueOf(22500));
        promotionDetail1.setId(promotionDetailRepository.save(promotionDetail1).getId());

        PromotionDetail promotionDetail2 = new PromotionDetail();
        promotionDetail2.setPromotion(promotion2);
        promotionDetail2.setShoeDetail(shoeDetail2);
        promotionDetail2.setPromotionPrice(BigDecimal.valueOf(740000));
        promotionDetail2.setId(promotionDetailRepository.save(promotionDetail2).getId());

        // Cart
        // CartDetail

        // Role
        Role nhanVien = new Role();
        nhanVien.setName("Nhân viên");
        nhanVien.setId(roleRepository.save(nhanVien).getId());

        Role khachHang = new Role();
        khachHang.setName("Khách hàng");
        khachHang.setId(roleRepository.save(khachHang).getId());

        // Account
        Account nhanVien1 = new Account();
        nhanVien1.setName("Nguyễn Thúy Hằng");
        nhanVien1.setBirthday(new Date(99, 3, 16));
        nhanVien1.setAvatar("https://res.cloudinary.com/beeshoes/image/upload/v1691146814/products/pyxjixea5klgwiw9ziv6.jpg");
        nhanVien1.setCccd("535834053750");
        nhanVien1.setEmail("Hangnt169@gmail.com");
        nhanVien1.setGender("Nữ");
        nhanVien1.setPassword("9c015d87");
        nhanVien1.setPhoneNumber("0395080515");
        nhanVien1.setUsername("Hangnt169");
        nhanVien1.setRole(nhanVien);
        nhanVien1.setId(accountRepository.save(nhanVien1).getId());

        Account khachHang1 = new Account();
        khachHang1.setName("Vũ Văn Nguyên");
        khachHang1.setBirthday(new Date(98, 5, 17));
        khachHang1.setAvatar("http://res.cloudinary.com/beeshoes/image/upload/v1696177712/account/sancw2l5mkss2nkyg3fv.webp");
        khachHang1.setCccd("535834053333");
        khachHang1.setEmail("Nguyenvv4@gmail.com");
        khachHang1.setGender("Nam");
        khachHang1.setPassword("9c015d34");
        khachHang1.setPhoneNumber("0387899999");
        khachHang1.setUsername("Nguyenvv4");
        khachHang1.setRole(khachHang);
        khachHang1.setId(accountRepository.save(khachHang1).getId());

        Account khachHang2 = new Account();
        khachHang2.setName("Nguyễn Anh Dũng");
        khachHang2.setBirthday(new Date(97, 4, 15));
        khachHang2.setAvatar("https://res.cloudinary.com/beeshoes/image/upload/v1691146877/products/l73usfzqw2dgorfrywyw.jpg");
        khachHang2.setCccd("535834053321");
        khachHang2.setEmail("DungNA29@gmail.com");
        khachHang2.setGender("Nam");
        khachHang2.setPassword("9c015d12");
        khachHang2.setPhoneNumber("0387811111");
        khachHang2.setUsername("DungNA29");
        khachHang2.setRole(khachHang);
        khachHang2.setId(accountRepository.save(khachHang2).getId());

        // Address
        Address address1 = new Address();
        address1.setName("bbi cuti");
        address1.setSpecificAddress("Số 4");
        address1.setPhoneNumber("0387555555");
        address1.setDistrict("1827");
        address1.setProvince("268");
        address1.setWard("220807");
        address1.setAccount(nhanVien1);
        address1.setId(addressRepository.save(address1).getId());

        Address address2 = new Address();
        address2.setName("ko bom hàng");
        address2.setSpecificAddress("Số 5");
        address2.setPhoneNumber("0387888888");
        address2.setDistrict("2157");
        address2.setProvince("267");
        address2.setWard("800046");
        address2.setAccount(khachHang1);
        address2.setId(addressRepository.save(address2).getId());

        Address address3 = new Address();
        address3.setName("Thánh bom hàng");
        address3.setSpecificAddress("Số 6");
        address3.setPhoneNumber("0387887777");
        address3.setDistrict("3440");
        address3.setProvince("201");
        address3.setWard("907557");
        address3.setAccount(khachHang1);
        address3.setId(addressRepository.save(address3).getId());

        Address address4 = new Address();
        address4.setName("iam Dũng");
        address4.setSpecificAddress("Số 7");
        address4.setPhoneNumber("0387888999");
        address4.setDistrict("2255");
        address4.setProvince("266");
        address4.setWard("141208");
        address4.setAccount(khachHang2);
        address4.setId(addressRepository.save(address4).getId());

        Address address5 = new Address();
        address5.setName("Phong");
        address5.setSpecificAddress("Số 8");
        address5.setPhoneNumber("0387880000");
        address5.setDistrict("2046");
        address5.setProvince("268");
        address5.setWard("220909");
        address5.setAccount(khachHang2);
        address5.setId(addressRepository.save(address5).getId());

        // notification

        // Voucher
        Voucher voucher1 = new Voucher();
        voucher1.setName("Voucher for you");
        voucher1.setCode("VC01");
        voucher1.setStartDate(LocalDateTime.of(2023, Month.OCTOBER, 10, 23, 58, 0));
        voucher1.setEndDate(LocalDateTime.of(2033, Month.OCTOBER, 10, 23, 58, 0));
        voucher1.setQuantity(25);
        voucher1.setPercentReduce(5.5F);
        voucher1.setMinBillValue(BigDecimal.valueOf(1000));
        voucher1.setId(voucherRepository.save(voucher1).getId());


        // AccountVoucher
        AccountVoucher accountVoucher1 = new AccountVoucher();
        accountVoucher1.setAccount(khachHang1);
        accountVoucher1.setVoucher(voucher1);
        accountVoucher1.setId(accountVoucherRepository.save(accountVoucher1).getId());

        // Bill
        Bill bill0 = new Bill();
        bill0.setCode("HD1001");
        bill0.setStatus(0);
        bill0.setAccount(nhanVien1);
        bill0.setId(billRepository.save(bill0).getId());

        Bill bill1 = new Bill();
        bill1.setCode("HD1002");
        bill1.setStatus(1);
        bill1.setAccount(nhanVien1);
        bill1.setId(billRepository.save(bill1).getId());

        Bill bill2 = new Bill();
        bill2.setCode("HD1003");
        bill2.setStatus(2);
        bill2.setAccount(nhanVien1);
        bill2.setId(billRepository.save(bill2).getId());

        Bill bill3 = new Bill();
        bill3.setCode("HD1004");
        bill3.setStatus(3);
        bill3.setAccount(nhanVien1);
        bill3.setId(billRepository.save(bill3).getId());

        Bill bill4 = new Bill();
        bill4.setCode("HD1005");
        bill4.setStatus(4);
        bill4.setAccount(nhanVien1);
        bill4.setId(billRepository.save(bill4).getId());

        Bill bill5 = new Bill();
        bill5.setCode("HD1006");
        bill5.setStatus(5);
        bill5.setAccount(nhanVien1);
        bill5.setId(billRepository.save(bill5).getId());

        Bill bill6 = new Bill();
        bill6.setCode("HD1007");
        bill6.setStatus(6);
        bill6.setAccount(nhanVien1);
        bill6.setId(billRepository.save(bill6).getId());

        Bill bill7 = new Bill();
        bill7.setCode("HD1008");
        bill7.setStatus(7);
        bill7.setAccount(nhanVien1);
        bill7.setId(billRepository.save(bill7).getId());

        // BillDetail

        BillDetail billDetail1 = new BillDetail();
        billDetail1.setBill(bill1);
        billDetail1.setShoeDetail(shoeDetail1);
        billDetail1.setQuantity(1);
        billDetail1.setPrice(BigDecimal.valueOf(100000));
        billDetail1.setId(billDetailRepository.save(billDetail1).getId());

        BillDetail billDetail2 = new BillDetail();
        billDetail2.setBill(bill2);
        billDetail2.setShoeDetail(shoeDetail1);
        billDetail2.setQuantity(1);
        billDetail2.setPrice(BigDecimal.valueOf(100000));
        billDetail2.setId(billDetailRepository.save(billDetail2).getId());


        // BillHistory

        // PaymentMethod


    }

    public static void main(String[] args) {
        ConfigurableApplicationContext ctx = SpringApplication.run(DBGenerator.class);
        ctx.close();
    }
}
