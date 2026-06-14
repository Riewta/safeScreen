export type LangCode = "TH" | "EN";

export interface Translations {
  _lang: LangCode;
  nav: { home: string; shop: string; cart: string; me: string };
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
  product: { addToCart: string; buyNow: string; outOfStock: string; viewAll: string; reviews: string };
  common: { save: string; cancel: string; confirm: string; back: string; loading: string; search: string; close: string; confirmSelection: string };
  account: {
    notifSettings: string; notifOrder: string; notifOrderSub: string;
    notifPromo: string; notifPromoSub: string; notifSystem: string; notifSystemSub: string;
  };
  footer: {
    tagline: string;
    products: string; services: string; help: string;
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
  };
}

const translations: Record<LangCode, Translations> = {
  TH: {
    _lang: "TH",
    nav: { home: "หน้าแรก", shop: "Shop", cart: "Cart", me: "Me" },
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
        "MacBook Bundle ซื้อ 2 ชิ้นลด 15% — ช้อปเลย!",
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
    product: { addToCart: "เพิ่มใส่ตะกร้า", buyNow: "ซื้อเลย", outOfStock: "สินค้าหมด", viewAll: "ดูทั้งหมด", reviews: "รีวิว" },
    common: { save: "บันทึก", cancel: "ยกเลิก", confirm: "ยืนยัน", back: "ย้อนกลับ", loading: "กำลังโหลด...", search: "ค้นหา", close: "ปิด", confirmSelection: "ยืนยัน" },
    account: {
      notifSettings: "ตั้งค่าการแจ้งเตือน",
      notifOrder: "อัพเดทคำสั่งซื้อ",
      notifOrderSub: "การยืนยัน, การจัดส่ง, การจัดส่งสำเร็จ",
      notifPromo: "โปรโมชั่น & ดีล",
      notifPromoSub: "Flash Sale, คูปอง, สิทธิพิเศษสมาชิก",
      notifSystem: "การแจ้งเตือนระบบ",
      notifSystemSub: "อัพเดทแอป, นโยบาย, ความปลอดภัย",
    },
    footer: {
      tagline: "ฟิล์มกันเสือกสำหรับแล็ปท็อปคุณภาพสูง\nระบบแม่เหล็ก Easy Snap ติดง่าย ถอดง่าย",
      products: "ผลิตภัณฑ์",
      services: "บริการ",
      help: "ช่วยเหลือ",
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
      storeSubtitle: "ค้นหาสาขาใกล้คุณ — สามารถเข้าไปทดลองสินค้าและรับคำแนะนำจากผู้เชี่ยวชาญได้โดยตรง",
      storeViewMap: "ดูแผนที่",
      storeHours: "น. ทุกวัน",
      storeZone1: "กรุงเทพฯ — ใจกลางเมือง", storeAddr1: "MBK Center ชั้น 4 ห้อง 4-xxx ถ.พระราม 1 ปทุมวัน กรุงเทพฯ",
      storeZone2: "กรุงเทพฯ — ราชเทวี",     storeAddr2: "Pantip Plaza ชั้น 3 ห้อง 3-xxx ถ.เพชรบุรี ราชเทวี กรุงเทพฯ",
      storeZone3: "กรุงเทพฯ — หลักสี่",     storeAddr3: "IT Square ชั้น 1 หลักสี่ กรุงเทพฯ",
      storeSvc1Title: "ทดสอบสินค้า",     storeSvc1Desc: "นำ MacBook มาทดลองติดฟิล์มได้เลยที่หน้าร้าน",
      storeSvc2Title: "บริการติดตั้ง",   storeSvc2Desc: "ทีมงานมืออาชีพช่วยติดฟิล์มให้อย่างระวัง ไม่มีฟองอากาศ",
      storeSvc3Title: "รับเปลี่ยนคืน",  storeSvc3Desc: "รับเปลี่ยนสินค้าใหม่ภายใน 7 วัน หากมีปัญหาจากการผลิต",
      storeContactQ: "มีคำถามเกี่ยวกับหน้าร้าน หรือต้องการสอบถามก่อนมา?",
      storeContactA: "Line OA: @safescreenofficial  |  โทร 02-xxx-xxxx",
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
      corpFormDevicePH: "-- เลือกประเภท --",
      corpFormQty: "จำนวน (ชิ้น)",
      corpFormQtyPH: "ขั้นต่ำ 5 ชิ้น",
      corpFormFilm: "ประเภทฟิล์ม",
      corpFormFilmPH: "-- เลือกประเภทฟิล์ม --",
      corpFormNotes: "รายละเอียดเพิ่มเติม",
      corpFormNotesPH: "เช่น รุ่นของ MacBook ที่ใช้ในองค์กร, ต้องการติดตั้งเองหรือให้ทีมงานติดตั้ง, วันที่ต้องการรับสินค้า ฯลฯ",
      corpFormSubmit: "ส่งใบเสนอราคา",
      corpFormPrivacy: "ข้อมูลของคุณจะถูกเก็บเป็นความลับ ใช้เพื่อการติดต่อทางธุรกิจเท่านั้น",
      corpFormSuccess: "ส่งใบเสนอราคาเรียบร้อยแล้ว!",
      corpFormSuccessDesc: "ทีม B2B ของเราจะติดต่อกลับภายใน 1 วันทำการ",
      corpFormSuccessEmail: "อีเมล:",
      corpFormResubmit: "ส่งใบเสนอราคาใหม่",
      aiSubtitle: "เลือกอุปกรณ์ ขนาดหน้าจอ และประเภทฟิล์ม — เราจะแนะนำสินค้าที่เหมาะสมให้คุณ",
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
    },
  },

  EN: {
    _lang: "EN",
    nav: { home: "Home", shop: "Shop", cart: "Cart", me: "Me" },
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
    product: { addToCart: "Add to Cart", buyNow: "Buy Now", outOfStock: "Out of Stock", viewAll: "View All", reviews: "Reviews" },
    common: { save: "Save", cancel: "Cancel", confirm: "Confirm", back: "Back", loading: "Loading...", search: "Search", close: "Close", confirmSelection: "Confirm" },
    account: {
      notifSettings: "Notification Settings",
      notifOrder: "Order Updates",
      notifOrderSub: "Confirmation, shipping, delivered",
      notifPromo: "Promotions & Deals",
      notifPromoSub: "Flash Sale, coupons, member perks",
      notifSystem: "System Notifications",
      notifSystemSub: "App updates, policy, security",
    },
    footer: {
      tagline: "Premium magnetic privacy screen films for laptops.\nEasy Snap magnetic system — attach and remove in seconds.",
      products: "Products",
      services: "Services",
      help: "Help",
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
      storeContactA: "Line OA: @safescreenofficial  |  Tel. 02-xxx-xxxx",
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
    },
  },
};

export default translations;
