
<!-- ═════════════════════ SIYAM CHAT BOT ═════════════════════ -->

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,18,24&height=230&section=header&text=SIYAM%20CHAT%20BOT&fontSize=58&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=Premium%20Messenger%20Automation%20System&descSize=19&descAlignY=58" width="100%"/>
</p>

<p align="center">
  <img src="assets/siyam-logo.svg" alt="SIYAM CHAT BOT Logo" width="620"/>
</p>

<h1 align="center">𝚂𝙸𝚈𝙰𝙼 𝙷𝙰𝚂𝙰𝙽</h1>
<h3 align="center">⚡ Premium Messenger Automation System</h3>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=25&duration=2500&pause=900&color=00E5FF&center=true&vCenter=true&width=820&lines=Welcome+To+SIYAM+CHAT+BOT;Mirai+%2B+GoatBot+Hybrid+Engine;Commands+%7C+No+Prefix+%7C+Inbox+Ready;Fast+%7C+Smart+%7C+Stable" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MIRAI-SUPPORTED-ff4d4d?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/GOATBOT-SUPPORTED-ffaa00?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/HYBRID-MODE-a855f7?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/NO_PREFIX-READY-00e676?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/INBOX-ENABLED-00b2ff?style=for-the-badge"/>
</p>

> **Mirai + GoatBot Hybrid**
>
> এই বট Mirai ও GoatBot—দুই ধরনের command/event সাপোর্ট করার জন্য তৈরি। `Script/commands` এবং `Script/events`-এ সংশ্লিষ্ট কোড রাখুন।
>
> বিস্তারিত: [GOAT_COMPAT.md](GOAT_COMPAT.md)

<p align="center">
  <img src="assets/siyam-photo-float.svg" width="100%" alt="Siyam Chat Bot Banner"/>
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=siyam-xpromex&label=PROFILE%20VISITORS&color=00d9ff&style=for-the-badge"/>
</p>

---

<h1 align="center">🍪 AUTO COOKIE & AUTO LOGIN</h1>

<p align="center">
  <img src="assets/auto-cookie-banner.svg" alt="Auto Cookie and Facebook Login" width="88%"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AUTO_COOKIE-ENABLED-ffb300?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/AUTO_LOGIN-READY-00e676?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/COOKIE_GUARDIAN-READY-7c4dff?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/AUTO_REFRESH-READY-00b2ff?style=for-the-badge"/>
</p>

| Feature | Description |
|:---|:---|
| 🍪 **Auto Cookie** | Facebook session cookie সংগ্রহ ও `appstate.json` আপডেট করার ব্যবস্থা। |
| 🔐 **Auto Login** | কনফিগার করা লগইন তথ্য দিয়ে সেশন পুনরুদ্ধারের ব্যবস্থা। |
| 🔑 **2FA Support** | Authenticator secret configure করা থাকলে 2FA কোড ব্যবহারের সুবিধা। |
| ♻️ **Self Recovery** | সেশন সমস্যায় cookie refresh/recovery চালানোর ব্যবস্থা। |

### চালু করার সেটআপ

| ধাপ | কাজ |
|:---:|:---|
| 1 | `guardian/` ফোল্ডারের প্রয়োজনীয় ফাইলগুলো রিপোজিটরিতে রাখুন। |
| 2 | Hosting Environment Variables-এ `FB_EMAIL`, `FB_PASSWORD` এবং প্রয়োজন হলে `FB_TOTP_SECRET` দিন। |
| 3 | প্রয়োজনীয় browser dependency ইনস্টল করুন: `npm i --no-save playwright && npx playwright install chromium` |
| 4 | Guardian ব্যবহারের জন্য Start Command দিন: `node guardian/start.js` |

> **Security:** `FB_PASSWORD`, `FB_TOTP_SECRET` বা session cookie কখনো GitHub-এ প্রকাশ করবেন না। Environment Variables ব্যবহার করুন। Facebook CAPTCHA বা identity verification চাইলে নিজে verification সম্পন্ন করতে হবে।

---

<h1 align="center">🌐 RENDER AUTO KEEP-ALIVE</h1>

<p align="center">
  <img src="assets/render-keepalive-banner.svg" alt="Render Auto Keep Alive" width="88%"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/RENDER-KEEP--ALIVE-00e676?style=for-the-badge&logo=render&logoColor=white"/>
  <img src="https://img.shields.io/badge/UPTIMEROBOT-NOT_REQUIRED-ff4d6d?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/SELF--PING-ENABLED-00b2ff?style=for-the-badge"/>
