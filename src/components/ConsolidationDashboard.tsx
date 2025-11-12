import { motion } from "framer-motion";
import {
  Bell,
  Package,
  CreditCard,
  Truck,
  Search,
  MapPin,
  Calendar,
  MessageSquare,
  Gift,
  BadgeDollarSign,
  UploadCloud,
  Boxes,
  History,
  Settings,
  HelpCircle,
  CheckCircle2,
  ScanSearch
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme, themes } from "@/contexts/ThemeContext";

// 假資料
const shipments = [
  { id: "ZX202511-001", origin: "淘寶-廣州倉", items: 5, weight: 3.4, status: "待入庫", eta: "--" },
  { id: "ZX202511-002", origin: "天貓-杭州倉", items: 2, weight: 1.1, status: "已入庫", eta: "11/14" },
  { id: "ZX202511-003", origin: "拼多多-東莞倉", items: 1, weight: 0.7, status: "待合箱", eta: "--" },
];

const orders = [
  { id: "ORD-88921", channel: "集運空運", amount: 486, created: "11/06", status: "待付款" },
  { id: "ORD-88904", channel: "海運普貨", amount: 812, created: "11/01", status: "已出貨" },
];

const trend = [
  { name: "7/20", qty: 2 },
  { name: "7/27", qty: 3 },
  { name: "8/03", qty: 4 },
  { name: "8/10", qty: 6 },
  { name: "8/17", qty: 3 },
  { name: "8/24", qty: 7 },
  { name: "8/31", qty: 5 },
];

const QuickAction = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <Button variant="outline" className="w-full justify-start gap-2">
    <Icon className="h-4 w-4" />
    {label}
  </Button>
);

