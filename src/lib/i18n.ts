export type LangCode = "TH" | "EN";

export interface Translations {
  _lang: LangCode;
  nav: { home: string; shop: string; cart: string; me: string; allProducts: string; express: string; store: string; corporate: string; loginRegister: string; pointsLabel: string };
  shopDropdown: { all: string; paper: string; privacy: string; antiBlue: string; nano: string };
  header: {
    cart: string; checkoutAddress: string; checkout: string; payment: string;
    orderSuccess: string; profile: string; orders: string; orderDetail: string;
    points: string; addresses: string; wishlist: string; notifications: string;
    help: string; privacy: string; reviews: string; coupon: string;
    regionLanguage: string; login: string; announcements: string[];
    taxInvoiceRequest: string; returnItem: string; reviewProduct: string;
    payments: string; taxInvoice: string; campaignDetail: string;
    privacyPolicy: string; terms: string; allReviews: string;
    selectRegion: string; selectLanguage: string; selectCurrency: string;
  };
  selector: { language: string; currency: string };
  login: {
    title: string; subtitle: string;
    phoneLabel: string; emailLabel: string; emailPlaceholder: string;
    getOtp: string; orWith: string;
    continueGoogle: string; continueLine: string;
    switchToEmail: string; switchToPhone: string; continueAsGuest: string;
    otpTitle: string; otpSent: string;
    registerTitle: string; registerSubtitle: string;
    addPhoto: string; firstName: string; firstNamePlaceholder: string;
    lastName: string; lastNamePlaceholder: string; dob: string;
    gender: string; genderPlaceholder: string; genderMale: string; genderFemale: string; genderOther: string;
    genderSheetTitle: string; confirm: string; verified: string; waitOtp: string; getOtpShort: string;
    registerCta: string; errorPhone: string; errorEmail: string; errorOtp: string;
  };
  region: {
    title: string; subtitle: string; confirm: string;
    fieldRegion: string; fieldLanguage: string; fieldCurrency: string;
  };
  product: { addToCart: string; buyNow: string; outOfStock: string; viewAll: string; reviews: string; badgeHot: string; soldOut: string; remaining: string };
  common: { save: string; cancel: string; confirm: string; back: string; loading: string; search: string; close: string; confirmSelection: string };
  about: {
    heroTag: string; heroTitle: string; heroSubtitle: string;
    stat1Num: string; stat1Label: string; stat2Num: string; stat2Label: string;
    stat3Num: string; stat3Label: string; stat4Num: string; stat4Label: string;
    originTag: string; originTitle: string; originDate: string;
    originP1: string; originP2: string; originQuote: string; originP3: string;
    whyTag: string; whyTitle: string;
    why1Icon: string; why1Title: string; why1Body: string;
    why2Icon: string; why2Title: string; why2Body: string;
    why3Icon: string; why3Title: string; why3Body: string;
    contactTag: string; contactTitle: string; contactHours: string; companyAddress: string;
    faqTag: string; faqTitle: string; faqSubtitle: string;
    faqReadMore: string; faqCollapse: string; faqViewAll: string;
    faq1Q: string; faq1A: string; faq1Detail: string;
    faq2Q: string; faq2A: string; faq2Detail: string;
    faq3Q: string; faq3A: string; faq3Detail: string;
    faq4Q: string; faq4A: string; faq4Detail: string;
    faq5Q: string; faq5A: string; faq5Detail: string;
    faq6Q: string; faq6A: string; faq6Detail: string;
    ctaTitle: string; ctaSubtitle: string; ctaShop: string; ctaLine: string;
  };
  account: {
    notifSettings: string; notifOrder: string; notifOrderSub: string;
    notifPromo: string; notifPromoSub: string; notifSystem: string; notifSystemSub: string;
    sectionManage: string; sectionMore: string; allOrders: string; taxInvoiceFull: string; returns: string; logout: string; settingsLabel: string;
    orderStatusTitle: string; orderShortcutPay: string; orderShortcutDeliver: string;
    orderShortcutReceive: string; orderShortcutReview: string; viewAll: string;
    wishlistTitle: string; wishlistEmpty: string; editProfile: string;
    guestGreeting: string; guestSubtitle: string; guestLoginBtn: string;
    regionLabel: string; langLabel: string; currencyLabel: string;
    ordersTabAll: string; ordersTabPay: string; ordersTabShip: string;
    ordersTabInTransit: string; ordersTabDone: string; ordersTabReturn: string;
    ordersTabCancelled: string; returnStatusPending: string; returnStatusDone: string;
    orderExpired: string; orderGiftLabel: string; orderFreeLabel: string;
    orderHide: string; orderViewAllItems: string; orderQty: string; orderPieces: string;
    orderReceived: string; orderBuyAgain: string; ordersEmpty: string;
  };
  footer: {
    tagline: string;
    products: string; services: string; help: string;
    privacyPolicy: string; termsOfService: string; copyright: string;
    links: {
      storeFront: string; corporate: string;
      howToOrder: string; shipping: string; returns: string; contactUs: string; privacy: string;
    };
  };
  home: {
    magneticTitle: string; magneticDesc: string;
    expressTitle: string;  expressDesc: string;
    corporateTitle: string; corporateDesc: string;
    aiTitle: string;        aiDesc: string;
    topHit: string;    viewTopHit: string;
    forYou: string;    viewForYou: string;
    viewFlash: string; viewAll: string;
    tabNew: string; tabSale: string; tabPicks: string;
    storeMapTitle: string; storeMapAddress: string; storeMapNavigate: string;
    filmPrivacy: string; filmAntiBlue: string; filmPaperLike: string;
    viewAllProducts: string;
  };
  cookie: {
    title: string; desc: string; privacyLink: string; decline: string; accept: string;
  };
  pages: {
    // PromoScroll
    promoTitle: string;
    promoViewMore: string;

    // Express page
    expressSubtitle: string;
    expressAvail: string;
    expressHowTitle: string;
    expressStep1: string;
    expressStep1Desc: string;
    expressStep2: string;
    expressStep2Desc: string;
    expressStep3: string;
    expressStep3Desc: string;
    expressStep4: string;
    expressStep4Desc: string;
    expressCoverage: string;
    expressCoverageDesc: string;

    // Store page
    storeTitle: string;
    storeSubtitle: string;
    storeViewMap: string;
    storeHours: string;
    storeZone1: string; storeAddr1: string;
    storeZone2: string; storeAddr2: string;
    storeZone3: string; storeAddr3: string;
    storeSvc1Title: string; storeSvc1Desc: string;
    storeSvc2Title: string; storeSvc2Desc: string;
    storeSvc3Title: string; storeSvc3Desc: string;
    storeContactQ: string; storeContactA: string;

    // Corporate page
    corpTitle: string;
    corpSubtitle: string;
    corpWhyTitle: string;
    corpBulkTitle: string;
    corpBulkDesc: string;
    corpManagerTitle: string;
    corpManagerDesc: string;
    corpInvoiceTitle: string;
    corpInvoiceDesc: string;
    corpDeliveryTitle: string;
    corpDeliveryDesc: string;

    // Corporate quotation form
    corpFormTitle: string;
    corpFormSubtitle: string;
    corpFormCompany: string;
    corpFormCompanyPH: string;
    corpFormContact: string;
    corpFormContactPH: string;
    corpFormEmail: string;
    corpFormPhone: string;
    corpFormDevice: string;
    corpFormDevicePH: string;
    corpFormQty: string;
    corpFormQtyPH: string;
    corpFormFilm: string;
    corpFormFilmPH: string;
    corpFormNotes: string;
    corpFormNotesPH: string;
    corpFormSubmit: string;
    corpFormPrivacy: string;
    corpFormSuccess: string;
    corpFormSuccessDesc: string;
    corpFormSuccessEmail: string;
    corpFormResubmit: string;

    // Corporate page — hero & stats
    corpHeroTag: string;
    corpStat1Val: string; corpStat1Sub: string;
    corpStat2Val: string; corpStat2Sub: string;
    corpStat3Val: string; corpStat3Sub: string;

    // Corporate page — use cases section
    corpUseCaseTitle: string;
    corpUC1Badge: string; corpUC1Title: string; corpUC1Desc: string; corpUC1Scenario: string;
    corpUC2Badge: string; corpUC2Title: string; corpUC2Desc: string; corpUC2Scenario: string;
    corpUC3Badge: string; corpUC3Title: string; corpUC3Desc: string; corpUC3Scenario: string;
    corpUC4Badge: string; corpUC4Title: string; corpUC4Desc: string; corpUC4Scenario: string;
    corpUC5Badge: string; corpUC5Title: string; corpUC5Desc: string; corpUC5Scenario: string;
    corpUC6Badge: string; corpUC6Title: string; corpUC6Desc: string; corpUC6Scenario: string;

    // Corporate page — pricing section
    corpPricingTag: string; corpPricingTitle: string;
    corpPricingColQty: string; corpPricingColDiscount: string; corpPricingColNote: string;
    corpTier1Range: string; corpTier1Discount: string;
    corpTier2Range: string; corpTier2Discount: string; corpTier2Badge: string;
    corpTier3Range: string; corpTier3Discount: string; corpTier3Badge: string;
    corpTier4Range: string; corpTier4Discount: string; corpTier4Badge: string;
    corpPricingNote: string;
    corpPhoneCTA: string;

    // AI Checker page
    aiSubtitle: string;
    aiStepDevice: string;
    aiStepSize: string;
    aiStepFilm: string;
    aiSelectDevice: string;

    // NotifDrawer
    notifTitle: string;

    // Cart
    cartTitle: string;
    cartFree: string;
    cartGift: string;
    cartBundle: string;
    cartBundleSave: string;
    cartBundleWhen: string;
    cartAddBundle: string;
    cartSkip: string;
    cartCoupon: string;
    cartAiCheck: string;
    cartAiCheckCta: string;
    cartTotal: string;
    cartCheckout: string;

    // PLP
    plpItems: string;
    plpSortPriceAsc: string;
    plpSortPriceDesc: string;
    plpViewItems: string;

    // NotifDrawer
    notifEmpty: string;
    notifEmptyDesc: string;

    // Campaign page
    flashCurrentTab: string;
    flashEnded: string;
    flashNextTab: string;
    flashEndsIn: string;
    flashStartsIn: string;
    flashNextDesc: string;
    viewAllPromos: string;

    // Store page — map section
    storeFindUs: string;
    storeNavigate: string;
    storeMapSubtitle: string;

    // About page
    aboutPhoneLabel: string;
    aboutAddressLabel: string;
    aboutBlogTag: string;
    aboutBlogTitle: string;
    aboutBlogSubtitle: string;
    aboutBlogViewAll: string;

    // ReviewsStrip
    reviewsTag: string;
    reviewsTitle: string;
    reviewsSubtitle: string;
    reviewsShopeeBtn: string;
    reviewsCount: string;

    // Express page
    expressShipFrom: string;
    expressShopNow: string;
    expressPricingTitle: string;
    expressCtaTitle: string;
    expressCtaSubtitle: string;
    expressCtaBtn: string;

    // AI Checker page
    aiTitle: string;
    aiSelectSize: string;
    aiSelectFilm: string;
    aiBack: string;
    aiFoundTitle: string;
    aiFoundDesc: string;
    aiAddToCart: string;
    aiAdded: string;
    aiViewMore: string;
    aiViewAll: string;
    aiNotFoundTitle: string;
    aiNotFoundDesc: string;
    aiContactTeam: string;
    aiReset: string;
    aiPrivacyDesc: string;
    aiAntiBlueDesc: string;
    aiPaperlikeDesc: string;
    aiComingSoon: string;

    // Blog page
    blogTitle: string;
    blogSubtitle: string;
    blogReadMore: string;
    blogSubscribeTitle: string;
    blogSubscribeSubtitle: string;
    blogSubscribeBtn: string;

    // Blog detail page
    blogBackToList: string;
    blogBackOther: string;
    blogCtaTitle: string;
    blogCtaSubtitle: string;
    blogCtaBtn: string;
  };
}

