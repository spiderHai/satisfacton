import dayjs, { Dayjs } from "dayjs";

// 部门选项数据
export const departmentOptions = [
  {
    title: "车载镜头",
    value: "car-lens",
    children: [
      { title: "车载镜头-南昌", value: "car-lens-nanchang" },
      { title: "车载镜头-合肥", value: "car-lens-hefei" },
      { title: "车载镜头-越南", value: "car-lens-vietnam" },
    ],
  },
  {
    title: "车载模组",
    value: "car-module",
    children: [{ title: "车载模组-合肥", value: "car-module-hefei" }],
  },
  {
    title: "CA003",
    value: "ca003",
    children: [
      { title: "CA003-南昌", value: "ca003-nanchang" },
      { title: "CA003-墨西哥", value: "ca003-mexico" },
    ],
  },
  {
    title: "手机镜头",
    value: "mobile-lens",
    children: [{ title: "手机镜头", value: "mobile-lens-main" }],
  },
  {
    title: "手机模组",
    value: "mobile-module",
    children: [{ title: "手机模组", value: "mobile-module-main" }],
  },
  { title: "抚州恒泰", value: "fuzhou-hengtai" },
  {
    title: "高清广角镜头",
    value: "hd-wide-lens",
    children: [{ title: "高清广角镜头", value: "hd-wide-lens-main" }],
  },
  {
    title: "高清广角模组",
    value: "hd-wide-module",
    children: [{ title: "高清广角模组", value: "hd-wide-module-main" }],
  },
  {
    title: "玻璃镜片",
    value: "glass-lens",
    children: [{ title: "玻璃镜片-南昌", value: "glass-lens-nanchang" }],
  },
  {
    title: "精密元件",
    value: "precision-parts",
    children: [{ title: "精密元件-南昌", value: "precision-parts-nanchang" }],
  },
];

// 客户选项数据
export const customerOptions = [
  { label: "阿里巴巴", value: "alibaba" },
  { label: "腾讯", value: "tencent" },
  { label: "百度", value: "baidu" },
  { label: "京东", value: "jd" },
  { label: "华为", value: "huawei" },
  { label: "小米", value: "xiaomi" },
];

