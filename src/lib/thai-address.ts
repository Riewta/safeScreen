import data from "./thai-address-data.json";

type AddressData = Record<string, Record<string, Record<string, string>>>;
const db = data as AddressData;

export function getProvinces(): string[] {
  return Object.keys(db).sort();
}

export function getAmphoes(province: string): string[] {
  return Object.keys(db[province] ?? {}).sort();
}

export function getDistricts(province: string, amphoe: string): string[] {
  return Object.keys(db[province]?.[amphoe] ?? {}).sort();
}

export function getZipcode(province: string, amphoe: string, district: string): string {
  return db[province]?.[amphoe]?.[district] ?? "";
}

export interface LookupResult {
  province: string;
  amphoe: string;
  district: string;
}

export function lookupByZipcode(zipcode: string): LookupResult[] {
  const results: LookupResult[] = [];
  for (const province of Object.keys(db)) {
    const amphoes = db[province] || {};
    for (const amphoe of Object.keys(amphoes)) {
      const districts = amphoes[amphoe] || {};
      for (const district of Object.keys(districts)) {
        if (districts[district] === zipcode) {
          results.push({ province, amphoe, district });
        }
      }
    }
  }
  return results;
}

export function getCountryProvinces(countryCode: string, locale: "TH" | "EN" | "CN" = "TH"): string[] {
  if (countryCode === "TH") {
    return Object.keys(db).sort();
  }
  
  const data: Record<string, { TH: string[]; EN: string[]; CN: string[] }> = {
    US: {
      TH: ["แคลิฟอร์เนีย", "นิวยอร์ก", "เท็กซัส", "ฟลอริดา", "อิลลินอยส์", "เพนซิลเวเนีย", "โอไฮโอ", "จอร์เจีย", "นอร์ทแคโรไลนา", "มิชิแกน", "วอชิงตัน", "แมสซาชูเซตส์", "โคโลราโด", "เนวาดา", "อาริโซนา"],
      EN: ["California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan", "Washington", "Massachusetts", "Colorado", "Nevada", "Arizona"],
      CN: ["加利福尼亚州", "纽约州", "德克萨斯州", "佛罗里达州", "伊利诺伊州", "宾夕法尼亚州", "俄亥俄州", "佐治亚州", "北卡罗来纳州", "密歇根州", "华盛顿州", "马萨诸塞州", "科罗拉多州", "内华达州", "亚利桑那州"]
    },
    SG: {
      TH: ["ภาคกลาง", "ภาคตะวันออก", "ภาคเหนือ", "ภาคตะวันออกเฉียงเหนือ", "ภาคตะวันตก"],
      EN: ["Central Region", "East Region", "North Region", "North-East Region", "West Region"],
      CN: ["中部地区", "东部地区", "北部地区", "东北地区", "西部地区"]
    },
    MY: {
      TH: ["สลังงอร์", "ยะโฮร์", "กัวลาลัมเปอร์", "ปีนัง", "เปรัก", "ปะหัง", "ซาบาห์", "ซาราวัก", "มะละกา", "เนกรีเซมบิลัน", "เกดะห์", "กลันตัน", "ตรังกานู"],
      EN: ["Selangor", "Johor", "Kuala Lumpur", "Penang", "Perak", "Pahang", "Sabah", "Sarawak", "Melaka", "Negeri Sembilan", "Kedah", "Kelantan", "Terengganu"],
      CN: ["雪兰莪", "柔佛", "吉隆坡", "槟城", "霹雳", "彭亨", "沙巴", "砂拉越", "马六甲", "森美兰", "吉打", "吉兰丹", "登嘉楼"]
    },
    CN: {
      TH: ["กวางตุ้ง", "ปักกิ่ง", "เซี่ยงไฮ้", "เจ้อเจียง", "เจียงซู", "เสฉวน", "ฝูเจี้ยน", "หูเป่ย์", "ซานตง", "หูหนาน", "ยูนนาน", "ไห่หนาน"],
      EN: ["Guangdong", "Beijing", "Shanghai", "Zhejiang", "Jiangsu", "Sichuan", "Fujian", "Hubei", "Shandong", "Hunan", "Yunnan", "Hainan"],
      CN: ["广东省", "北京市", "上海市", "浙江省", "江苏省", "四川省", "福建省", "湖北省", "山东省", "湖南省", "云南省", "海南省"]
    },
    VN: {
      TH: ["ฮานอย", "โฮจิมินห์", "ดานัง", "บิ่ญเซือง", "ด่งนาย", "คั้ญฮวา", "ไฮฟอง", "เกิ่นเทอ"],
      EN: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Binh Duong", "Dong Nai", "Khanh Hoa", "Hai Phong", "Can Tho"],
      CN: ["河内", "胡志明市", "岘港", "平阳省", "同奈省", "庆和省", "海防市", "芹苴市"]
    },
    ID: {
      TH: ["จาการ์ตา", "บาหลี", "ชวาตะวันตก", "ชวาตะวันออก", "ชวากลาง", "บันเติน", "สุมาตราเหนือ", "สุลาเวสีใต้"],
      EN: ["Jakarta", "Bali", "West Java", "East Java", "Central Java", "Banten", "North Sumatra", "South Sulawesi"],
      CN: ["雅加达", "巴厘岛", "西爪哇省", "东爪哇省", "中爪哇省", "万丹省", "北苏门答腊省", "南苏拉威西省"]
    },
    PH: {
      TH: ["เมโทรมะนิลา", "เซบู", "ดาเบา", "คาวิเต", "บูลาคัน", "ลากูนา", "ปัมปังกา", "ริซัล"],
      EN: ["Metro Manila", "Cebu", "Davao", "Cavite", "Bulacan", "Laguna", "Pampanga", "Rizal"],
      CN: ["马尼拉大都会", "宿务", "达沃", "甲米地", "布拉干", "拉古纳", "邦板牙", "黎刹"]
    },
    JP: {
      TH: ["โตเกียว", "โอซาก้า", "เกียวโต", "ฮอกไกโด", "คานากาว่า", "ไอจิ", "ฟุกุโอกะ", "โอกินาว่า"],
      EN: ["Tokyo", "Osaka", "Kyoto", "Hokkaido", "Kanagawa", "Aichi", "Fukuoka", "Okinawa"],
      CN: ["东京", "大阪", "京都", "北海道", "神奈川", "爱知", "福冈", "冲绳"]
    },
    KR: {
      TH: ["โซล", "ปูซาน", "คย็องกี", "อินชอน", "เชจู", "แดกู", "กวางจู", "แทจ็อน"],
      EN: ["Seoul", "Busan", "Gyeonggi", "Incheon", "Jeju", "Daegu", "Gwangju", "Daejeon"],
      CN: ["首尔", "釜山", "京畿道", "仁川", "济州岛", "大邱", "光州", "大田"]
    },
    GB: {
      TH: ["อังกฤษ", "สกอตแลนด์", "เวลส์", "ไอร์แลนด์เหนือ", "ลอนดอน"],
      EN: ["England", "Scotland", "Wales", "Northern Ireland", "Greater London"],
      CN: ["英格兰", "苏格兰", "威尔士", "北爱尔兰", "大伦敦"]
    }
  };

  const match = data[countryCode];
  if (!match) return [];
  const list = match[locale] || match.EN;
  return [...list].sort();
}