export default function ConsolidationDashboard() {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  
  return (
    <div className="min-h-[100vh] bg-gradient-to-b from-slate-50 to-white">
      {/* 頂部導航 */}
      <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Boxes className="h-6 w-6" />
            <div className="font-semibold">ELF EXPRESS 集運中心</div>
            <div className="ml-auto flex w-full max-w-xl items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="搜尋：運單號 / 訂單 / 入庫編號" />
              </div>
              <Button variant="outline" className="gap-2"><ScanSearch className="h-4 w-4"/>快速查件</Button>
              <ThemeSwitcher />
              <Button variant="ghost" size="icon"><Bell className="h-5 w-5"/></Button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6">
        {/* 公告條 */}
        <motion.div initial={{opacity:0, y: -6}} animate={{opacity:1, y:0}}>
          <Card className="mb-6 border-dashed">
            <CardContent className="flex flex-wrap items-center gap-3 p-4">
              <Badge variant="secondary" className="gap-1"><Gift className="h-3.5 w-3.5"/>活動</Badge>
              <div className="text-sm text-muted-foreground">雙11優惠：充值滿 NT$3,000 送 5% 運費折抵券，空運加班航班上線,效 3-5 天。</div>
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline">了解詳情</Button>
                <Button size="sm">立即充值</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* 左側主資訊 */}
          <div className="md:col-span-8 space-y-6">
            {/* 概覽卡片 */}
            <motion.div initial={{opacity:0, y: 6}} animate={{opacity:1, y:0}}>
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">帳戶概覽</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <OverviewItem icon={Package} title="未入庫" value={5} tip="等待賣家發貨"/>
                  <OverviewItem icon={Truck} title="已到站" value={8} tip="已到達集運倉"/>
                  <OverviewItem icon={UploadCloud} title="待申報" value={3} tip="需完成申報"/>
                  <OverviewItem icon={BadgeDollarSign} title="集貨幣帳戶餘額" value={1250} prefix="NT$"/>
                </CardContent>
              </Card>
            </motion.div>

            {/* 客服中心與快捷 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">客服中心</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border p-3">
                    <HelpCircle className="mt-0.5 h-4 w-4"/>
                    <div className="text-sm text-muted-foreground">常見問題：計費方式、材積計算、禁運品清單、關稅說明</div>
                  </div>
                  <Button className="w-full gap-2"><MessageSquare className="h-4 w-4"/> 線上客服</Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="gap-2">
                      <Package className="h-4 w-4"/>
                      包裹查詢
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Settings className="h-4 w-4"/>
                      服務設定
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">快捷功能</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <QuickAction icon={UploadCloud} label="一鍵申報"/>
                  <QuickAction icon={Truck} label="安排出貨"/>
                  <QuickAction icon={CreditCard} label="充值/付款"/>
                  <QuickAction icon={History} label="歷史訂單"/>
                  <QuickAction icon={MapPin} label="收件地址"/>
                  <QuickAction icon={Settings} label="偏好設定"/>
                </CardContent>
              </Card>
            </div>

            {/* 清單區塊 */}
            <Tabs defaultValue="inbound" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="inbound">我的入庫</TabsTrigger>
                  <TabsTrigger value="orders">我的訂單</TabsTrigger>
                  <TabsTrigger value="notice">通知訊息</TabsTrigger>
                </TabsList>
                <Button variant="outline" className="gap-2"><MapPin className="h-4 w-4"/>新增收件地址</Button>
              </div>
              <TabsContent value="inbound" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>入庫單號</TableHead>
                          <TableHead>來源倉/平台</TableHead>
                          <TableHead className="text-center">件數</TableHead>
                          <TableHead className="text-center">重量(kg)</TableHead>
                          <TableHead>狀態</TableHead>
                          <TableHead><div className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/>預計</div></TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shipments.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.id}</TableCell>
                            <TableCell>{s.origin}</TableCell>
                            <TableCell className="text-center">{s.items}</TableCell>
                            <TableCell className="text-center">{s.weight}</TableCell>
                            <TableCell>
                              <Badge variant={s.status === "已入庫" ? "secondary" : "outline"}>{s.status}</Badge>
                            </TableCell>
                            <TableCell>{s.eta}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button size="sm" variant="outline">申報</Button>
                              <Button size="sm">查看詳情</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>訂單編號</TableHead>
                          <TableHead>服務</TableHead>
                          <TableHead>金額 (NT$)</TableHead>
                          <TableHead>建立時間</TableHead>
                          <TableHead>狀態</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((o) => (
                          <TableRow key={o.id}>
                            <TableCell className="font-medium">{o.id}</TableCell>
                            <TableCell>{o.channel}</TableCell>
                            <TableCell>{o.amount}</TableCell>
                            <TableCell>{o.created}</TableCell>
                            <TableCell>
                              <Badge variant={o.status === "已出貨" ? "secondary" : "outline"}>{o.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button size="sm" variant="outline">明細</Button>
                              <Button size="sm">付款</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notice" className="mt-4">
                <Card>
                  <CardContent className="space-y-3 p-4">
                    <NoticeItem title="入庫完成" content="ZX202511-002 已入庫至 杭州倉架位 A7-12" time="5 分鐘前"/>
                    <NoticeItem title="包裹異常提醒" content="ZX202511-003 外箱輕微變形，請確認是否申請加固" time="22 分鐘前" type="warning"/>
                    <NoticeItem title="付款成功" content="ORD-88904 NT$ 812 已支付成功" time="昨天 14:21" type="success"/>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 右側側欄 */}
          <div className="md:col-span-4 space-y-6">
            {/* 使用者卡 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-r ${currentTheme.primary} p-4 text-white transition-all duration-300`}>
                  <div className="text-sm opacity-90">歡迎回來，王南傑</div>
                  <div className="text-lg font-semibold">會員等級：白金</div>
                  <div className="mt-2 flex gap-2 text-xs opacity-90">
                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">免手續費券 x2</Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">運費 95 折</Badge>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">當月出貨量</span>
                    <span>23 件</span>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="qty" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="currentColor" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="currentColor" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ fontSize: 12 }} />
                        <Area type="monotone" dataKey="qty" stroke="currentColor" fill="url(#qty)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    <Button variant="outline" className="gap-2"><BadgeDollarSign className="h-4 w-4"/>查看帳單</Button>
                    <Button className="gap-2"><CreditCard className="h-4 w-4"/>一鍵充值</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 收件地址 */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">我的收件地址</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <AddressItem name="台北-內湖自取點" detail="台北市內湖區瑞光路 123 號 1 樓" defaultTag />
                <AddressItem name="高雄-宅配地址" detail="高雄市鼓山區美術東二路 88 號 12 樓" />
                <div className="pt-1"><Button variant="outline" className="w-full">管理/新增地址</Button></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function OverviewItem({ icon: Icon, title, value, tip, prefix }: { icon: any; title: string; value: number; tip?: string; prefix?: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4"/>
        {title}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{prefix}{value}</div>
      {tip && <div className="mt-1 text-xs text-muted-foreground">{tip}</div>}
    </div>
  );
}

function NoticeItem({ title, content, time, type = "info" }: { title: string; content: string; time: string; type?: "info" | "warning" | "success" }) {
  const color = type === "warning" ? "bg-amber-50 text-amber-700 border-amber-200" : type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <div className={`rounded-2xl border p-3 ${color}`}>
      <div className="flex items-center justify-between text-sm font-medium">
        <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/>{title}</div>
        <div className="text-xs opacity-70">{time}</div>
      </div>
      <div className="mt-1 text-sm opacity-90">{content}</div>
    </div>
  );
}

function AddressItem({ name, detail, defaultTag = false }: { name: string; detail: string; defaultTag?: boolean }) {
  return (
    <div className="rounded-2xl border p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{detail}</div>
        </div>
        {defaultTag && <Badge variant="secondary">預設</Badge>}
      </div>
    </div>
  );
}