// 模拟投诉数据
export const complaintData = [
  {
    key: "1",
    no: 1,
    owner: "张三",
    complaintId: "CP20231001",
    customer: "阿里巴巴",
    productModel: "aa",
    deliveryDate: "2023-10-01",
    importantOccur: "是",
    defectRate: "5%",
    complaintLevel: "A级",
    levelFrequency: 10,
    defectDesc: "镜头模糊",
    rootCause: "装配不良",
    countermeasure: "返工",
    responsibility: "质检部",
    status: "已解决",
    closeDate: "2023-10-05",
  },
  {
    key: "2",
    no: 2,
    owner: "李四",
    complaintId: "CP20231005",
    customer: "腾讯",
    productModel: "bb",
    deliveryDate: "2023-10-05",
    importantOccur: "否",
    defectRate: "10%",
    complaintLevel: "B级",
    levelFrequency: 5,
    defectDesc: "镜头失焦",
    rootCause: "镜头组件问题",
    countermeasure: "更换镜头",
    responsibility: "研发部",
    status: "处理中",
    closeDate: "",
  },
  {
    key: "3",
    no: 3,
    owner: "王五",
    complaintId: "CP20231010",
    customer: "百度",
    productModel: "cc",
    deliveryDate: "2023-10-10",
    importantOccur: "是",
    defectRate: "15%",
    complaintLevel: "C级",
    levelFrequency: 2,
    defectDesc: "镜头漏光",
    rootCause: "材料问题",
    countermeasure: "更换材料",
    responsibility: "采购部",
    status: "已解决",
    closeDate: "2023-10-15",
  },
  {
    key: "4",
    no: 4,
    owner: "赵六",
    complaintId: "CP20231015",
    customer: "京东",
    productModel: "dd",
    deliveryDate: "2023-10-15",
    importantOccur: "否",
    defectRate: "20%",
    complaintLevel: "D级",
    levelFrequency: 1,
    defectDesc: "模组松动",
    rootCause: "装配不良",
    countermeasure: "返修",
    responsibility: "生产部",
    status: "已关闭",
    closeDate: "2023-10-20",
  },
  {
    key: "5",
    no: 5,
    owner: "孙七",
    complaintId: "CP20231020",
    customer: "华为",
    productModel: "ee",
    deliveryDate: "2023-10-20",
    importantOccur: "是",
    defectRate: "25%",
    complaintLevel: "E级",
    levelFrequency: 1,
    defectDesc: "产品过热",
    rootCause: "设计缺陷",
    countermeasure: "优化设计",
    responsibility: "工程部",
    status: "待处理",
    closeDate: "",
  },
  // 额外测试数据
  {
    key: "6",
    no: 6,
    owner: "周八",
    complaintId: "CP20231025",
    customer: "小米",
    productModel: "ff",
    deliveryDate: "2023-10-25",
    importantOccur: "是",
    defectRate: "8%",
    complaintLevel: "B级",
    levelFrequency: 3,
    defectDesc: "镜头划伤",
    rootCause: "包装问题",
    countermeasure: "改进包装",
    responsibility: "物流部",
    status: "已解决",
    closeDate: "2023-10-30",
  },
  {
    key: "7",
    no: 7,
    owner: "吴九",
    complaintId: "CP20231101",
    customer: "阿里巴巴",
    productModel: "gg",
    deliveryDate: "2023-11-01",
    importantOccur: "否",
    defectRate: "12%",
    complaintLevel: "C级",
    levelFrequency: 2,
    defectDesc: "模组异响",
    rootCause: "内部松动",
    countermeasure: "调整固定螺丝",
    responsibility: "工程部",
    status: "处理中",
    closeDate: "",
  },
];

// 部门客户满意度模拟数据
const deptCustomerSatisfactionData = {
  "car-lens": {
    customerScores: {
      阿里巴巴: { score: 92 },
      腾讯: { score: 88 },
      百度: { score: 85 },
      华为: { score: 91 },
    },
  },
  "car-lens-nanchang": {
    customerScores: {
      阿里巴巴: { score: 93 },
      腾讯: { score: 86 },
      华为: { score: 89 },
    },
  },
  "car-lens-hefei": {
    customerScores: {
      腾讯: { score: 89 },
      百度: { score: 82 },
      京东: { score: 85 },
    },
  },
  "car-lens-vietnam": {
    customerScores: {
      阿里巴巴: { score: 91 },
      百度: { score: 88 },
      小米: { score: 93 },
    },
  },
  "car-module": {
    customerScores: {
      阿里巴巴: { score: 87 },
      腾讯: { score: 91 },
      华为: { score: 88 },
      小米: { score: 85 },
    },
  },
  "car-module-hefei": {
    customerScores: {
      京东: { score: 84 },
      华为: { score: 87 },
      小米: { score: 91 },
    },
  },
  ca003: {
    customerScores: {
      阿里巴巴: { score: 89 },
      百度: { score: 85 },
      华为: { score: 93 },
    },
  },
  "ca003-nanchang": {
    customerScores: {
      阿里巴巴: { score: 86 },
      腾讯: { score: 82 },
      华为: { score: 89 },
    },
  },
  "ca003-mexico": {
    customerScores: {
      腾讯: { score: 87 },
      百度: { score: 91 },
      京东: { score: 83 },
    },
  },
  "mobile-lens": {
    customerScores: {
      阿里巴巴: { score: 93 },
      腾讯: { score: 87 },
      百度: { score: 90 },
      华为: { score: 95 },
      小米: { score: 91 },
    },
  },
  "mobile-lens-main": {
    customerScores: {
      阿里巴巴: { score: 92 },
      腾讯: { score: 89 },
      华为: { score: 94 },
      小米: { score: 90 },
    },
  },
  "mobile-module": {
    customerScores: {
      阿里巴巴: { score: 89 },
      腾讯: { score: 85 },
      京东: { score: 87 },
      华为: { score: 92 },
      小米: { score: 88 },
    },
  },
  "mobile-module-main": {
    customerScores: {
      腾讯: { score: 86 },
      华为: { score: 93 },
      小米: { score: 90 },
    },
  },
  "fuzhou-hengtai": {
    customerScores: {
      阿里巴巴: { score: 84 },
      百度: { score: 81 },
      京东: { score: 78 },
    },
  },
  "hd-wide-lens": {
    customerScores: {
      阿里巴巴: { score: 90 },
      腾讯: { score: 88 },
      百度: { score: 85 },
      华为: { score: 92 },
    },
  },
  "hd-wide-lens-main": {
    customerScores: {
      阿里巴巴: { score: 91 },
      腾讯: { score: 86 },
      华为: { score: 93 },
    },
  },
  "hd-wide-module": {
    customerScores: {
      腾讯: { score: 87 },
      百度: { score: 85 },
      华为: { score: 89 },
      小米: { score: 86 },
    },
  },
  "hd-wide-module-main": {
    customerScores: {
      百度: { score: 83 },
      华为: { score: 90 },
      小米: { score: 87 },
    },
  },
  "glass-lens": {
    customerScores: {
      阿里巴巴: { score: 88 },
      腾讯: { score: 85 },
      百度: { score: 82 },
    },
  },
  "glass-lens-nanchang": {
    customerScores: {
      阿里巴巴: { score: 87 },
      腾讯: { score: 84 },
      百度: { score: 81 },
    },
  },
  "precision-parts": {
    customerScores: {
      阿里巴巴: { score: 89 },
      京东: { score: 85 },
      华为: { score: 91 },
    },
  },
  "precision-parts-nanchang": {
    customerScores: {
      阿里巴巴: { score: 88 },
      京东: { score: 84 },
      华为: { score: 90 },
    },
  },
};

