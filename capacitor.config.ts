import type { CapacitorConfig } from "@capacitor/cli";

// Native shell config for the iOS + Android apps.
//
// Campus Capital is a Next.js app with a server (auth, /api routes, SSR), so
// the native apps load the DEPLOYED web app inside a native shell. After you
// deploy the web app (see MOBILE.md → Web), set `server.url` to that HTTPS URL.
const config: CapacitorConfig = {
  appId: "com.campuscapital.app",
  appName: "Campus Capital",
  webDir: "public",
  backgroundColor: "#05060a",
  server: {
    androidScheme: "https",
    // url: "https://your-campus-capital.vercel.app",  // <- set after deploying
  },
  ios: {
    contentInset: "always",
    backgroundColor: "#05060a",
  },
  android: {
    backgroundColor: "#05060a",
  },
};

export default config;
