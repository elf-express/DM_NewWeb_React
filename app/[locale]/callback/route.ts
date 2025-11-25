// app/[locale]/callback/route.ts
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { handleSignIn, getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/app/logto';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale } = await context.params;
  const searchParams = request.nextUrl.searchParams;

  // 1️⃣ 先讓 Logto 處理登入（寫 cookie）
  await handleSignIn(logtoConfig, searchParams);

  // 2️⃣ 再根據剛寫好的 cookie 拿一次登入狀態 + claims
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (isAuthenticated && claims) {
    const userId = claims.sub;        // Logto 的 userId
    const email = (claims as any).email as string | undefined;

    // 3️⃣ 呼叫你自己的後端 API，把 user 存到 DB
    if (email) {
      try {
        await fetch('https://你的後端域名/api/users/sync-from-logto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // 這個 payload 就是你後端要用來 upsert 的資料
          body: JSON.stringify({
            logtoUserId: userId,
            email,
          }),
        });
      } catch (e) {
        console.error('同步使用者資料到後端失敗', e);
        // 這裡你可以選擇要不要中止，通常登入流程先讓他成功
      }
    }
  }

  // 4️⃣ 最後一樣導回原本語系首頁
  redirect(`/${locale}`);
}