</p>

Render deployment-এ `RENDER_EXTERNAL_URL` পাওয়া গেলে Keep-Alive script সেটি ব্যবহার করে নির্দিষ্ট বিরতিতে নিজের service-এ request পাঠাতে পারে। এতে আলাদা UptimeRobot monitor configure করার প্রয়োজন নাও হতে পারে। Hosting provider-এর sleep policy ও plan অনুযায়ী uptime পরিবর্তিত হতে পারে।

### Render-এ চালানোর ধাপ

| ধাপ | কাজ |
|:---:|:---|
| 1 | `JuwelKeepalive.js` ফাইলটি `Juwel.js`-এর পাশে রাখুন। |
| 2 | Render Dashboard → Service → **Settings** → **Build & Deploy** খুলুন। |
| 3 | Start Command দিন: `node JuwelKeepalive.js` |
| 4 | Save করে **Manual Deploy → Deploy latest commit** দিন। |
| 5 | Logs-এ `[KEEPALIVE]` status দেখুন। |

Auto Cookie Guardian-ও একই সঙ্গে চালাতে হলে Guardian configuration অনুযায়ী Environment Variables-এ `USE_GUARDIAN=1` দিন।

<details>
<summary><b>Environment Variables</b></summary>

| Variable | কাজ |
|:---|:---|
| `KEEPALIVE_URL` | প্রয়োজনে নিজের service URL |
| `KEEPALIVE_INTERVAL_MS` | Ping interval; default `240000` ms |
| `USE_GUARDIAN` | `1` দিলে Guardian integration চালু |

</details>

---

<h1 align="center">📡 TELEGRAM START / STOP NOTICE</h1>

<p align="center">
  <img src="assets/telegram-alert-banner.svg" alt="Telegram Start Stop Alerts" width="88%"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/BOT_START-NOTICE-00e676?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/BOT_STOP-NOTICE-ff4d4d?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/SESSION-ALERT-7c4dff?style=for-the-badge"/>
</p>

বট চালু/বন্ধ হওয়া এবং session-related alert Telegram-এ পাঠানোর notification system।

| Notice | কখন পাঠানো হয় |
|:---|:---|
| 🟢 **STARTED** | বট চালু হলে |
| 🔴 **STOPPED** | বট বন্ধ হলে বা crash শনাক্ত হলে |
| 🚨 **ALERT** | session বা login সমস্যা শনাক্ত হলে |
| ✅ **BACK ONLINE** | বট আবার চালু হলে |

Telegram BotFather থেকে Bot Token নিয়ে `config.json`-এর alert configuration অথবা hosting Environment Variables-এ `JUWEL_TG_TOKEN` ও `JUWEL_TG_CHAT` configure করুন। Token কখনো public repository-তে রাখবেন না।

---

<h1 align="center">✨ FEATURES</h1>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=18&duration=2000&pause=800&color=00FF88&center=true&vCenter=true&width=820&lines=Auto+Reply+System;Quiz+%26+Games;Economy+System;Admin+Tools;Media+Downloader;No+Prefix+Triggers;Inbox+%2B+Group+Control;AI+Image+Tools" />
</p>

| Feature | Description |
|:---|:---|
| 🤖 **Auto Reply** | Auto-response ও AI chat feature |
| 🎮 **Quiz & Games** | বাংলা Quiz, Casino, Bầu Cua |
| 💰 **Economy** | Daily coins, streak, rank ও EXP/Level |
| 👥 **Group Management** | Add, kick, lock, tag, rename, emoji ও image control |
| 📥 **Media Downloader** | YouTube, Facebook, TikTok media downloader commands |
| ⚡ **Fast Response** | দ্রুত response ও reconnect support |
| 🖼️ **Photo Editing** | AI edit, upscale ও art tools |
| 🎨 **Image Generation** | Flux, Pollinations ও GPT-gen tools |
| 😂 **Fun Commands** | Meme, slap, hug, pet ও অন্যান্য fun commands |
| ⚡ **No Prefix** | নির্দিষ্ট trigger-এ prefix ছাড়াই response |
| 📥 **Inbox Support** | Inbox ও group—দুই জায়গায় command support |
| 🛡️ **Security** | Anti-flood, anti-spam, anti-join ও protection tools |
| 🔀 **Hybrid Engine** | Mirai + GoatBot command/event compatibility |
| 🕌 **Islamic Pack** | Ramadan auto-time, Sura ও Islamic commands |
| 🌐 **Keep-Alive** | Render self-ping integration |

