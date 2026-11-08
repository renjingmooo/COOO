// 把照片、视频放进 media 文件夹，在下面复制旅行条目并替换文件名。
// kind: together = 一起去过；solo = 自己去过。
window.MEMORIES = [
 {kind:'together',id:'hawaii-2027',title:'',place:'🇺🇸 夏威夷',date:'2027-01-06',dateEnd:'2027-01-11',planned:true,cover:'media/trip-placeholder.svg',story:'行程已标记，照片和视频可以之后添加。',media:[]},
 {kind:'together',id:'orlando-2027',title:'',place:'🇺🇸 奥兰多',date:'2027-01-02',dateEnd:'2027-01-06',planned:true,cover:'media/trip-placeholder.svg',story:'行程已标记，照片和视频可以之后添加。',media:[]},
 {kind:'together',id:'washington-2026',title:'',place:'🇺🇸 华盛顿',date:'2026-12-30',dateEnd:'2027-01-02',planned:true,cover:'media/trip-placeholder.svg',story:'行程已标记，照片和视频可以之后添加。',media:[]},
 {kind:'together',id:'philadelphia-2026',title:'',place:'🇺🇸 费城',date:'2026-12-29',dateEnd:'2026-12-30',planned:true,cover:'media/trip-placeholder.svg',story:'行程已标记，照片和视频可以之后添加。',media:[]},
 {kind:'together',id:'new-york-2026',title:'',place:'🇺🇸 纽约',date:'2026-10-26',dateEnd:'2026-10-29',planned:true,cover:'media/trip-placeholder.svg',story:'行程已标记，照片和视频可以之后添加。',media:[]},
 {kind:'together',id:'boston-2026',title:'',place:'🇺🇸 波士顿',date:'2026-10-24',dateEnd:'2026-10-26',planned:true,cover:'media/trip-placeholder.svg',story:'行程已标记，照片和视频可以之后添加。',media:[]},
 {kind:'together',category:'daily',id:'beijing-26-summer',title:'26夏',place:'🇨🇳 北京/沈阳',date:'2026-07-01',hideDate:true,cover:'media/COOO/2026Summer/4.jpg',story:'',media:[
  {type:'image',src:'media/COOO/2026Summer/1.jpeg'},
  {type:'image',src:'media/COOO/2026Summer/2.jpeg'},
  {type:'image',src:'media/COOO/2026Summer/3.jpeg'},
  {type:'image',src:'media/COOO/2026Summer/4.jpg'},
  {type:'image',src:'media/COOO/2026Summer/5.jpeg'}
 ]},
 {kind:'solo',id:'sydney-solo',title:'',place:'🇦🇺 悉尼',hideDate:true,cover:'media/CO/悉尼/R0001130.JPG',story:'',media:[
  {type:'image',src:'media/CO/悉尼/4388fc773e4fb833299345ca32661981.jpg'},
  {type:'image',src:'media/CO/悉尼/R0000434.JPG'},
  {type:'image',src:'media/CO/悉尼/R0001130.JPG'},
  {type:'image',src:'media/CO/悉尼/R0001134.JPG'},
  {type:'image',src:'media/CO/悉尼/R0001135.JPG'},
  {type:'image',src:'media/CO/悉尼/c64053fad9d48555bd7afa2b65fe229c.jpg'},
  {type:'image',src:'media/CO/悉尼/f9b9e602cb25ad80903ea27056a0249d.jpg'}
 ]},
 {kind:'solo',id:'kiama-solo',title:'',place:'🇦🇺 Kiama',hideDate:true,cover:'media/CO/Kiama/R0000697.JPG',story:'',media:[
  {type:'image',src:'media/CO/Kiama/IMG_4771.JPG'},
  {type:'image',src:'media/CO/Kiama/R0000692.JPG'},
  {type:'image',src:'media/CO/Kiama/R0000696.JPG'},
  {type:'image',src:'media/CO/Kiama/R0000697.JPG'}
 ]},
 {kind:'solo',id:'hong-kong-singapore-solo',title:'',place:'🇭🇰 香港 / 🇸🇬 新加坡',hideDate:true,cover:'media/CO/港新/R0001084.JPG',story:'',media:[
  {type:'image',src:'media/CO/港新/R0001040.JPG'},
  {type:'image',src:'media/CO/港新/R0001064.JPG'},
  {type:'image',src:'media/CO/港新/R0001075.JPG'},
  {type:'image',src:'media/CO/港新/R0001077.JPG'},
  {type:'image',src:'media/CO/港新/R0001084.JPG'},
  {type:'image',src:'media/CO/港新/R0001090.JPG'}
 ]},
 {kind:'solo',id:'taiwan-solo',title:'',place:'🇹🇼 台湾',hideDate:true,cover:'media/CO/台湾/IMG_2182.jpeg',story:'',media:[
  {type:'image',src:'media/CO/台湾/IMG_1831.jpeg'},
  {type:'image',src:'media/CO/台湾/IMG_2172.jpeg'},
  {type:'image',src:'media/CO/台湾/IMG_2182.jpeg'},
  {type:'image',src:'media/CO/台湾/IMG_2252.jpeg'},
  {type:'image',src:'media/CO/台湾/IMG_2254.jpeg'},
  {type:'image',src:'media/CO/台湾/IMG_2460.jpeg'}
 ]},
 {kind:'solo',id:'melbourne-solo',title:'',place:'🇦🇺 墨尔本',hideDate:true,cover:'media/CO/墨尔本/R0000344.JPG',story:'',media:[
  {type:'image',src:'media/CO/墨尔本/R0000102.JPG'},
  {type:'image',src:'media/CO/墨尔本/R0000218.JPG'},
  {type:'image',src:'media/CO/墨尔本/R0000294.JPG'},
  {type:'image',src:'media/CO/墨尔本/R0000298.JPG'},
  {type:'image',src:'media/CO/墨尔本/R0000344.JPG'},
  {type:'image',src:'media/CO/墨尔本/R0000380.JPG'},
  {type:'image',src:'media/CO/墨尔本/R0000950.JPG'},
  {type:'image',src:'media/CO/墨尔本/R0000983.JPG'}
 ]}
];

