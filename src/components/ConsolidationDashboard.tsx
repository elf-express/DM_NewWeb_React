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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ThemeSwitcher, LanguageSwitcher } from '@/components/common';
import { useTheme, themes } from '@/contexts';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
                <Input className="pl-9" placeholder={t('common.search')} />
              </div>
              <Button variant="outline" className="gap-2"><ScanSearch className="h-4 w-4"/>{t('common.quickSearch', '快速查件')}</Button>
              <LanguageSwitcher />
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
                  <CardTitle className="text-lg">{t('overview.title')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <OverviewItem icon={Package} title={t('overview.notInbound')} value={5} tip={t('overview.waitingShipment')}/>
                  <OverviewItem icon={Truck} title={t('overview.arrived')} value={8} tip={t('overview.arrivedWarehouse')}/>
                  <OverviewItem icon={UploadCloud} title={t('overview.pendingDeclaration')} value={3} tip={t('overview.needDeclaration')}/>
                  <OverviewItem icon={BadgeDollarSign} title={t('overview.balance')} value={1250} prefix="NT$"/>
                </CardContent>
              </Card>
            </motion.div>

            {/* 客服中心與快捷 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">{t('customerService.title')}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border p-3">
                    <HelpCircle className="mt-0.5 h-4 w-4"/>
                    <div className="text-sm text-muted-foreground">{t('customerService.faq')}</div>
                  </div>
                  <Button className="w-full gap-2"><MessageSquare className="h-4 w-4"/> {t('customerService.onlineService')}</Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="gap-2">
                      <Package className="h-4 w-4"/>
                      {t('customerService.packageQuery')}
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Settings className="h-4 w-4"/>
                      {t('customerService.serviceSettings')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">{t('quickActions.title')}</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <QuickAction icon={UploadCloud} label={t('quickActions.declare')}/>
                  <QuickAction icon={Truck} label={t('quickActions.arrange')}/>
                  <QuickAction icon={CreditCard} label={t('quickActions.payment')}/>
                  <QuickAction icon={History} label={t('quickActions.history')}/>
                  <QuickAction icon={MapPin} label={t('quickActions.address')}/>
                  <QuickAction icon={Settings} label={t('quickActions.settings')}/>
                </CardContent>
              </Card>
            </div>

            {/* 清單區塊 */}
            <Tabs defaultValue="inbound" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="inbound">{t('tabs.myInbound')}</TabsTrigger>
                  <TabsTrigger value="orders">{t('tabs.myOrders')}</TabsTrigger>
                  <TabsTrigger value="notice">{t('tabs.notifications')}</TabsTrigger>
                </TabsList>
                <Button variant="outline" className="gap-2"><MapPin className="h-4 w-4"/>新增收件地址</Button>
              </div>
              <TabsContent value="inbound" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('inbound.id')}</TableHead>
                          <TableHead>{t('inbound.origin')}</TableHead>
                          <TableHead className="text-center">{t('inbound.items')}</TableHead>
                          <TableHead className="text-center">{t('inbound.weight')}</TableHead>
                          <TableHead>{t('inbound.status')}</TableHead>
                          <TableHead><div className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/>{t('inbound.eta')}</div></TableHead>
                          <TableHead className="text-right">{t('inbound.actions')}</TableHead>
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
                              <Button size="sm" variant="outline">{t('inbound.declare')}</Button>
                              <Button size="sm">{t('inbound.viewDetails')}</Button>
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
                          <TableHead>{t('orders.orderId')}</TableHead>
                          <TableHead>{t('orders.type')}</TableHead>
                          <TableHead>{t('orders.amount')}</TableHead>
                          <TableHead>{t('orders.date')}</TableHead>
                          <TableHead>{t('orders.status')}</TableHead>
                          <TableHead className="text-right">{t('orders.actions')}</TableHead>
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
                              <Button size="sm" variant="outline">{t('orders.details')}</Button>
                              <Button size="sm">{t('orders.pay', '付款')}</Button>
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
                  <div className="text-sm opacity-90">{t('user.welcome', '歡迎回來')}，王南傑</div>
                  <div className="text-lg font-semibold">{t('user.memberLevel', '會員等級')}：{t('user.platinum', '白金')}</div>
                  <div className="mt-2 flex gap-2 text-xs opacity-90">
                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">免手續費券 x2</Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">運費 95 折</Badge>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('user.monthlyShipments', '當月出貨量')}</span>
                    <span>23 {t('user.items', '件')}</span>
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
                    <Button variant="outline" className="gap-2"><BadgeDollarSign className="h-4 w-4"/>{t('user.viewBill')}</Button>
                    <Button className="gap-2"><CreditCard className="h-4 w-4"/>{t('user.recharge')}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 收件地址 */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">{t('address.title')}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <AddressItem name={t('address.taipei')} detail="台北市內湖區瑞光路 123 號 1 樓" defaultTag />
                <AddressItem name={t('address.kaohsiung')} detail="高雄市鼓山區美術東二路 88 號 12 樓" />
                <div className="pt-1"><Button variant="outline" className="w-full">{t('address.manage')}</Button></div>
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
