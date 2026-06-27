# Shipping Campus Capital — Web, iOS & Android

Campus Capital is one codebase that ships three ways. The **web app is the engine** — iOS and Android are native shells that load it, so you build the product once.

```
                ┌─────────────────────────────┐
                │  Next.js web app (Vercel)    │  ← the real product
                └─────────────┬───────────────┘
          ┌───────────────────┼────────────────────┐
   PWA (install from      iOS app (Capacitor)   Android app (Capacitor)
   Safari/Chrome)         → App Store           → Google Play
```

---

## 1. Web — deploy first (everything else depends on it)

1. Push to GitHub (already done).
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the `stock-market` repo.
3. Add Environment Variables (copy the values from your local `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `FINNHUB_API_KEY` (for live market prices)
4. **Deploy.** You get a URL like `https://campus-capital.vercel.app`.
5. In Supabase → **Authentication → URL Configuration**, add that URL to the allowed redirect/site URLs.

That URL is your live product and the backend for the mobile apps.

---

## 2. PWA — installable today, no Mac, no fees

The app already ships a web manifest + service worker, so it's installable right now:

- **iPhone:** open the site in Safari → Share → **Add to Home Screen**. It launches full-screen with the app icon.
- **Android:** open in Chrome → menu → **Install app**.

This is the fastest way to get a real "app on the phone" in front of testers while you set up the app stores.

---

## 3. iOS — App Store (requires a Mac + Apple Developer account)

> You cannot build/submit iOS apps from Windows — Xcode is macOS-only. Use your own Mac, or a cloud Mac (MacinCloud) / CI (Codemagic). Apple Developer Program is **$99/yr**.

1. Point the shell at your deployed site — in `capacitor.config.ts`, set:
   ```ts
   server: { androidScheme: "https", url: "https://campus-capital.vercel.app" }
   ```
2. On the Mac:
   ```bash
   npm install
   npx cap add ios
   npx cap sync ios
   npx cap open ios     # opens Xcode
   ```
3. In Xcode: set your Team (signing), bump the version/build, run on a simulator/device.
4. Generate app icons from `public/icon.svg` (use `@capacitor/assets` or [appicon.co](https://appicon.co) → 1024×1024 PNG).
5. Archive → upload to **App Store Connect** → submit for review.

**Avoid the #1 rejection (Guideline 4.2 "minimum functionality"):** add a native feature so it isn't "just a website." Push notifications (streak reminders) is the natural one — `@capacitor/push-notifications`.

---

## 4. Android — Google Play (works from any OS with Android Studio)

> Google Play Developer account is a **one-time $25**. You can do this from Windows.

1. Same `server.url` as above.
2. ```bash
   npx cap add android
   npx cap sync android
   npx cap open android   # opens Android Studio
   ```
3. In Android Studio: set the applicationId (`com.campuscapital.app`), version, and generate a **signed App Bundle (.aab)**.
4. Generate icons from `public/icon.svg`.
5. Create the app in the **Google Play Console**, upload the `.aab`, fill the store listing, submit.

---

## What only you can do (not codeable from here)

- Buy the developer accounts (Apple $99/yr, Google $25 once).
- Use a Mac for the iOS build/submit.
- App Store / Play screenshots, privacy policy URL, and data-safety forms.
- App review back-and-forth (budget 2–3 rounds).

## Compliance reminder

The app is **educational, simulated, no real money/trading** — keep the in-app disclaimers. That keeps you out of broker-dealer regulation and the strictest financial-app review. The day you add *real* investing, that becomes a separate, regulated product (a licensed brokerage partner like Alpaca + KYC + legal).
