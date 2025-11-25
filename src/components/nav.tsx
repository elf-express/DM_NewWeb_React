// src/components/nav.tsx
import { Boxes, Search, ScanSearch, Bell } from "lucide-react";
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { ThemeSwitcher, LanguageSwitcher } from '@/src/components/common';

// ⬇️ 注意：server 端用 getTranslations (不要用 useTranslations)
import { getTranslations } from 'next-intl/server';

import { getLogtoContext, signIn, signOut } from '@logto/next/server-actions';
import SignIn from '@/app/sign-in';
import SignOut from '@/app/sign-out';
import { logtoConfig } from '@/app/logto';

export default async function Nav() {
    // 取得多語系
    const t = await getTranslations();

    // 從 Logto 拿登入狀態
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

    // 🟡 在這裡印出登入狀態與 claims（會出現在 dev server 的 console）
    console.log('Logto context in Nav => isAuthenticated:', isAuthenticated);
    console.log('Logto claims in Nav =>', claims);

    return (
        <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 py-3">
                <div className="flex items-center gap-3">
                    <Boxes className="h-6 w-6" />
                    <div className="font-semibold">ELF EXPRESS 集運中心</div>

                    <div className="ml-auto flex w-full max-w-xl items-center gap-2">
                        {/* 搜尋框 */}
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder={t('common.search')} />
                        </div>

                        <Button variant="outline" className="gap-2">
                            <ScanSearch className="h-4 w-4" />
                            {t('common.quickSearch')}
                        </Button>

                        <LanguageSwitcher />
                        <ThemeSwitcher />

                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>

                        {/* ⬇️ 這裡是登入 / 登出區塊 */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {/* 這裡你可以自己決定要顯示什麼，先用 sub 當名字 */}
                                    Hello, {claims?.sub ?? 'User'}
                                </span>

                                <SignOut
                                    onSignOut={async () => {
                                        'use server';

                                        await signOut(logtoConfig);
                                    }}
                                />
                            </div>
                        ) : (
                            <SignIn
                                onSignIn={async () => {
                                    'use server';

                                    await signIn(logtoConfig);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