---

<h1 align="center">⚡ NO PREFIX SYSTEM</h1>

প্রিফিক্স (`/`) ছাড়াই নির্দিষ্ট trigger লিখলে সংশ্লিষ্ট feature কাজ করে।

| Trigger | কাজ |
|:---:|:---|
| `jwl` | নির্দিষ্ট reaction |
| `autoreplybot` | Auto reply |
| `autovoice` | Auto voice reply |
| `baby` | AI auto-teach chat |
| `Gan` | Random song |
| `umma` · `night` · `women` | Fun auto-response |
| `👀` · `😅` | Emoji response |
| `salam` | সালামের reply |
| `hi` | Sticker reply |
| `bot` | Random fun reply |
| `fixspam` | Spam detection |
| `autoseen` | Auto seen |
| `autodl` | Link-based auto download |
| `shortcut` | Custom shortcut reply |
| `prefix` | Prefix ও bot information |

---

<h1 align="center">📥 INBOX SUPPORT</h1>

- `allowInbox: true` থাকলে inbox-এ command ব্যবহার করা যায়।
- `notice` দিয়ে একাধিক group-এ notice পাঠানো যায়।
- `sendsms` ও `outall` দিয়ে নির্দিষ্ট group-এ message পাঠানো যায়।
- `acp`, `listfriend`, `friends` দিয়ে friend request ও friend list পরিচালনা করা যায়।
- `pending` ও `join` দিয়ে pending group request পরিচালনা করা যায়।

---

<h1 align="center">🐾 ANIMAL POWER SYSTEM</h1>

| Mode | Power |
|:---:|:---|
| 🦁 **Lion** | Admin power control |
| 🐺 **Wolf** | Fast auto reply |
| 🦅 **Eagle** | Smart detection |
| 🐯 **Tiger** | High-speed execution |
| 🐉 **Dragon** | AI power |
| 🦂 **Scorpion** | Security shield |

---

<h1 align="center">🛡️ PROTECTION & EVENTS</h1>

| System | কাজ |
|:---|:---|
| `antiflood` | Message flood protection |
| `spamban` | Repeated spam control |
| `botautoban` | অন্য bot detection ও autoban |
| `antigali` | বাংলা Anti-Gali |
| `anti18` | 18+ শব্দ detection |
| `antiout` | Member leave control |
| `antijoin` | New member join control |
| `antiProtect` / `protect` | Group settings protection |
| `guardian` | Owner protection |
| `blacklistuser` | Blacklist user control |
| `bossleave` | নির্দিষ্ট kick event handling |
| `joinNoti` | Join notification |
| `leave` | Leave notification |
| `adminUpdate` | Group update notification |
| `lock` / `textoff` | Group chat lock |
| `vip` | VIP user management |

---

<h1 align="center">🧠 COMMANDS</h1>

<p align="center">
  <img src="https://img.shields.io/badge/PREFIX-%2F-ff00cc?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/HELP-%2Fhelp-00c6ff?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/MENU-%2Fmenu-ffd200?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/ALL-%2Fhelpall-00e676?style=for-the-badge"/>
</p>

বটের command list দেখতে `/help`, `/helpall` অথবা `/menu` ব্যবহার করুন।

<details>
<summary><b>🛠️ SYSTEM & ADMIN</b></summary>

`help` · `helpall` · `menu` · `system` · `uptime` · `upt` · `status` · `restart` · `offbot` · `load` · `config` · `settings` · `setbot` · `adminonly` · `adminupdate` · `self` · `0admin` · `listbox` · `allbox` · `thread` · `pending` · `join` · `vip` · `file` · `give` · `install` · `console` · `setprofile` · `setexp` · `delmsg` · `unsend` · `theme` · `notice` · `sendsms` · `outall` · `out`

</details>

<details>
<summary><b>👥 GROUP & BOX CHAT</b></summary>