const translations: Record<LangCode, Translations> = {
  TH: {
    _lang: "TH",
    nav: { home: "หน้าแรก", shop: "Shop", cart: "Cart", me: "Profile", allProducts: "สินค้าทั้งหมด", express: "จัดส่งด่วน 2 ชม.", store: "หน้าร้าน", corporate: "สำหรับองค์กร", loginRegister: "เข้าสู่ระบบ / สมัคร", pointsLabel: "แต้ม" },
    shopDropdown: { all: "ดูสินค้าทั้งหมด", paper: "ฟิล์มเนื้อกระดาษ", privacy: "ฟิล์มกันการมอง", antiBlue: "ฟิล์มกันแสงสีฟ้า", nano: "ฟิล์มนาโน" },
    header: {
      cart: "ตะกร้าสินค้า",
      checkoutAddress: "เลือกที่อยู่จัดส่ง",
      checkout: "ยืนยันคำสั่งซื้อ",
      payment: "ชำระเงิน",
      orderSuccess: "สั่งซื้อสำเร็จ",
      profile: "บัญชีของฉัน",
      orders: "คำสั่งซื้อ",
      orderDetail: "รายละเอียดคำสั่งซื้อ",
      points: "คะแนนสะสม",
      addresses: "ที่อยู่จัดส่ง",
      wishlist: "รายการที่ถูกใจ",
      notifications: "การแจ้งเตือน",
      help: "ช่วยเหลือ",
      privacy: "ความเป็นส่วนตัว",
      reviews: "ให้คะแนนสินค้า",
      coupon: "ส่วนลด",
      regionLanguage: "ภูมิภาคและภาษา",
      login: "เข้าสู่ระบบ",
      taxInvoiceRequest: "ขอใบกำกับภาษีเต็มรูปแบบ",
      returnItem: "คืนสินค้า",
      reviewProduct: "รีวิวสินค้า",
      payments: "วิธีชำระเงิน",
      taxInvoice: "ใบกำกับภาษี",
      campaignDetail: "รายละเอียดโปรโมชั่น",
      privacyPolicy: "นโยบายความเป็นส่วนตัว",
      terms: "เงื่อนไขการใช้งาน",
      allReviews: "รีวิวทั้งหมด",
      selectRegion: "เลือกประเทศ/ภูมิภาค",
      selectLanguage: "เลือกภาษา",
      selectCurrency: "เลือกสกุลเงิน",
      announcements: [
        "Express ส่งด่วนภายใน 2 ชม. ในเขต กทม.",
        "สั่งซื้อครั้งแรกลด 10% ใช้โค้ด SAFESCREEN10",
        "🏢 ลูกค้าองค์กร ขอ Quotation ได้ที่หน้า Corporate",
        "MacBook Bundle ซื้อ 2 ชิ้นลด 15% ช้อปเลย!",
      ],
    },
    selector: { language: "ภาษา", currency: "สกุลเงิน" },
    login: {
      title: "เข้าสู่ระบบ", subtitle: "เพื่อเข้าสู่ระบบ หรือสมัครสมาชิกใหม่",
      phoneLabel: "เบอร์โทรศัพท์", emailLabel: "อีเมล", emailPlaceholder: "ระบุอีเมล",
      getOtp: "รับรหัส OTP", orWith: "หรือเข้าสู่ระบบด้วย",
      continueGoogle: "ดำเนินการต่อด้วย Google", continueLine: "ดำเนินการต่อด้วย LINE",
      switchToEmail: "เข้าสู่ระบบด้วย Email", switchToPhone: "เข้าสู่ระบบด้วยเบอร์โทรศัพท์",
      continueAsGuest: "ดำเนินการต่อในฐานะแขก",
      otpTitle: "ยืนยันรหัส OTP", otpSent: "ระบบได้ส่งรหัสไปยัง",
      registerTitle: "สมัครสมาชิก", registerSubtitle: "กรุณากรอกข้อมูลเพื่อรับสิทธิพิเศษสำหรับสมาชิกใหม่",
      addPhoto: "เพิ่มรูปภาพ", firstName: "ชื่อ", firstNamePlaceholder: "ระบุชื่อจริง",
      lastName: "นามสกุล", lastNamePlaceholder: "ระบุนามสกุล", dob: "วันเดือนปีเกิด",
      gender: "เพศ", genderPlaceholder: "กรุณาเลือกเพศ", genderMale: "ชาย", genderFemale: "หญิง", genderOther: "อื่นๆ",
      genderSheetTitle: "เลือกเพศ", confirm: "ยืนยัน", verified: "ตรวจสอบแล้ว",
      waitOtp: "รอ", getOtpShort: "รับ OTP",
      registerCta: "เริ่มเป็นสมาชิก SafeScreen",
      errorPhone: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง", errorEmail: "กรุณากรอกอีเมลให้ถูกต้อง", errorOtp: "รหัส OTP ไม่ถูกต้อง",
    },
    region: {
      title: "ยินดีต้อนรับสู่ SafeScreen Tech",
      subtitle: "โปรดเลือกประเทศ/ภูมิภาค ภาษา และสกุลเงิน เพื่อเข้าสู่ประสบการณ์การช็อปปิ้งที่ดีที่สุดสำหรับคุณ",
      confirm: "ยืนยันและเข้าสู่เว็บไซต์",
      fieldRegion: "ประเทศ / ภูมิภาค (Country / Region)",
      fieldLanguage: "ภาษาแสดงผล (Display Language)",
      fieldCurrency: "สกุลเงินที่ใช้ (Currency)",
    },
    product: { addToCart: "เพิ่มใส่ตะกร้า", buyNow: "ซื้อเลย", outOfStock: "สินค้าหมด", viewAll: "ดูทั้งหมด", reviews: "รีวิว", badgeHot: "ยอดฮิต", soldOut: "ขายหมดแล้ว", remaining: "เหลืออีก" },
    common: { save: "บันทึก", cancel: "ยกเลิก", confirm: "ยืนยัน", back: "ย้อนกลับ", loading: "กำลังโหลด...", search: "ค้นหา", close: "ปิด", confirmSelection: "ยืนยัน" },
    about: {
      heroTag: "Our Story",
      heroTitle: "ปกป้องความเป็นส่วนตัวของคุณ ทุกที่ ทุกเวลา",
      heroSubtitle: "เราเชื่อว่าความเป็นส่วนตัวคือสิทธิ์พื้นฐาน ไม่ควรแลกกับอะไรทั้งนั้น",
      stat1Num: "20,000+", stat1Label: "Orders Nationwide",
      stat2Num: "10,000+", stat2Label: "Shopee Reviews",
      stat3Num: "4.9★", stat3Label: "Customer Rating",
      stat4Num: "500+", stat4Label: "Corporate Clients",
      originTag: "Origin Story",
      originTitle: "เริ่มจากความรู้สึกไม่ปลอดภัยที่คาเฟ่",
      originDate: "ก่อตั้งปี 2022 · Bangkok, Thailand",
      originP1: "Safescreen เกิดขึ้นจากปัญหาที่หลายคนเจอแต่ไม่มีใครแก้ได้จริงๆ การนั่งทำงานในคาเฟ่หรือ Co-working Space แล้วรู้สึกว่าหน้าจอของตัวเองไม่ปลอดภัย มีคนนั่งข้างๆ จ้องอยู่ตลอดเวลาโดยไม่รู้ตัว",
      originP2: "ฟิล์มกันมองที่มีในตลาดแก้ปัญหานี้ได้ แต่สร้างปัญหาใหม่ขึ้นมา ติดแล้วติดเลย ใช้ดูหนังหรือทำงานกราฟิกไม่ได้อย่างที่ควร คนต้องเลือกระหว่างความเป็นส่วนตัวกับคุณภาพหน้าจอ",
      originQuote: "เราเชื่อว่าไม่ควรต้องเลือก ความเป็นส่วนตัวคือสิทธิ์พื้นฐาน และคุณภาพหน้าจอที่ดีก็เป็นสิ่งที่ทุกคนสมควรได้รับ",
      originP3: "Safescreen จึงออกแบบฟิล์มกันมองแบบถอดได้ เพื่อให้ทุกคนเลือกได้ว่าต้องการความเป็นส่วนตัวเมื่อไหร่ โดยไม่ต้องยอมแพ้อะไรทั้งนั้น",
      whyTag: "Why Safescreen",
      whyTitle: "อะไรทำให้เราต่างจากคนอื่น",
      why1Icon: "🔒", why1Title: "DUAL PROTECTION TECHNOLOGY",
      why1Body: "ฟิล์มเดียวกันมองข้างได้ตั้งแต่ 30 องศา และกรองแสงสีฟ้าพร้อมกัน ไม่ต้องเลือกระหว่างความเป็นส่วนตัวกับการดูแลสายตา",
      why2Icon: "🛡️", why2Title: "ZERO-RISK PURCHASE GUARANTEE",
      why2Body: "ทีมงานช่วยเลือกขนาดให้ฟรีก่อนสั่ง และถ้าไม่ตรงก็เปลี่ยนได้ เพราะเราอยากให้ลูกค้าได้ของที่ใช่จริงๆ ไม่ใช่แค่ขายได้",
      why3Icon: "✦", why3Title: "CHOICE BY DESIGN",
      why3Body: "ออกแบบมาเพื่อให้คุณเลือกได้ว่าต้องการความเป็นส่วนตัวเมื่อไหร่ ไม่ใช่ติดแล้วติดเลย คุณเป็นคนควบคุม ไม่ใช่ฟิล์ม",
      contactTag: "ติดต่อเรา", contactTitle: "ช่องทางการติดต่อ", contactHours: "พร้อมตอบทุกวัน 9:00–22:00",
      companyAddress: "บริษัท รวยเสมอ จำกัด\n38 หมู่ 4 ซอยกระทุ่มล้ม 27 ถนนพุทธมณฑลสาย 4\nตำบลกระทุ่มล้ม อำเภอสามพราน จังหวัดนครปฐม 73220",
      faqTag: "FAQ", faqTitle: "ถามตอบ คำถามที่คุณอยากรู้", faqSubtitle: "คำถามที่พบบ่อยเกี่ยวกับสินค้าและบริการ",
      faqReadMore: "อ่านเพิ่มเติม", faqCollapse: "ย่อ", faqViewAll: "ดูคำถามทั้งหมด",
      faq1Q: "ฟิล์มแม่เหล็กติดตั้งอย่างไร?",
      faq1A: "ยึดด้วยแม่เหล็กด้านบนและ Nano-adhesive ด้านล่าง วางลงได้ทันที ไม่หลุดระหว่างใช้งาน และถอดออกได้โดยไม่ทิ้งร่องรอย",
      faq1Detail: "ฟิล์มรุ่น Magnetic ยึดด้วยแม่เหล็กด้านบนและ Nano-adhesive ด้านล่าง วางลงบนหน้าจอได้ทันทีโดยไม่ต้องใช้อุปกรณ์เสริม ฟิล์มจะคงตำแหน่งอย่างมั่นคงระหว่างการใช้งาน และสามารถถอดออกด้วยมือได้อย่างง่ายดายโดยไม่ทิ้งคราบกาวหรือร่องรอยใดๆ",
      faq2Q: "ใช้กับ Laptop ขององค์กรได้หรือไม่?",
      faq2A: "ได้ แม่เหล็กที่ใช้เป็นแบบแรงต่ำ ไม่ส่งผลกระทบต่อชิ้นส่วนอิเล็กทรอนิกส์ภายใน และถอดออกได้โดยไม่เสียหาย",
      faq2Detail: "ฟิล์ม SafeScreen ใช้แม่เหล็กแรงต่ำที่ผ่านการทดสอบแล้วว่าไม่ก่อให้เกิดความเสียหายต่อ SSD หรือชิ้นส่วนอิเล็กทรอนิกส์ภายใน Laptop ไม่ว่าจะเป็นรุ่นใดหรือยี่ห้อใด นอกจากนี้ยังไม่ทิ้งคราบกาวหรือรอยขีดข่วนบนหน้าจอเมื่อถอดออก เหมาะสำหรับการใช้งานในองค์กรที่มีนโยบายดูแลรักษาอุปกรณ์อย่างเคร่งครัด",
      faq3Q: "รองรับรุ่นอุปกรณ์อะไรบ้าง?",
      faq3A: "รองรับกว่า 200 รุ่น ทั้ง MacBook Air/Pro ขนาด 13–16 นิ้ว, Laptop Windows ทุกแบรนด์ชั้นนำ และ iPad Air/Pro ทุกรุ่น",
      faq3Detail: "ปัจจุบัน SafeScreen รองรับอุปกรณ์กว่า 200 รุ่น ครอบคลุม MacBook Air และ MacBook Pro ขนาด 13 ถึง 16 นิ้ว, Laptop Windows จากแบรนด์ชั้นนำทุกรุ่น รวมถึง iPad Air และ iPad Pro ทุกขนาด หากไม่แน่ใจขนาดหรือรุ่นที่รองรับ สามารถใช้ AI Size Checker บนเว็บไซต์ หรือติดต่อทีมงานผ่าน LINE",
      faq4Q: "หน้าจอจะมืดลงหลังติดฟิล์มหรือไม่?",
      faq4A: "ความสว่างลดลงประมาณ 25–30% ซึ่งสามารถปรับ Brightness เพิ่มขึ้น 1–2 ระดับเพื่อชดเชยได้ทันที",
      faq4Detail: "ฟิล์มกรองแสงมีผลทำให้ความสว่างของหน้าจอลดลงประมาณ 25–30% ซึ่งถือเป็นค่ามาตรฐานของฟิล์มกันมอง ผู้ใช้สามารถปรับ Brightness เพิ่มขึ้น 1–2 ระดับในการตั้งค่าเพื่อชดเชยส่วนที่ลดลงได้ทันที สำหรับการใช้งานที่ต้องการความสว่างเต็มที่ เช่น การรับชมภาพยนตร์ สามารถถอดฟิล์มออกได้",
      faq5Q: "รุ่น Magnetic กับ Nano แตกต่างกันอย่างไร?",
      faq5A: "ประสิทธิภาพการกันมองเทียบเท่ากัน ต่างกันที่วิธีการยึดติด โดย Magnetic เหมาะถอดติดบ่อย, Nano เหมาะการติดตั้งระยะยาว",
      faq5Detail: "ทั้งสองรุ่นให้ประสิทธิภาพการกันมองที่เทียบเท่ากัน ความแตกต่างอยู่ที่กลไกการยึดติด\n\nรุ่น Magnetic: ใช้แม่เหล็กในการยึด เหมาะสำหรับผู้ที่ต้องการถอดและติดตั้งซ้ำบ่อยครั้ง\n\nรุ่น Nano: ใช้กาวนาโนในการยึดติดแบบกึ่งถาวร หากกาวสูญเสียความเหนียว สามารถล้างด้วยน้ำสะอาด รอให้แห้ง แล้วนำกลับมาใช้ได้ใหม่",
      faq6Q: "หากสั่งซื้อผิดขนาด สามารถเปลี่ยนสินค้าได้หรือไม่?",
      faq6A: "สามารถเปลี่ยนสินค้าได้ภายใน 7 วันนับจากวันที่ได้รับสินค้า โดยติดต่อทีมงานผ่าน LINE ได้ทุกวัน 9:00–22:00",
      faq6Detail: "SafeScreen รับเปลี่ยนสินค้าที่สั่งผิดขนาดหรือผิดรุ่นภายใน 7 วันนับจากวันที่ได้รับสินค้า โดยไม่คิดค่าใช้จ่ายเพิ่มเติม เพื่อป้องกันปัญหาก่อนสั่งซื้อ แนะนำให้ใช้ AI Size Checker บนเว็บไซต์ตรวจสอบความเข้ากันได้ก่อน หรือติดต่อทีมงานผ่าน LINE @safescreenofficial ให้บริการทุกวัน 9:00–22:00",
      ctaTitle: "พร้อมปกป้องความเป็นส่วนตัวของคุณแล้วหรือยัง?",
      ctaSubtitle: "เลือกฟิล์มที่เหมาะกับคุณ หรือสอบถามทีมงานได้เลย",
      ctaShop: "ดูสินค้าทั้งหมด →", ctaLine: "Line: @safescreenofficial",
    },
    account: {
      notifSettings: "ตั้งค่าการแจ้งเตือน",
      notifOrder: "อัพเดทคำสั่งซื้อ",
      notifOrderSub: "การยืนยัน, การจัดส่ง, การจัดส่งสำเร็จ",
      notifPromo: "โปรโมชั่น & ดีล",
      notifPromoSub: "Flash Sale, คูปอง, สิทธิพิเศษสมาชิก",
      notifSystem: "การแจ้งเตือนระบบ",
      notifSystemSub: "อัพเดทแอป, นโยบาย, ความปลอดภัย",
      sectionManage: "จัดการบัญชี",
      sectionMore: "เมนูเพิ่มเติม",
      allOrders: "คำสั่งซื้อทั้งหมด",
      taxInvoiceFull: "ใบกำกับภาษีเต็มรูปแบบ",
      returns: "การคืนสินค้า",
      logout: "ออกจากระบบ",
      settingsLabel: "ตั้งค่า",
      orderStatusTitle: "สถานะคำสั่งซื้อ",
      orderShortcutPay: "ที่ต้องชำระ",
      orderShortcutDeliver: "ที่ต้องจัดส่ง",
      orderShortcutReceive: "ที่ต้องได้รับ",
      orderShortcutReview: "ให้คะแนน",
      viewAll: "ดูทั้งหมด",
      wishlistTitle: "รายการที่ถูกใจ",
      wishlistEmpty: "ยังไม่มีรายการที่ถูกใจ",
      editProfile: "แก้ไขโปรไฟล์",
      guestGreeting: "สวัสดี!",
      guestSubtitle: "เข้าสู่ระบบเพื่อประสบการณ์ที่ดียิ่งขึ้น",
      guestLoginBtn: "เข้าสู่ระบบ / สมัครสมาชิก",
      regionLabel: "ประเทศ / ภูมิภาค",
      langLabel: "ภาษา",
      currencyLabel: "สกุลเงินที่ใช้",
      ordersTabAll: "ทั้งหมด",
      ordersTabPay: "ที่ต้องชำระ",
      ordersTabShip: "ที่ต้องจัดส่ง",
      ordersTabInTransit: "กำลังจัดส่ง",
      ordersTabDone: "สำเร็จ",
      ordersTabReturn: "คืนเงิน/คืนสินค้า",
      ordersTabCancelled: "ยกเลิกแล้ว",
      returnStatusPending: "รอตรวจสอบ",
      returnStatusDone: "คืนเงินแล้ว",
      orderExpired: "หมดเวลา",
      orderGiftLabel: "ของแถม",
      orderFreeLabel: "ฟรี",
      orderHide: "ซ่อน",
      orderViewAllItems: "ดูสินค้าทั้งหมด",
      orderQty: "รายการ",
      orderPieces: "ชิ้น",
      orderReceived: "รับสินค้าแล้ว",
      orderBuyAgain: "ซื้ออีกครั้ง",
      ordersEmpty: "ไม่มีคำสั่งซื้อในสถานะนี้",
    },
    footer: {
      tagline: "ฟิล์มกันเสือกสำหรับแล็ปท็อปคุณภาพสูง\nระบบแม่เหล็ก Easy Snap ติดง่าย ถอดง่าย",
      products: "ผลิตภัณฑ์",
      services: "บริการ",
      help: "ช่วยเหลือ",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      copyright: "Prices and offers are subject to change without notice. © 2026 Ruay Samoe Co., Ltd. (Safescreen) · safescreentech.com · All rights reserved.",
      links: {
        storeFront: "หน้าร้าน",
        corporate: "ลูกค้าองค์กร",
        howToOrder: "วิธีสั่งซื้อ",
        shipping: "การจัดส่ง",
        returns: "นโยบายการคืนสินค้า",
        contactUs: "ติดต่อเรา",
        privacy: "นโยบายความเป็นส่วนตัว",
      },
    },
    home: {
      magneticTitle: "Easy Snap แม่เหล็ก",
      magneticDesc: "ติดง่าย ถอดง่าย ไม่ทิ้งคราบกาว ใช้ระบบแม่เหล็กคุณภาพสูง",
      expressTitle: "ส่งด่วน 2 ชั่วโมง",
      expressDesc: "Express Delivery ในเขต กทม. สั่งแล้วได้รับภายใน 2 ชั่วโมง",
      corporateTitle: "ราคาองค์กร",
      corporateDesc: "บริการสั่งซื้อจำนวนมาก พร้อมใบกำกับภาษี ลดสูงสุด 15%",
      aiTitle: "AI Model Checker",
      aiDesc: "ไม่แน่ใจว่ารุ่นไหนเหมาะกับ MacBook คุณ? ให้ AI ช่วยเลือก",
      topHit: "สินค้ายอดนิยม",
      viewTopHit: "ดูสินค้ายอดฮิตทั้งหมด",
      forYou: "แนะนำสำหรับคุณ",
      viewForYou: "ดูสินค้าแนะนำทั้งหมด",
      viewFlash: "ดู Flash Sale ทั้งหมด",
      viewAll: "ดูทั้งหมด",
      tabNew: "มาใหม่",
      tabSale: "โปรโมชั่น",
      tabPicks: "แนะนำ",
      storeMapTitle: "หาเราเจอที่นี่",
      storeMapAddress: "อาคารเดอะไนน์ ทาวเวอร์ พระราม 9 กรุงเทพฯ",
      storeMapNavigate: "นำทาง",
      filmPrivacy: "ฟิล์มกันการมองเห็น",
      filmAntiBlue: "ฟิล์มกรองแสงสีฟ้า",
      filmPaperLike: "Paper Like",
      viewAllProducts: "ดูสินค้าทั้งหมด →",
    },
    cookie: {
      title: "เราใช้คุกกี้",
      desc: "เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานและวิเคราะห์ข้อมูลการใช้งานเว็บไซต์",
      privacyLink: "นโยบายความเป็นส่วนตัว",
      decline: "ปฏิเสธ",
      accept: "ยอมรับทั้งหมด",
    },
    pages: {
      promoTitle: "โปรโมชั่นพิเศษ",
      promoViewMore: "ดูรายละเอียดเพิ่มเติม",
      expressSubtitle: "ส่งด่วนภายใน 2 ชั่วโมง\nในเขตกรุงเทพมหานคร",
      expressAvail: "Available 9:00–20:00 น. ทุกวัน",
      expressHowTitle: "วิธีสั่งซื้อ Express",
      expressStep1: "เลือกสินค้า",
      expressStep1Desc: "เลือกฟิล์มที่ต้องการในร้าน",
      expressStep2: "กรอกที่อยู่",
      expressStep2Desc: "ระบุที่จัดส่งในเขต กทม.",
      expressStep3: "ยืนยันคำสั่งซื้อ",
      expressStep3Desc: "ชำระเงิน COD หรือบัตรเครดิต",
      expressStep4: "รอรับสินค้า",
      expressStep4Desc: "ภายใน 2 ชั่วโมง",
      expressCoverage: "พื้นที่ให้บริการ",
      expressCoverageDesc: "ให้บริการทั่ว กทม. และปริมณฑล",
      storeTitle: "หน้าร้าน SafeScreen",
      storeSubtitle: "ค้นหาสาขาใกล้คุณ สามารถเข้าไปทดลองสินค้าและรับคำแนะนำจากผู้เชี่ยวชาญได้โดยตรง",
      storeViewMap: "ดูแผนที่",
      storeHours: "น. ทุกวัน",
      storeZone1: "กรุงเทพฯ ใจกลางเมือง", storeAddr1: "MBK Center ชั้น 4 ห้อง 4-xxx ถ.พระราม 1 ปทุมวัน กรุงเทพฯ",
      storeZone2: "กรุงเทพฯ ราชเทวี",     storeAddr2: "Pantip Plaza ชั้น 3 ห้อง 3-xxx ถ.เพชรบุรี ราชเทวี กรุงเทพฯ",
      storeZone3: "กรุงเทพฯ หลักสี่",     storeAddr3: "IT Square ชั้น 1 หลักสี่ กรุงเทพฯ",
      storeSvc1Title: "ทดสอบสินค้า",     storeSvc1Desc: "นำ MacBook มาทดลองติดฟิล์มได้เลยที่หน้าร้าน",
      storeSvc2Title: "บริการติดตั้ง",   storeSvc2Desc: "ทีมงานมืออาชีพช่วยติดฟิล์มให้อย่างระวัง ไม่มีฟองอากาศ",
      storeSvc3Title: "รับเปลี่ยนคืน",  storeSvc3Desc: "รับเปลี่ยนสินค้าใหม่ภายใน 7 วัน หากมีปัญหาจากการผลิต",
      storeContactQ: "มีคำถามเกี่ยวกับหน้าร้าน หรือต้องการสอบถามก่อนมา?",
      storeContactA: "Line OA: @safescreenofficial  |  โทร 096-228-6998",
      corpTitle: "ลูกค้าองค์กร",
      corpSubtitle: "ราคาพิเศษสำหรับการสั่งซื้อจำนวนมาก พร้อมบริการครบวงจรสำหรับองค์กร",
      corpWhyTitle: "ทำไมต้องเลือก SafeScreen Corporate?",
      corpBulkTitle: "ราคาพิเศษ Bulk",
      corpBulkDesc: "ยิ่งซื้อมาก ยิ่งประหยัด ส่วนลดสูงสุด 10% และ custom quote สำหรับ 100+ ชิ้น",
      corpManagerTitle: "Account Manager ส่วนตัว",
      corpManagerDesc: "ทีม B2B ดูแลคุณโดยตรง ตอบคำถามรวดเร็ว ประสานงานสะดวก",
      corpInvoiceTitle: "ใบกำกับภาษี / ใบแจ้งหนี้",
      corpInvoiceDesc: "ออกเอกสารครบถ้วนสำหรับบัญชีองค์กร รองรับการเบิกค่าใช้จ่าย",
      corpDeliveryTitle: "จัดส่งถึงออฟฟิศ",
      corpDeliveryDesc: "จัดส่งฟรีสำหรับ 20+ ชิ้น ทั่วกรุงเทพฯ และปริมณฑล",
      corpFormTitle: "ขอใบเสนอราคา",
      corpFormSubtitle: "กรอกข้อมูลด้านล่าง ทีม B2B จะติดต่อกลับภายใน 1 วันทำการ",
      corpFormCompany: "ชื่อบริษัท",
      corpFormCompanyPH: "บริษัท ABC จำกัด",
      corpFormContact: "ชื่อผู้ติดต่อ",
      corpFormContactPH: "คุณสมชาย ใจดี",
      corpFormEmail: "อีเมล",
      corpFormPhone: "เบอร์โทรศัพท์",
      corpFormDevice: "ประเภทอุปกรณ์",
      corpFormDevicePH: "เลือกประเภท",
      corpFormQty: "จำนวน (ชิ้น)",
      corpFormQtyPH: "ขั้นต่ำ 5 ชิ้น",
      corpFormFilm: "ประเภทฟิล์ม",
      corpFormFilmPH: "เลือกประเภทฟิล์ม",
      corpFormNotes: "รายละเอียดเพิ่มเติม",
      corpFormNotesPH: "เช่น รุ่นของ MacBook ที่ใช้ในองค์กร, ต้องการติดตั้งเองหรือให้ทีมงานติดตั้ง, วันที่ต้องการรับสินค้า ฯลฯ",
      corpFormSubmit: "ส่งใบเสนอราคา",
      corpFormPrivacy: "ข้อมูลของคุณจะถูกเก็บเป็นความลับ ใช้เพื่อการติดต่อทางธุรกิจเท่านั้น",
      corpFormSuccess: "ส่งใบเสนอราคาเรียบร้อยแล้ว!",
      corpFormSuccessDesc: "ทีม B2B ของเราจะติดต่อกลับภายใน 1 วันทำการ",
      corpFormSuccessEmail: "อีเมล:",
      corpFormResubmit: "ส่งใบเสนอราคาใหม่",
      corpHeroTag: "For B2B",
      corpStat1Val: "500+", corpStat1Sub: "Corporate Clients",
      corpStat2Val: "เริ่มต้น 1 ชิ้น", corpStat2Sub: "ไม่มีขั้นต่ำ",
      corpStat3Val: "1 วัน", corpStat3Sub: "ตอบกลับภายใน",
      corpUseCaseTitle: "เหมาะสำหรับใคร?",
      corpUC1Badge: "Data Protection", corpUC1Title: "Office & Open Space",
      corpUC1Desc: "พนักงานทำงานในพื้นที่โล่ง มีคนเดินผ่านหรือนั่งใกล้กัน ข้อมูลบริษัทและอีเมลภายในเสี่ยงถูกมองเห็น",
      corpUC1Scenario: "\"HR เปิดไฟล์เงินเดือนในห้องประชุมโล่ง\"",
      corpUC2Badge: "Financial Compliance", corpUC2Title: "ธนาคาร & สถาบันการเงิน",
      corpUC2Desc: "เจ้าหน้าที่เปิดข้อมูลบัญชีลูกค้า วงเงินกู้ หรือข้อมูลการลงทุน ภายใต้กฎหมายกำกับดูแลอย่างเข้มงวด",
      corpUC2Scenario: "\"Teller เปิดข้อมูลบัญชี ขณะลูกค้าอื่นยืนรอ\"",
      corpUC3Badge: "Patient Privacy · PDPA", corpUC3Title: "โรงพยาบาล & คลินิก",
      corpUC3Desc: "แพทย์และพยาบาลเปิดข้อมูลผู้ป่วย ผลตรวจ และประวัติการรักษา ที่เป็นข้อมูลอ่อนไหวตาม PDPA",
      corpUC3Scenario: "\"พยาบาลเปิดแฟ้มผู้ป่วย ขณะห้องตรวจมีผู้รอ\"",
      corpUC4Badge: "Workspace Privacy", corpUC4Title: "Co-working Space",
      corpUC4Desc: "ผู้เช่าพื้นที่จากหลายบริษัท ข้อมูลของแต่ละคนเสี่ยงถูกมองจากคนที่นั่งข้างๆ",
      corpUC4Scenario: "\"Startup founder เปิด Pitch Deck ข้างๆ คู่แข่ง\"",
      corpUC5Badge: "Corporate Fleet", corpUC5Title: "Corporate Office",
      corpUC5Desc: "ลูกค้าองค์กรขนาดกลาง–ใหญ่ ต้องการฟิล์มสำหรับพนักงาน Remote / Hybrid Work จัดซื้อครั้งเดียวทั้ง Fleet",
      corpUC5Scenario: "\"IT Admin สั่ง 200 ชิ้นพร้อมใบกำกับภาษี\"",
      corpUC6Badge: "Education", corpUC6Title: "สถาบันการศึกษา",
      corpUC6Desc: "จัดซื้อสำหรับนักเรียน นักศึกษา หรืออาจารย์ที่ใช้ Laptop ในห้องเรียนและห้องสมุด",
      corpUC6Scenario: "\"นักศึกษาเปิดโจทย์สอบในห้องสมุด\"",
      corpPricingTag: "Bulk Discount", corpPricingTitle: "Volume Pricing",
      corpPricingColQty: "จำนวนสั่งซื้อ", corpPricingColDiscount: "ส่วนลด", corpPricingColNote: "หมายเหตุ",
      corpTier1Range: "1–9 ชิ้น", corpTier1Discount: "ราคาปกติ",
      corpTier2Range: "10–49 ชิ้น", corpTier2Discount: "ลด 5%", corpTier2Badge: "Popular",
      corpTier3Range: "50–99 ชิ้น", corpTier3Discount: "ลด 10%", corpTier3Badge: "Best Value",
      corpTier4Range: "100+ ชิ้น", corpTier4Discount: "Custom Quote", corpTier4Badge: "Enterprise",
      corpPricingNote: "*ราคาขึ้นอยู่กับรุ่นสินค้าและปริมาณ ทีมงานจะยืนยันราคาสุดท้ายหลังรับใบเสนอราคา",
      corpPhoneCTA: "โทรหาทีม B2B ได้เลย",
      aiSubtitle: "เลือกอุปกรณ์ ขนาดหน้าจอ และประเภทฟิล์ม เราจะแนะนำสินค้าที่เหมาะสมให้คุณ",
      aiStepDevice: "อุปกรณ์",
      aiStepSize: "ขนาดหน้าจอ",
      aiStepFilm: "ประเภทฟิล์ม",
      aiSelectDevice: "เลือกประเภทอุปกรณ์",
      notifTitle: "การแจ้งเตือน",
      cartTitle: "ตะกร้าสินค้า",
      cartFree: "ฟรี",
      cartGift: "ของแถม",
      cartBundle: "ซื้อคู่ประหยัดกว่า!",
      cartBundleSave: "ประหยัดเพิ่ม",
      cartBundleWhen: "เมื่อซื้อคู่",
      cartAddBundle: "เพิ่มลงตะกร้า",
      cartSkip: "ไม่ต้องการ",
      cartCoupon: "กรอกโค้ดส่วนลด",
      cartAiCheck: "ไม่แน่ใจว่าฟิล์มในตะกร้าตรงรุ่นคุณไหม?",
      cartAiCheckCta: "เช็ค",
      cartTotal: "ยอดรวม",
      cartCheckout: "ชำระเงิน",
      plpItems: "รายการ",
      plpSortPriceAsc: "ราคาต่ำ → สูง",
      plpSortPriceDesc: "ราคาสูง → ต่ำ",
      plpViewItems: "ดูสินค้า",
      notifEmpty: "ไม่มีการแจ้งเตือน",
      notifEmptyDesc: "คุณยังไม่มีการแจ้งเตือนใหม่ในขณะนี้",
      flashCurrentTab: "รอบปัจจุบัน",
      flashEnded: "สิ้นสุดแล้ว",
      flashNextTab: "รอบถัดไป",
      flashEndsIn: "จบใน",
      flashStartsIn: "เริ่มใน",
      flashNextDesc: "เตรียมตัวให้พร้อม! ดีลรอบถัดไปกำลังจะมาพร้อมสินค้าใหม่และส่วนลดสุดพิเศษ ราคาจะเผยเมื่อรอบเริ่ม",
      viewAllPromos: "← ดูโปรโมชั่นทั้งหมด",

      storeFindUs: "Find Us Here",
      storeNavigate: "Navigate",
      storeMapSubtitle: "Smoosh สามย่าน, กรุงเทพฯ",

      aboutPhoneLabel: "โทรศัพท์",
      aboutAddressLabel: "ที่อยู่บริษัท",
      aboutBlogTag: "KNOWLEDGE BASE",
      aboutBlogTitle: "บทความที่น่าสนใจ",
      aboutBlogSubtitle: "ความรู้เกี่ยวกับฟิล์มกันมอง การดูแลสายตา และเทคโนโลยีหน้าจอ",
      aboutBlogViewAll: "ดูบทความทั้งหมด",

      reviewsTag: "Customer Reviews",
      reviewsTitle: "ลูกค้าพูดถึง Safescreen",
      reviewsSubtitle: "รีวิวจริงจากลูกค้าที่ซื้อและใช้งานจริง · Shopee Verified",
      reviewsShopeeBtn: "ดูบน Shopee",
      reviewsCount: "10,000+ รีวิว",

      expressShipFrom: "ส่งจาก",
      expressShopNow: "Shop Express Now",
      expressPricingTitle: "อัตราค่าจัดส่ง Express",
      expressCtaTitle: "สินค้าพร้อมส่ง Express",
      expressCtaSubtitle: "ฟิล์มกันเสือกทุกรุ่น พร้อมส่งด่วน ไม่ต้องรอนาน",
      expressCtaBtn: "ดูสินค้า Express",

      aiTitle: "AI Compatibility Checker",
      aiSelectSize: "เลือกขนาดหน้าจอ",
      aiSelectFilm: "เลือกประเภทฟิล์ม",
      aiBack: "← กลับ",
      aiFoundTitle: "✅ รองรับ! สินค้าที่แนะนำ",
      aiFoundDesc: "สินค้านี้เหมาะกับ",
      aiAddToCart: "หยิบใส่ตะกร้า",
      aiAdded: "เพิ่มแล้ว ✓",
      aiViewMore: "ดูเพิ่มเติม",
      aiViewAll: "ดูสินค้าทั้งหมด",
      aiNotFoundTitle: "ยังไม่มีสินค้ารองรับ combination นี้",
      aiNotFoundDesc: "ยังอยู่ในแผนพัฒนา — ลองเลือก combination อื่น หรือติดต่อทีมงานเพื่อขอข้อมูลเพิ่มเติม",
      aiContactTeam: "ติดต่อทีมงาน",
      aiReset: "เริ่มใหม่",
      aiPrivacyDesc: "กันคนแอบมอง มุมมองแคบ 30°",
      aiAntiBlueDesc: "กรองแสงสีฟ้า ถนอมสายตา",
      aiPaperlikeDesc: "เหมือนกระดาษ — เหมาะสำหรับวาด/เขียนด้วย Apple Pencil",
      aiComingSoon: "เร็วๆ นี้",

      blogTitle: "Blog",
      blogSubtitle: "ความรู้เกี่ยวกับฟิล์มกันเสือก การดูแลหน้าจอ และเทคโนโลยีที่เกี่ยวข้อง",
      blogReadMore: "อ่านต่อ →",
      blogSubscribeTitle: "รับบทความใหม่ก่อนใคร",
      blogSubscribeSubtitle: "สมัครรับ Newsletter ทิปส์ดูแลหน้าจอและโปรโมชันพิเศษ",
      blogSubscribeBtn: "สมัคร",

      blogBackToList: "กลับไปหน้า Blog",
      blogBackOther: "บทความอื่นๆ",
      blogCtaTitle: "ยังไม่รู้จะเลือกรุ่นไหน?",
      blogCtaSubtitle: "ลอง AI Compatibility Checker เลือกอุปกรณ์ ขนาดหน้าจอ และประเภทฟิล์ม แล้วเราจะแนะนำสินค้าที่เหมาะสมให้ทันที",
      blogCtaBtn: "ลอง AI Checker →",
    },
  },

  EN: {
    _lang: "EN",
    nav: { home: "Home", shop: "Shop", cart: "Cart", me: "Profile", allProducts: "All Products", express: "2-Hr Delivery", store: "Store Locations", corporate: "Corporate", loginRegister: "Sign In / Register", pointsLabel: "pts" },
    shopDropdown: { all: "All Products", paper: "Paper-like Film", privacy: "Privacy Film", antiBlue: "Anti-Blue Light Film", nano: "Nano Film" },
    header: {
      cart: "Shopping Cart",
      checkoutAddress: "Select Delivery Address",
      checkout: "Order Confirmation",
      payment: "Payment",
      orderSuccess: "Order Placed",
      profile: "My Account",
      orders: "My Orders",
      orderDetail: "Order Details",
      points: "Loyalty Points",
      addresses: "Delivery Addresses",
      wishlist: "Wishlist",
      notifications: "Notifications",
      help: "Help & Support",
      privacy: "Privacy",
      reviews: "Rate Products",
      coupon: "Discounts",
      regionLanguage: "Region & Language",
      login: "Log In",
      taxInvoiceRequest: "Full Tax Invoice Request",
      returnItem: "Return Item",
      reviewProduct: "Review Product",
      payments: "Payment Methods",
      taxInvoice: "Tax Invoice",
      campaignDetail: "Promotion Details",
      privacyPolicy: "Privacy Policy",
      terms: "Terms of Service",
      allReviews: "All Reviews",
      selectRegion: "Select Region",
      selectLanguage: "Select Language",
      selectCurrency: "Select Currency",
      announcements: [
        "Express delivery within 2 hrs in Bangkok",
        "First order 10% off — use code SAFESCREEN10",
        "🏢 Corporate clients: request a Quotation on the Corporate page",
        "MacBook Bundle — buy 2 and save 15%",
      ],
    },
    selector: { language: "Language", currency: "Currency" },
    login: {
      title: "Sign In", subtitle: "Sign in or create a new account",
      phoneLabel: "Phone Number", emailLabel: "Email", emailPlaceholder: "Enter email",
      getOtp: "Get OTP", orWith: "Or continue with",
      continueGoogle: "Continue with Google", continueLine: "Continue with LINE",
      switchToEmail: "Sign in with Email", switchToPhone: "Sign in with Phone",
      continueAsGuest: "Continue as Guest",
      otpTitle: "Verify OTP", otpSent: "We sent a code to",
      registerTitle: "Create Account", registerSubtitle: "Fill in your details to receive new member benefits",
      addPhoto: "Add Photo", firstName: "First Name", firstNamePlaceholder: "Enter first name",
      lastName: "Last Name", lastNamePlaceholder: "Enter last name", dob: "Date of Birth",
      gender: "Gender", genderPlaceholder: "Select gender", genderMale: "Male", genderFemale: "Female", genderOther: "Other",
      genderSheetTitle: "Select Gender", confirm: "Confirm", verified: "Verified",
      waitOtp: "Wait", getOtpShort: "Get OTP",
      registerCta: "Join SafeScreen",
      errorPhone: "Please enter a valid phone number", errorEmail: "Please enter a valid email", errorOtp: "Invalid OTP code",
    },
    region: {
      title: "Welcome to SafeScreen Tech",
      subtitle: "Please select your country/region, language, and currency for the best experience.",
      confirm: "Confirm & Enter",
      fieldRegion: "Country / Region",
      fieldLanguage: "Display Language",
      fieldCurrency: "Currency",
    },
    product: { addToCart: "Add to Cart", buyNow: "Buy Now", outOfStock: "Out of Stock", viewAll: "View All", reviews: "Reviews", badgeHot: "Hot", soldOut: "Sold Out", remaining: "Left:" },
    common: { save: "Save", cancel: "Cancel", confirm: "Confirm", back: "Back", loading: "Loading...", search: "Search", close: "Close", confirmSelection: "Confirm" },
    about: {
      heroTag: "Our Story",
      heroTitle: "Protect Your Privacy, Anywhere, Anytime.",
      heroSubtitle: "We believe privacy is a fundamental right — it should never be traded away.",
      stat1Num: "20,000+", stat1Label: "Orders Nationwide",
      stat2Num: "10,000+", stat2Label: "Shopee Reviews",
      stat3Num: "4.9★", stat3Label: "Customer Rating",
      stat4Num: "500+", stat4Label: "Corporate Clients",
      originTag: "Origin Story",
      originTitle: "It Started with an Unsafe Feeling at a Café",
      originDate: "Founded 2022 · Bangkok, Thailand",
      originP1: "Safescreen was born from a problem many people experience but no one had truly solved — sitting at a café or co-working space and feeling exposed, with strangers glancing at your screen without you even noticing.",
      originP2: "Privacy films on the market solved that problem but created a new one — once applied, they stayed on permanently, making it difficult to watch movies or do graphic work properly. People had to choose between privacy and screen quality.",
      originQuote: "We believed you shouldn't have to choose — privacy is a fundamental right, and great screen quality is something everyone deserves.",
      originP3: "So Safescreen designed a removable privacy film, giving everyone the choice of when they want privacy — without having to give anything up.",
      whyTag: "Why Safescreen",
      whyTitle: "What Makes Us Different",
      why1Icon: "🔒", why1Title: "DUAL PROTECTION TECHNOLOGY",
      why1Body: "One film blocks side-viewing from 30° and filters blue light simultaneously — no need to choose between privacy and eye care.",
      why2Icon: "🛡️", why2Title: "ZERO-RISK PURCHASE GUARANTEE",
      why2Body: "Our team helps you find the right size for free before ordering, and if it's wrong we'll exchange it — because we want customers to get exactly what fits.",
      why3Icon: "✦", why3Title: "CHOICE BY DESIGN",
      why3Body: "Designed so you decide when you want privacy — not stuck once applied. You're in control, not the film.",
      contactTag: "Contact Us", contactTitle: "Get in Touch", contactHours: "Available every day 9:00–22:00",
      companyAddress: "Ruay Samoe Co., Ltd.\n38 Moo 4, Soi Krathumlom 27, Phutthamonthon Sai 4 Rd.\nKrathumlom, Sampran, Nakhon Pathom 73220, Thailand",
      faqTag: "FAQ", faqTitle: "Frequently Asked Questions", faqSubtitle: "Common questions about our products and services",
      faqReadMore: "Read more", faqCollapse: "Collapse", faqViewAll: "View all questions",
      faq1Q: "How do I install the magnetic film?",
      faq1A: "Attach via magnet at the top and Nano-adhesive at the bottom. Place it down instantly — stays secure during use and removes without a trace.",
      faq1Detail: "The Magnetic model attaches via a top magnet and Nano-adhesive at the bottom. Simply place it on the screen — no tools needed. The film stays firmly in position during use and can be removed by hand easily without leaving any adhesive residue or marks.",
      faq2Q: "Is it safe to use on a company laptop?",
      faq2A: "Yes — the magnets are low-strength and have been tested to have no impact on internal components. Removes without damage.",
      faq2Detail: "SafeScreen uses low-strength magnets tested to cause no damage to SSDs or any internal electronic components of any laptop brand or model. It also leaves no adhesive residue or scratches when removed, making it ideal for organizations with strict device care policies.",
      faq3Q: "Which device models are supported?",
      faq3A: "Supports 200+ models including MacBook Air/Pro 13–16\", all major Windows laptop brands, and all iPad Air/Pro models.",
      faq3Detail: "SafeScreen currently supports 200+ models covering MacBook Air and MacBook Pro from 13 to 16 inches, all major Windows laptop brands, and all iPad Air and iPad Pro sizes. Unsure of your size? Use the AI Size Checker on the website or contact us via LINE for free help.",
      faq4Q: "Will the screen look darker after applying the film?",
      faq4A: "Brightness reduces by around 25–30%. Increase brightness by 1–2 notches and it's back to normal. Remove the film instantly when you need full brightness.",
      faq4Detail: "The privacy filter reduces screen brightness by approximately 25–30%, which is standard for privacy films. Simply increase your brightness by 1–2 notches in your display settings to compensate. For activities requiring full brightness, such as watching movies, you can remove the film instantly without any effect on the display.",
      faq5Q: "What's the difference between Magnetic and Nano?",
      faq5A: "Privacy performance is equal. The difference is attachment — Magnetic is great for frequent removal, Nano suits long-term installation.",
      faq5Detail: "Both models provide identical privacy performance. The difference is in the attachment mechanism.\n\nMagnetic: Attaches via magnets — ideal for those who want to attach and remove frequently.\n\nNano: Uses nano-adhesive for semi-permanent attachment. If the adhesive loses stickiness, rinse with water, let it dry, and it's sticky again.",
      faq6Q: "Can I exchange if I ordered the wrong size?",
      faq6A: "Yes, within 7 days of receiving the product. Contact us via LINE @safescreenofficial — available every day 9:00–22:00.",
      faq6Detail: "SafeScreen accepts exchanges for wrong size or wrong model within 7 days of receiving the product at no additional charge. To prevent issues before ordering, use the AI Size Checker on the website, or contact @safescreenofficial on LINE for guidance. Available every day 9:00–22:00.",
      ctaTitle: "Ready to Protect Your Privacy?",
      ctaSubtitle: "Choose the film that fits you, or ask our team for guidance.",
      ctaShop: "View All Products →", ctaLine: "Line: @safescreenofficial",
    },
    account: {
      notifSettings: "Notification Settings",
      notifOrder: "Order Updates",
      notifOrderSub: "Confirmation, shipping, delivered",
      notifPromo: "Promotions & Deals",
      notifPromoSub: "Flash Sale, coupons, member perks",
      notifSystem: "System Notifications",
      notifSystemSub: "App updates, policy, security",
      sectionManage: "Manage Account",
      sectionMore: "More",
      allOrders: "All Orders",
      taxInvoiceFull: "Full Tax Invoice",
      returns: "Returns",
      logout: "Log Out",
      settingsLabel: "Settings",
      orderStatusTitle: "Order Status",
      orderShortcutPay: "To Pay",
      orderShortcutDeliver: "To Ship",
      orderShortcutReceive: "To Receive",
      orderShortcutReview: "To Review",
      viewAll: "View All",
      wishlistTitle: "Wishlist",
      wishlistEmpty: "No wishlist items yet",
      editProfile: "Edit Profile",
      guestGreeting: "Hello!",
      guestSubtitle: "Sign in for a better experience",
      guestLoginBtn: "Sign In / Register",
      regionLabel: "Country / Region",
      langLabel: "Language",
      currencyLabel: "Currency",
      ordersTabAll: "All",
      ordersTabPay: "To Pay",
      ordersTabShip: "To Ship",
      ordersTabInTransit: "Shipping",
      ordersTabDone: "Completed",
      ordersTabReturn: "Returns",
      ordersTabCancelled: "Cancelled",
      returnStatusPending: "Under Review",
      returnStatusDone: "Refunded",
      orderExpired: "Expired",
      orderGiftLabel: "Free Gift",
      orderFreeLabel: "Free",
      orderHide: "Hide",
      orderViewAllItems: "View all",
      orderQty: "items",
      orderPieces: "units",
      orderReceived: "Received",
      orderBuyAgain: "Buy Again",
      ordersEmpty: "No orders in this status",
    },
    footer: {
      tagline: "Premium magnetic privacy screen films for laptops.\nEasy Snap magnetic system — attach and remove in seconds.",
      products: "Products",
      services: "Services",
      help: "Help",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      copyright: "Prices and offers are subject to change without notice. © 2026 Ruay Samoe Co., Ltd. (Safescreen) · safescreentech.com · All rights reserved.",
      links: {
        storeFront: "Store Locations",
        corporate: "Corporate Clients",
        howToOrder: "How to Order",
        shipping: "Shipping",
        returns: "Return Policy",
        contactUs: "Contact Us",
        privacy: "Privacy Policy",
      },
    },
    home: {
      magneticTitle: "Easy Snap Magnetic",
      magneticDesc: "Attach and remove instantly — no adhesive residue. Premium magnetic system.",
      expressTitle: "2-Hour Delivery",
      expressDesc: "Express Delivery within Bangkok. Order now, receive within 2 hours.",
      corporateTitle: "Corporate Pricing",
      corporateDesc: "Bulk ordering with tax invoice. Up to 15% discount for organizations.",
      aiTitle: "AI Model Checker",
      aiDesc: "Not sure which film fits your MacBook? Let AI help you pick the right one.",
      topHit: "Top Picks",
      viewTopHit: "View All Top Picks",
      forYou: "For You",
      viewForYou: "View All",
      viewFlash: "View All Flash Sale",
      viewAll: "View All",
      tabNew: "New",
      tabSale: "Sale",
      tabPicks: "Picks",
      storeMapTitle: "Find Us Here",
      storeMapAddress: "The Ninth Tower, Rama 9, Bangkok",
      storeMapNavigate: "Navigate",
      filmPrivacy: "Privacy Screen",
      filmAntiBlue: "Anti-Blue Light",
      filmPaperLike: "Paper Like",
      viewAllProducts: "VIEW ALL PRODUCTS →",
    },
    cookie: {
      title: "We use cookies",
      desc: "We use cookies to improve your experience and analyze website usage.",
      privacyLink: "Privacy Policy",
      decline: "Decline",
      accept: "Accept All",
    },
    pages: {
      promoTitle: "Special Promotions",
      promoViewMore: "View Details",
      expressSubtitle: "Delivery within 2 hours\nin Bangkok Metropolitan",
      expressAvail: "Available 9:00–20:00 daily",
      expressHowTitle: "How to Order Express",
      expressStep1: "Select Product",
      expressStep1Desc: "Choose the film you need",
      expressStep2: "Enter Address",
      expressStep2Desc: "Enter delivery address in Bangkok",
      expressStep3: "Confirm Order",
      expressStep3Desc: "Pay COD or credit card",
      expressStep4: "Receive Item",
      expressStep4Desc: "Within 2 hours",
      expressCoverage: "Service Coverage",
      expressCoverageDesc: "Available across Bangkok and vicinity",
      storeTitle: "SafeScreen Store Locations",
      storeSubtitle: "Find a store near you — try products and get expert advice in person",
      storeViewMap: "View Map",
      storeHours: "daily",
      storeZone1: "Bangkok — City Center", storeAddr1: "MBK Center 4F, Room 4-xxx, Rama 1 Rd, Pathumwan, Bangkok",
      storeZone2: "Bangkok — Ratchathewi", storeAddr2: "Pantip Plaza 3F, Room 3-xxx, Phetchaburi Rd, Ratchathewi, Bangkok",
      storeZone3: "Bangkok — Laksi",       storeAddr3: "IT Square 1F, Laksi, Bangkok",
      storeSvc1Title: "Try Products",       storeSvc1Desc: "Bring your MacBook and try the film at the store",
      storeSvc2Title: "Installation",       storeSvc2Desc: "Professional staff apply the film carefully — no bubbles guaranteed",
      storeSvc3Title: "Exchange & Return",  storeSvc3Desc: "Exchange for a new item within 7 days for manufacturing defects",
      storeContactQ: "Have questions about our store or want to ask before visiting?",
      storeContactA: "Line OA: @safescreenofficial  |  Tel. 096-228-6998",
      corpTitle: "Corporate Clients",
      corpSubtitle: "Special pricing for bulk orders with complete corporate services",
      corpWhyTitle: "Why Choose SafeScreen Corporate?",
      corpBulkTitle: "Bulk Pricing",
      corpBulkDesc: "More you buy, more you save. Up to 10% discount and custom quote for 100+ units",
      corpManagerTitle: "Dedicated Account Manager",
      corpManagerDesc: "Our B2B team manages you directly — fast responses, easy coordination",
      corpInvoiceTitle: "Tax Invoice / Bill",
      corpInvoiceDesc: "Full documentation for corporate accounts, expense-claim ready",
      corpDeliveryTitle: "Office Delivery",
      corpDeliveryDesc: "Free delivery for 20+ units across Bangkok and vicinity",
      corpFormTitle: "Request a Quotation",
      corpFormSubtitle: "Fill in the details below. Our B2B team will follow up within 1 business day.",
      corpFormCompany: "Company Name",
      corpFormCompanyPH: "ABC Co., Ltd.",
      corpFormContact: "Contact Person",
      corpFormContactPH: "John Smith",
      corpFormEmail: "Email",
      corpFormPhone: "Phone Number",
      corpFormDevice: "Device Type",
      corpFormDevicePH: "-- Select type --",
      corpFormQty: "Quantity (units)",
      corpFormQtyPH: "Minimum 5 units",
      corpFormFilm: "Film Type",
      corpFormFilmPH: "-- Select film type --",
      corpFormNotes: "Additional Details",
      corpFormNotesPH: "e.g. MacBook models used in your organization, self-install or staff install, preferred delivery date, etc.",
      corpFormSubmit: "Submit Quotation",
      corpFormPrivacy: "Your information is kept confidential and used only for business contact purposes.",
      corpFormSuccess: "Quotation Submitted!",
      corpFormSuccessDesc: "Our B2B team will contact you within 1 business day.",
      corpFormSuccessEmail: "Email:",
      corpFormResubmit: "Submit Another Quotation",
      corpHeroTag: "For B2B",
      corpStat1Val: "500+", corpStat1Sub: "Corporate Clients",
      corpStat2Val: "Min. 1 unit", corpStat2Sub: "No minimum",
      corpStat3Val: "1 Day", corpStat3Sub: "Response time",
      corpUseCaseTitle: "Who Is It For?",
      corpUC1Badge: "Data Protection", corpUC1Title: "Office & Open Space",
      corpUC1Desc: "Employees work in open areas with people walking by or sitting nearby. Company data and internal emails are at risk of being seen.",
      corpUC1Scenario: "\"HR opens salary files in an open meeting room\"",
      corpUC2Badge: "Financial Compliance", corpUC2Title: "Bank & Financial Institution",
      corpUC2Desc: "Staff access customer account info, credit lines, or investment data under strict regulatory oversight.",
      corpUC2Scenario: "\"Teller views account details while another customer waits\"",
      corpUC3Badge: "Patient Privacy · PDPA", corpUC3Title: "Hospital & Clinic",
      corpUC3Desc: "Doctors and nurses open patient records, test results, and treatment history — all sensitive PDPA data.",
      corpUC3Scenario: "\"Nurse opens patient file while the exam room has others waiting\"",
      corpUC4Badge: "Workspace Privacy", corpUC4Title: "Co-working Space",
      corpUC4Desc: "Renters from multiple companies — each person's data is at risk of being seen by those sitting nearby.",
      corpUC4Scenario: "\"Startup founder opens pitch deck next to a competitor\"",
      corpUC5Badge: "Corporate Fleet", corpUC5Title: "Corporate Office",
      corpUC5Desc: "Mid-to-large organizations need films for Remote/Hybrid Work employees — single bulk purchase for the entire fleet.",
      corpUC5Scenario: "\"IT Admin orders 200 units with tax invoice\"",
      corpUC6Badge: "Education", corpUC6Title: "Educational Institution",
      corpUC6Desc: "Bulk purchase for students, college students, or faculty using laptops in classrooms and libraries.",
      corpUC6Scenario: "\"Student opens exam paper in the library\"",
      corpPricingTag: "Bulk Discount", corpPricingTitle: "Volume Pricing",
      corpPricingColQty: "Order Quantity", corpPricingColDiscount: "Discount", corpPricingColNote: "Note",
      corpTier1Range: "1–9 units", corpTier1Discount: "Regular Price",
      corpTier2Range: "10–49 units", corpTier2Discount: "5% Off", corpTier2Badge: "Popular",
      corpTier3Range: "50–99 units", corpTier3Discount: "10% Off", corpTier3Badge: "Best Value",
      corpTier4Range: "100+ units", corpTier4Discount: "Custom Quote", corpTier4Badge: "Enterprise",
      corpPricingNote: "*Prices depend on product model and quantity. Our team will confirm the final price after receiving your quotation.",
      corpPhoneCTA: "Call our B2B team directly",
      aiSubtitle: "Select device, screen size, and film type — we'll recommend the right product for you",
      aiStepDevice: "Device",
      aiStepSize: "Screen Size",
      aiStepFilm: "Film Type",
      aiSelectDevice: "Select Device Type",
      notifTitle: "Notifications",
      cartTitle: "Shopping Cart",
      cartFree: "Free",
      cartGift: "Free Gift",
      cartBundle: "Bundle & Save!",
      cartBundleSave: "Save extra",
      cartBundleWhen: "when bundled",
      cartAddBundle: "Add to Cart",
      cartSkip: "No thanks",
      cartCoupon: "Enter discount code",
      cartAiCheck: "Not sure if the film fits your device?",
      cartAiCheckCta: "Check",
      cartTotal: "Total",
      cartCheckout: "Checkout",
      plpItems: "items",
      plpSortPriceAsc: "Price: Low → High",
      plpSortPriceDesc: "Price: High → Low",
      plpViewItems: "View",
      notifEmpty: "No notifications",
      notifEmptyDesc: "You have no new notifications right now",
      flashCurrentTab: "Current Round",
      flashEnded: "Ended",
      flashNextTab: "Next Round",
      flashEndsIn: "Ends in",
      flashStartsIn: "Starts in",
      flashNextDesc: "Get ready! The next round is coming with new items and special discounts. Prices will be revealed when the round begins.",
      viewAllPromos: "← View All Promotions",

      storeFindUs: "Find Us Here",
      storeNavigate: "Navigate",
      storeMapSubtitle: "Smoosh Sam Yan, Bangkok",

      aboutPhoneLabel: "Phone",
      aboutAddressLabel: "Company Address",
      aboutBlogTag: "KNOWLEDGE BASE",
      aboutBlogTitle: "Interesting Articles",
      aboutBlogSubtitle: "Knowledge about privacy films, eye care, and screen technology",
      aboutBlogViewAll: "View All Articles",

      reviewsTag: "Customer Reviews",
      reviewsTitle: "What Customers Say About Safescreen",
      reviewsSubtitle: "Real reviews from verified buyers · Shopee Verified",
      reviewsShopeeBtn: "View on Shopee",
      reviewsCount: "10,000+ Reviews",

      expressShipFrom: "Ships from",
      expressShopNow: "Shop Express Now",
      expressPricingTitle: "Express Delivery Rates",
      expressCtaTitle: "Products Ready for Express",
      expressCtaSubtitle: "All privacy film models, ready for express delivery — no long wait",
      expressCtaBtn: "View Express Products",

      aiTitle: "AI Compatibility Checker",
      aiSelectSize: "Select Screen Size",
      aiSelectFilm: "Select Film Type",
      aiBack: "← Back",
      aiFoundTitle: "✅ Compatible! Recommended Product",
      aiFoundDesc: "This product is compatible with your",
      aiAddToCart: "Add to Cart",
      aiAdded: "Added ✓",
      aiViewMore: "View Details",
      aiViewAll: "View All Products",
      aiNotFoundTitle: "No product available for this combination yet",
      aiNotFoundDesc: "Still in development — try another combination or contact our team for more info",
      aiContactTeam: "Contact Team",
      aiReset: "Start Over",
      aiPrivacyDesc: "Blocks side viewing from 30°",
      aiAntiBlueDesc: "Filters blue light, protects eyes",
      aiPaperlikeDesc: "Paper-like feel — great for drawing/writing with Apple Pencil",
      aiComingSoon: "Coming Soon",

      blogTitle: "Blog",
      blogSubtitle: "Knowledge about privacy films, screen care, and related technology",
      blogReadMore: "Read more →",
      blogSubscribeTitle: "Get New Articles First",
      blogSubscribeSubtitle: "Subscribe to our Newsletter for screen care tips and special promotions",
      blogSubscribeBtn: "Subscribe",

      blogBackToList: "Back to Blog",
      blogBackOther: "Other Articles",
      blogCtaTitle: "Not sure which model to choose?",
      blogCtaSubtitle: "Try the AI Compatibility Checker — select your device, screen size, and film type and we'll recommend the right product instantly",
      blogCtaBtn: "Try AI Checker →",
    },
  },
};

export default translations;