// 获取部门客户满意度数据
export function getDeptCustomerSatisfactionData(deptId: string) {
  return (
    deptCustomerSatisfactionData[deptId] || {
      customerScores: {
        阿里巴巴: { score: 85 },
        腾讯: { score: 82 },
        百度: { score: 80 },
      },
    }
  );
}

// 获取退货数据
export const getReturnData = (dateRange: [Dayjs, Dayjs]) => {
  // 生成日期范围内的所有月份
  const dates = [];
  const currentDate = dayjs(dateRange[0]);
  const endDate = dayjs(dateRange[1]);

  while (
    currentDate.isBefore(endDate) ||
    currentDate.isSame(endDate, "month")
  ) {
    dates.push(currentDate.format("YYYY-MM"));
    currentDate.add(1, "month");
  }

  // 部门列表
  const departments = ["销售部", "技术部", "客服部", "财务部"];

  // 为每个部门生成随机退货数据
  const data = departments.map(() => {
    return dates.map(() => Math.floor(Math.random() * 50) + 10); // 10-60 的随机数
  });

  return { dates, departments, data };
};

// 为特定部门的月度退货数据
export const getDepartmentReturnsByMonth = (
  department: string,
  month: string
) => {
  // 随机生成数据
  return Math.floor(Math.random() * 50) + 10;
};

// 月度总退货数据
export const getTotalReturnsByMonth = (month: string) => {
  const departments = ["销售部", "技术部", "客服部", "财务部"];
  return departments.reduce(
    (total, dept) => total + getDepartmentReturnsByMonth(dept, month),
    0
  );
};

// 最近几个月的总退货数据趋势
export const getReturnsMonthlyTrend = (months: number = 6) => {
  const data = [];
  const currentMonth = dayjs();

  for (let i = months - 1; i >= 0; i--) {
    const month = currentMonth.subtract(i, "month").format("YYYY-MM");
    data.push({
      month,
      returns: getTotalReturnsByMonth(month),
    });
  }

  return data;
};