`group` · `groupname` · `groupimage` · `groupemoji` · `setemoji` · `setname` · `newbox` · `boxinfo` · `boxadmin` · `listadmin` · `adduser` · `kick` · `kickall` · `ban` · `lock` · `protect` · `tag` · `mention` · `tid` · `rules` · `setjoin` · `setprefix` · `birthday` · `bday` · `top` · `textoff`

</details>

<details>
<summary><b>🛡️ PROTECTION</b></summary>

`antiflood` · `antigali` · `anti18` · `antijoin` · `antiout` · `botautoban` · `spamban` · `autoban` · `fixspam` · `protect`

</details>

<details>
<summary><b>🤖 AI & IMAGE TOOLS</b></summary>

`gptgen` · `flux` · `poli` · `edit` · `editpro` · `refine` · `prompt` · `animate` · `art` · `4k` · `ai` · `baby`

</details>

<details>
<summary><b>📥 MEDIA & DOWNLOADER</b></summary>

`youtube` · `video` · `song` · `sing` · `sing2` · `mp3` · `allvideo` · `shoti` · `rasian` · `autodl` · `getlink` · `catbox` · `imgur` · `say` · `x` (text-to-speech) · `sigma` · `sigmaboy` · `attitude` · `sad` · `random` · `anemi`

</details>

<details>
<summary><b>🎴 BANNER & FRAME MAKERS</b></summary>

`couple` · `love` · `love1` · `crush` · `crush1` · `bf` · `gf` · `besti` · `bestu` · `bestfriend` · `bro` · `kiss` · `hug` · `hug2` · `married` · `pair` · `pairing` · `bonk` · `sala` · `chipa` · `toilet` · `rip1` · `fbcover` · `fbpost` · `post` · `family`

</details>

<details>
<summary><b>😂 FUN & MEME</b></summary>

`slap` · `slap2` · `batslap` · `pet` · `pat` · `jail` · `goru` · `chor` · `dim` · `arrest` · `bigtext` · `rip` · `tokai` · `pabna` · `fokir` · `pem` · `bijiboy` · `bijigirl` · `doya` · `shayri` · `caption` · `wish` · `war` · `boom` · `nokia` · `mix`

</details>

<details>
<summary><b>🎮 GAMES & ECONOMY</b></summary>

`quiz` · `casino` · `bc` · `daily` · `rank`

</details>

<details>
<summary><b>🧰 UTILITIES & TOOLS</b></summary>

`uid` · `profile` · `ckuser` · `ckbot` · `numinfo` · `age` · `weather` · `ss` · `qr` · `font` · `wallpaper` · `google` · `search` · `pic` · `github` · `ar` · `bn` · `en` · `text` · `scan` · `autoseen`

</details>

<details>
<summary><b>🕌 ISLAMIC</b></summary>

`ramadanauto` · `sura` · `islamick` · `islam` · `allah`

</details>

<details>
<summary><b>💞 LOVE & COUPLE</b></summary>

`lv` · `lv2` · `lv3` · `love2` · `love3` · `kiss1` · `kiss2` · `kiss3` · `married3` · `pair1` · `pair2` · `coupledp` · `animedp` · `boypp` · `girlpp` · `girl`

</details>

---

<h1 align="center">⚙️ CONFIG HIGHLIGHTS</h1>

| Option | মান | কাজ |
|:---|:---:|:---|
| `PREFIX` / `usePrefix` | `/` / `true` | Command prefix |
| `allowInbox` | `true` | Inbox command support |
| `autoSent` | `true` | Auto message send |
| `autoCreateDB` | `true` | Group/user database creation |
| `autoClean` | `true` | Auto clean |
| `reactUnsend` | Configurable | নির্দিষ্ট reaction-এ bot message unsend |
| `Login.autoRetryLogin` | `true` | Login retry |
| `FCAOption.autoReconnect` | `true` | Connection reconnect |
| `DATABASE` | SQLite | `data.sqlite` |
| `ADMINBOT` / `DEVELOPER` | UID array | Admin ও developer UID |

> `appstate.json`, password, OTP secret এবং API token private রাখুন। Public repository-তে commit করবেন না।

---

<h1 align="center">📊 GITHUB STATS</h1>

<p align="center">
  <a href="https://github.com/siyam-xpromex/siyambot">
    <img src="https://github-readme-stats.vercel.app/api/pin/?username=siyam-xpromex&repo=siyambot&theme=tokyonight&hide_border=true"/>
  </a>
