<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00c6ff,50:7b2ff7,100:ff00cc&height=230&section=header&text=NIJHUM%20CHAT%20BOT&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=POWERED%20BY%20SIYAM%20HASAN&descSize=20&descAlignY=60" width="100%"/>
</p><h1 align="center">👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑</h1><h3 align="center">🤖 NIJHUM CHAT BOT | MIRAI + GOATBOT HYBRID</h3><p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=19&duration=2500&pause=700&color=00E5FF&center=true&vCenter=true&width=800&lines=Welcome+to+Nijhum+Chat+Bot;Mirai+%2B+GoatBot+Hybrid+System;One+Bot+%E2%80%A2+Two+Command+Systems;Developed+by+Siyam+Hasan"/>
</p><p align="center">
  <a href="https://github.com/siyam-xpromex/siyambot">
    <img src="https://img.shields.io/badge/GITHUB-REPOSITORY-181717?style=for-the-badge&logo=github"/>
  </a>
  <img src="https://img.shields.io/badge/OWNER-SIYAM%20HASAN-00c6ff?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/BOT-NIJHUM%20CHAT%20BOT-8A2BE2?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/NODE.JS-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/LICENSE-MIT-yellow?style=for-the-badge"/>
</p>---

🌸 About Nijhum Chat Bot

Nijhum Chat Bot is a hybrid Facebook Messenger bot combining the power of Mirai and GoatBot.

এই বটের মাধ্যমে একই প্রজেক্টে Mirai এবং GoatBot-এর কমান্ড ও ইভেন্ট চালানো যায়। এর মূল কাঠামো Mirai ভিত্তিক এবং GoatBot কমান্ড চালানোর জন্য রয়েছে Compatibility Layer।

👑 Developer Information

Information| Details
Developer| Siyam Hasan
Bot Name| Nijhum Chat Bot
Platform| Facebook Messenger
Framework| Mirai + GoatBot
Runtime| Node.js 22.x
License| MIT
GitHub| siyam-xpromex

---

✨ Main Features

<p align="center">
  <img src="https://img.shields.io/badge/🤖_MIRAI-CORE-ff4d4d?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/🐐_GOATBOT-COMPATIBILITY-ffaa00?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/⚡_HYBRID-MODE-a855f7?style=for-the-badge"/>
</p>- 🤖 Mirai command support
- 🐐 GoatBot command compatibility
- 🎯 Multiple event handlers
- 💬 Reply and reaction handlers
- 🌍 Global utility compatibility
- 🗄️ User and thread data mapping
- 🔐 Admin and developer permissions
- ⚙️ Configurable bot settings
- 🔄 Automatic restart policy support
- 🚀 Railway deployment support

---

🎬 Project Animation

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=12,14,18,24&height=120&section=header&text=NIJHUM%20CHAT%20BOT&fontSize=35&fontColor=ffffff&animation=fadeIn" width="90%"/>
</p><p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=18&duration=2000&pause=500&color=FF00CC&center=true&vCenter=true&width=700&lines=Smart+Messenger+Bot;Powerful+Command+System;Developed+by+Siyam+Hasan"/>
</p>---

🚀 Installation

1. Clone Repository

git clone https://github.com/siyam-xpromex/siyambot.git

2. Open Project Folder

cd siyambot

3. Install Dependencies

npm install

4. Configure Bot

- "appstate.json" ফাইলে Facebook login appstate বসাও।
- "config.json" ফাইলে নিজের Admin UID ও Developer UID সেট করো।

5. Start Bot

npm start

<text>⚠️ Important: Launcher হিসেবে "Siyam.js" ব্যবহার করবে। সরাসরি "Main.js" চালাবে না।</text>

---

📂 Command Structure

Type| Directory
Mirai Commands| "Script/commands/"
GoatBot Commands| "Script/commands/"
Mirai Events| "Script/events/"
GoatBot Events| "Script/events/"

GoatBot কমান্ড ও ইভেন্ট ফাইল Compatibility Layer-এর মাধ্যমে চালানো হয়।

---

🧩 Supported GoatBot Features

Command Configuration

"name", "aliases", "role", "countDown", "category", "author", "version", "shortDescription", "longDescription", "guide", "envConfig", "usePrefix"

Handlers

- "onStart"
- "onChat"
- "onReply"
- "onReaction"
- "onEvent"
- "onAnyEvent"
- "onFirstChat"
- "onLoad"

Global Support

- "global.GoatBot"
- "global.db"
- "global.temp"
- "global.utils"

Message Methods

- "reply"
- "send"
- "unsend"
- "reaction"
- "err"

---

🗄️ Data Mapping

GoatBot API| Mirai Database
"usersData.get(uid)"| Users + Currencies
"threadsData.get(tid)"| Threads
"adminIDs"| Thread admin IDs
"money"| Currencies
"exp"| Currencies

---

⚠️ Known Limitations

- GoatBot Dashboard সাপোর্টেড নয়।
- MongoDB এবং "globalData" সম্পূর্ণ সাপোর্টেড নয়।
- Google Drive ও imgbb upload utilities সাপোর্টেড নয়।
- "loadScripts/unloadScripts" hot reload নেই।
- কিছু Promise-based API call FCA-এর Promise support-এর ওপর নির্ভরশীল।

---

🧬 Project Structure

File| Description
"Siyam.js"| Main Launcher
"Main.js"| Encrypted Mirai Core
"includes/compat/preload.js"| Compatibility Preloader
"includes/compat/goatRuntime.js"| GoatBot Runtime
"includes/compat/goatApi.js"| GoatBot API Adapter
"includes/compat/goatUtils.js"| GoatBot Utilities
"includes/handle/"| Event Handlers

---

☁️ Railway Deployment

এই প্রজেক্ট Railway-তে deploy করার জন্য "npm start" ব্যবহার করে।

npm install
npm start

Deployment configuration:

{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ALWAYS"
  }
}

---

💎 Developer & Contact

<p align="center">
  <img src="https://img.shields.io/badge/DEVELOPED%20BY-SIYAM%20HASAN-ff00cc?style=for-the-badge"/>
</p><p align="center">
  <a href="https://github.com/siyam-xpromex">
    <img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github"/>
  </a>
  <a href="https://www.facebook.com/profile.php?id=61596102516084">
    <img src="https://img.shields.io/badge/Facebook-Profile-1877F2?style=for-the-badge&logo=facebook"/>
  </a>
  <a href="https://t.me/ri_siyam">
    <img src="https://img.shields.io/badge/Telegram-Contact-26A5E4?style=for-the-badge&logo=telegram"/>
  </a>
  <a href="https://wa.me/8801789138157">
    <img src="https://img.shields.io/badge/WhatsApp-Contact-25D366?style=for-the-badge&logo=whatsapp"/>
  </a>
</p><p align="center">
  <b>👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑</b>
  <br/>
  <b>🌸 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧 🌸</b>
  <br/>
  <i>Made with ❤️ by Siyam Hasan</i>
</p>---

📜 License

This project is licensed under the MIT License.

Copyright (c) 2026 Siyam Hasan.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00c6ff,50:7b2ff7,100:ff00cc&height=130&section=footer"/>
</p>