// Footprint 地图地点：[经度, 纬度]。城市以中心位置标记；山梨县以甲府附近作代表点。
window.MAP_PLACES = [
 {name:'莫斯科',coordinates:[37.6173,55.7558]},
 {name:'圣彼得堡',coordinates:[30.3351,59.9343]},
 {name:'芝加哥',coordinates:[-87.6298,41.8781]},
 {name:'悉尼',coordinates:[151.2093,-33.8688]},
 {name:'Newcastle（NSW）',type:'solo',coordinates:[151.7817,-32.9283]},
 {name:'Kiama（NSW）',type:'solo',coordinates:[150.8552,-34.6683]},
 {name:'Wollongong（NSW）',type:'solo',coordinates:[150.8931,-34.4278]},
 {name:'Goulburn（NSW）',type:'solo',coordinates:[149.7206,-34.7558]},
 {name:'Wagga Wagga（NSW）',type:'solo',coordinates:[147.3689,-35.1189]},
 {name:'Hay（NSW）',type:'solo',coordinates:[144.85,-34.5]},
 {name:'Balranald（NSW）',type:'solo',coordinates:[143.5657,-34.6464]},
 {name:'Mungo National Park（NSW）',type:'solo',coordinates:[143.0266,-33.7232]},
 {name:'Wentworth（NSW）',type:'solo',coordinates:[141.9132,-34.1073]},
 {name:'Mildura（VIC）',type:'solo',coordinates:[142.1583,-34.1889]},
 {name:'Broken Hill（NSW）',type:'solo',coordinates:[141.4667,-31.95]},
 {name:'Silverton（NSW）',type:'solo',coordinates:[141.233,-31.867]},
 {name:'Wilcannia（NSW）',type:'solo',coordinates:[143.3792,-31.5569]},
 {name:'White Cliffs（NSW）',type:'solo',coordinates:[143.083,-30.833]},
 {name:'Cobar（NSW）',type:'solo',coordinates:[145.8319,-31.4997]},
 {name:'Nyngan（NSW）',type:'solo',coordinates:[147.2,-31.5667]},
 {name:'Dubbo（NSW）',type:'solo',coordinates:[148.6048,-32.243]},
 {name:'Bathurst（NSW）',type:'solo',coordinates:[149.5806,-33.4167]},
 {name:'Bilpin（NSW）',type:'solo',coordinates:[150.522,-33.4982]},
 {name:'墨尔本',coordinates:[144.9631,-37.8136]},
 {name:'堪培拉',coordinates:[149.1300,-35.2809]},
 {name:'东京',coordinates:[139.6917,35.6895]},
 {name:'山梨县',coordinates:[138.5684,35.6639]},
 {name:'京都',coordinates:[135.7681,35.0116]},
 {name:'大阪',coordinates:[135.5023,34.6937]},
 {name:'柏林',coordinates:[13.4050,52.5200]},
 {name:'汉堡',coordinates:[9.9937,53.5511]},
 {name:'阿姆斯特丹',coordinates:[4.9041,52.3676]},
 {name:'鹿特丹',coordinates:[4.4777,51.9244]},
 {name:'巴黎',coordinates:[2.3522,48.8566]},
 {name:'香港',coordinates:[114.1694,22.3193]},
 {name:'台北',coordinates:[121.5654,25.0330]},
 {name:'花莲',coordinates:[121.6015,23.9872]},
 {name:'台南',coordinates:[120.2270,22.9999]},
 {name:'高雄',coordinates:[120.3014,22.6273]},
 {name:'北京',type:'together',coordinates:[116.4074,39.9042]},
 {name:'上海',coordinates:[121.4737,31.2304]},
 {name:'沈阳',type:'together',coordinates:[123.4315,41.8057]},
 {name:'大连',coordinates:[121.6147,38.9140]},
 {name:'广州',coordinates:[113.2644,23.1291]},
 {name:'深圳',coordinates:[114.0579,22.5431]},
 {name:'温州',coordinates:[120.6994,27.9943]},
 {name:'新加坡',coordinates:[103.8198,1.3521]},
 {name:'海口',coordinates:[110.3312,20.0311]},
 {name:'成都',coordinates:[104.0665,30.5723]}
];