</p>

<p align="center">
  <a href="https://github.com/siyam-xpromex/siyambot"><img src="https://img.shields.io/github/stars/siyam-xpromex/siyambot?style=for-the-badge" alt="Stars"/></a>
  <a href="https://github.com/siyam-xpromex/siyambot/network/members"><img src="https://img.shields.io/github/forks/siyam-xpromex/siyambot?style=for-the-badge" alt="Forks"/></a>
  <a href="https://github.com/siyam-xpromex/siyambot/issues"><img src="https://img.shields.io/github/issues/siyam-xpromex/siyambot?style=for-the-badge" alt="Issues"/></a>
</p>

---

<h1 align="center">🚀 LIVE DEPLOY</h1>

<p align="center">
  <a href="https://render.com"><img src="https://img.shields.io/badge/Deploy%20On-Render-4353ff?style=for-the-badge&logo=render&logoColor=white" alt="Render"/></a>
  <a href="https://railway.app"><img src="https://img.shields.io/badge/Deploy%20On-Railway-a855f7?style=for-the-badge&logo=railway&logoColor=white" alt="Railway"/></a>
</p>

<details>
<summary><b>GitHub Actions Workflow</b> — optional scheduled run</summary>

```yaml
name: Run Bot

on:
  workflow_dispatch:
  schedule:
    - cron: "0 */6 * * *"

concurrency:
  group: run-bot
  cancel-in-progress: true

jobs:
  run:
    runs-on: ubuntu-latest
    timeout-minutes: 350
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22.x

      - name: Install dependencies
        run: npm install

      - name: Start bot
        run: npm start
```

</details>

---

<h1 align="center">🚀 HOW TO RUN</h1>

```bash
git clone https://github.com/siyam-xpromex/siyambot.git
cd siyambot
npm install
npm start
```

Render Keep-Alive ব্যবহার করলে hosting Start Command হিসেবে:

```bash
node JuwelKeepalive.js
```

আপনার repository-তে যে entry file ও `package.json` start script configured আছে, সেটির সঙ্গে Start Command মিলিয়ে নিন।

---

<h1 align="center">🧰 PLATFORM LINKS</h1>

| Platform | Link |
|:---|:---|
| GitHub | [siyam-xpromex/siyambot](https://github.com/siyam-xpromex/siyambot) |
| Render | [render.com](https://render.com) |
| Railway | [railway.app](https://railway.app) |

---

<h1 align="center">👤 DEVELOPER & SUPPORT</h1>

<p align="center">
  <img src="https://img.shields.io/badge/DEVELOPER-SIYAM%20HASAN-00d9ff?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/BOT-SIYAM%20CHAT%20BOT-a855f7?style=for-the-badge"/>
</p>

<p align="center">
  <a href="https://wa.me/8801789138157"><img src="assets/whatsapp.svg" alt="WhatsApp Developer" width="210"/></a>
  <a href="https://t.me/ri_siyam"><img src="assets/telegram.svg" alt="Developer Telegram" width="210"/></a>
  <a href="https://www.facebook.com/profile.php?id=61596102516084"><img src="assets/facebook.svg" alt="Facebook" width="210"/></a>
</p>

<h2 align="center">💬 SUPPORT GROUPS</h2>

<p align="center">
  <a href="https://chat.whatsapp.com/IbxqvkgbySJ10XsL7geN8B?s=cl&p=a&iam=2"><img src="https://img.shields.io/badge/WhatsApp-Support%20Group-25D366?style=for-the-badge&logo=whatsapp&logoColor=white"/></a>
  <a href="https://t.me/siyam_esb"><img src="https://img.shields.io/badge/Telegram-Support%20Group-26A5E4?style=for-the-badge&logo=telegram&logoColor=white"/></a>
</p>

---

<p align="center">
  <img src="assets/thank-you.svg" alt="Thank you for using Siyam Chat Bot" width="100%"/>
</p>

<h2 align="center">💙 SIYAM CHAT BOT ব্যবহার করার জন্য ধন্যবাদ!</h2>

<p align="center">
  <a href="https://github.com/siyam-xpromex/siyambot"><img src="https://img.shields.io/badge/GitHub-Visit%20Repository-181717?style=for-the-badge&logo=github&logoColor=white"/></a>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,18,24&height=120&section=footer" width="100%"/>
</p>
