const axios = require('axios');

const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "baby",
    aliases: ["baby", "bbe", "babe", "bot chan"],
    version: "6.9.1",
    author: "dipto edit by MAMUN",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2]... OR\nteach react [YourMessage] - [react1], [react2]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR\nall OR\nedit [YourMessage] - [NewMessage]"
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type #baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit) || [];
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return { name, value };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(/\s*-\s*/)[1];
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher))?.name || "Unknown";
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            if (info && global.GoatBot) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    d,
                    apiUrl: link
                });
            }
        }, event.messageID);

    } catch (e) {
        console.error(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event, Reply }) => {
    try {
        if (event.type === "message_reply") {
            const link = await baseApiUrl();
            const a = (await axios.get(`${link}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                if (info && global.GoatBot) {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID,
                        a
                    });
                }
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({ api, event }) => {
    try {
        if (!event.body) return;
        const body = event.body.toLowerCase();
        
        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("muskan") || body.startsWith("babu") || body.startsWith("janu")) {
            const arr = body.replace(/^\S+\s*/, "").trim();

            const randomReplies = [
"𓆩👑𓆪 〆 𝐘𝐞𝐬𝐬 𝐁𝐨𝐬𝐬, 𝐌𝐮𝐬𝐤𝐚𝐧 𝐢𝐬 𝐡𝐞𝐫𝐞… 𝐍𝐨𝐰 𝐥𝐞𝐭 𝐭𝐡𝐞 𝐜𝐡𝐚𝐨𝐬 𝐛𝐞𝐠𝐢𝐧! 😈🔥",
"𓆩🖤𓆪 〆 𝐇𝐮𝐦𝐦 𝐛𝐨𝐥𝐨 𝐣𝐚𝐧𝐚𝐛, 𝐌𝐮𝐬𝐤𝐚𝐧-𝐫 𝐤𝐚𝐧 𝐤𝐡𝐨𝐥𝐚… 𝐦𝐨𝐧𝐞𝐫 𝐤𝐨𝐭𝐡𝐚 𝐬𝐡𝐮𝐧𝐛𝐨! 🫶✨",
"𓆩🤣𓆪 〆 𝐁𝐨𝐬𝐬, 𝐚𝐩𝐧𝐞 𝐤𝐢 𝐦𝐚𝐧𝐮𝐬𝐡 𝐧𝐚𝐤𝐢 𝐖𝐢𝐅𝐢? 𝐊𝐚𝐜𝐡𝐞 𝐚𝐬𝐡𝐥𝐞𝐢 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧 𝐜𝐡𝐚𝐢! 📶😂",
"𓆩💗𓆪 〆 𝐌𝐮𝐬𝐤𝐚𝐧-𝐫 𝐦𝐨𝐨𝐝 𝐭𝐚 𝐛𝐮𝐣𝐡𝐭𝐞 𝐡𝐨𝐥𝐞, 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐧𝐚… 𝐦𝐨𝐧 𝐩𝐨𝐫𝐭𝐞 𝐡𝐨𝐛𝐞! 🥹🌸",
"𓆩🥀𓆪 〆 𝐒𝐨𝐛𝐚𝐢 𝐡𝐚𝐬𝐡𝐢 𝐝𝐞𝐤𝐡𝐞, 𝐤𝐞𝐮 𝐤𝐢𝐧𝐭𝐮 𝐦𝐨𝐧𝐞𝐫 𝐜𝐥𝐚𝐧𝐭𝐢 𝐝𝐞𝐤𝐡𝐞 𝐧𝐚… 🖤🥀",
"𓆩😎𓆪 〆 𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐚𝐦𝐚𝐫 𝐧𝐚… 𝐬𝐞𝐥𝐟-𝐫𝐞𝐬𝐩𝐞𝐜𝐭 𝐚𝐦𝐚𝐫 𝐬𝐢𝐠𝐧𝐚𝐭𝐮𝐫𝐞! 👑⚡",
"𓆩💌𓆪 〆 𝐉𝐚𝐧𝐨, 𝐭𝐨𝐦𝐚𝐤𝐞 𝐩𝐚𝐨𝐲𝐚𝐫 𝐠𝐚𝐥𝐩𝐨 𝐧𝐨𝐲… 𝐭𝐨𝐦𝐚𝐤𝐞 𝐡𝐚𝐫𝐢𝐲𝐞 𝐧𝐚 𝐟𝐞𝐥𝐚𝐫 𝐛𝐡𝐨𝐲 𝐭𝐚𝐢 𝐛𝐞𝐬𝐡𝐢! 🥹❤️",
"𓆩😂𓆪 〆 𝐒𝐢𝐫, 𝐚𝐩𝐧𝐚𝐫 𝐥𝐨𝐯𝐞 𝐥𝐢𝐟𝐞 𝐤𝐞𝐦𝐨𝐧? 𝐍𝐞𝐭𝐟𝐥𝐢𝐱 𝐞𝐫 𝐦𝐨𝐭𝐨 𝐬𝐞𝐚𝐬𝐨𝐧 𝐚𝐜𝐡𝐞, 𝐧𝐚𝐤𝐢 𝐟𝐢𝐧𝐚𝐥𝐞 𝐡𝐨𝐲𝐞 𝐠𝐞𝐜𝐡𝐞? 🍿🤣",
"𓆩🌙𓆪 〆 𝐑𝐚𝐚𝐭 𝐣𝐚𝐠𝐚 𝐦𝐚𝐧𝐮𝐬𝐡 𝐬𝐡𝐨𝐛𝐚𝐢 𝐩𝐫𝐞𝐦𝐢𝐤 𝐧𝐨𝐲… 𝐤𝐞𝐮 𝐤𝐞𝐮 𝐨𝐯𝐞𝐫𝐭𝐡𝐢𝐧𝐤𝐢𝐧𝐠-𝐞𝐫 𝐂𝐄𝐎! 😭🖤",
"𓆩💞𓆪 〆 𝐌𝐮𝐬𝐤𝐚𝐧 𝐞𝐤𝐭𝐚 𝐤𝐨𝐭𝐡𝐚 𝐛𝐨𝐥𝐢? 𝐒𝐡𝐮𝐧𝐝𝐨𝐫 𝐦𝐮𝐡𝐮𝐫𝐭𝐨 𝐧𝐨𝐲, 𝐦𝐚𝐧𝐮𝐬𝐡𝐭𝐚𝐤𝐞 𝐬𝐡𝐮𝐧𝐝𝐨𝐫 𝐤𝐨𝐫𝐞! 🌷✨",
"𓆩💔𓆪 〆 𝐊𝐢𝐜𝐡𝐮 𝐦𝐚𝐧𝐮𝐬𝐡 𝐬𝐦𝐫𝐢𝐭𝐢 𝐡𝐨𝐲𝐞 𝐭𝐡𝐚𝐤𝐞… 𝐤𝐢𝐧𝐭𝐮 𝐦𝐨𝐧 𝐭𝐡𝐞𝐤𝐞 𝐤𝐨𝐤𝐡𝐨𝐧𝐨 𝐦𝐮𝐜𝐡𝐞 𝐣𝐚𝐲 𝐧𝐚! 🥀",
"𓆩😹𓆪 〆 𝐁𝐨𝐬𝐬, 𝐚𝐩𝐧𝐚𝐤𝐞 𝐝𝐞𝐤𝐡𝐞 𝐦𝐨𝐧𝐞 𝐡𝐨𝐲 𝐆𝐨𝐨𝐠𝐥𝐞-𝐨 𝐛𝐨𝐥𝐛𝐞: 𝐒𝐨𝐫𝐫𝐲, 𝐧𝐨 𝐫𝐞𝐬𝐮𝐥𝐭 𝐟𝐨𝐮𝐧𝐝! 🤣🔍",
"𓆩🫀𓆪 〆 𝐌𝐨𝐧 𝐝𝐢𝐲𝐞 𝐯𝐚𝐥𝐨𝐛𝐚𝐬𝐡𝐢𝐨… 𝐤𝐚𝐫𝐨𝐧 𝐬𝐨𝐛𝐚𝐢 𝐬𝐮𝐣𝐨𝐠 𝐝𝐞𝐲, 𝐤𝐢𝐧𝐭𝐮 𝐤𝐞𝐮 𝐤𝐞𝐮 𝐠𝐮𝐫𝐮𝐭𝐭𝐨 𝐛𝐮𝐣𝐡𝐭𝐞 𝐬𝐡𝐞𝐤𝐡𝐚𝐲 𝐧𝐚! 🖤",
"𓆩👀𓆪 〆 𝐁𝐨𝐬𝐬, 𝐜𝐡𝐨𝐤𝐡𝐞 𝐜𝐡𝐨𝐤𝐡 𝐫𝐚𝐤𝐡𝐞 𝐤𝐨𝐭𝐡𝐚 𝐛𝐨𝐥𝐛𝐞𝐧 𝐧𝐚… 𝐌𝐮𝐬𝐤𝐚𝐧 𝐤𝐢𝐧𝐭𝐮 𝐬𝐨𝐛 𝐬𝐜𝐚𝐧 𝐤𝐨𝐫𝐞! 😂📸",
"𓆩🌹𓆪 〆 𝐏𝐫𝐞𝐦 𝐦𝐚𝐧𝐞 𝐬𝐮𝐝𝐡𝐮 '𝐈 𝐥𝐨𝐯𝐞 𝐲𝐨𝐮' 𝐧𝐨𝐲… 𝐞𝐤𝐭𝐮 𝐤𝐡𝐨𝐣, 𝐞𝐤𝐭𝐮 𝐛𝐮𝐣𝐡𝐚, 𝐚𝐫 𝐞𝐤𝐭𝐮 𝐭𝐡𝐞𝐤𝐞 𝐣𝐚𝐨𝐲𝐚! ❤️🫶",
"𓆩🫠𓆪 〆 𝐀𝐦𝐚𝐫 𝐤𝐫𝐚𝐬𝐡 𝐚𝐦𝐚𝐤𝐞 𝐝𝐞𝐤𝐡𝐥𝐞 𝐬𝐦𝐢𝐥𝐞 𝐝𝐞𝐲… 𝐚𝐫 𝐚𝐦𝐢 𝐝𝐞𝐤𝐡𝐥𝐞 𝐛𝐫𝐚𝐢𝐧 𝐫𝐞𝐬𝐭𝐚𝐫𝐭 𝐡𝐨𝐲! 😭💗",
"𓆩👑𓆪 〆 𝐌𝐮𝐬𝐤𝐚𝐧 𝐤𝐚𝐫𝐨 𝐦𝐨𝐧 𝐣𝐞𝐭𝐞 𝐩𝐚𝐫𝐞, 𝐤𝐢𝐧𝐭𝐮 𝐤𝐚𝐮𝐤𝐞 𝐢𝐦𝐩𝐫𝐞𝐬𝐬 𝐤𝐨𝐫𝐭𝐞 𝐧𝐢𝐣𝐞𝐤𝐞 𝐡𝐚𝐫𝐚𝐲 𝐧𝐚! 😌✨",
"𓆩🥹𓆪 〆 𝐊𝐡𝐮𝐛 𝐤𝐚𝐜𝐡𝐞𝐫 𝐦𝐚𝐧𝐮𝐬𝐡𝐨 𝐞𝐤𝐬𝐡𝐨𝐦𝐨𝐲 𝐦𝐨𝐧𝐞𝐫 𝐤𝐚𝐜𝐡𝐞 𝐭𝐡𝐚𝐤𝐞 𝐧𝐚… 𝐞𝐭𝐚𝐢 𝐣𝐢𝐛𝐨𝐧𝐞𝐫 𝐞𝐤𝐭𝐚 𝐧𝐢𝐫𝐨𝐛 𝐬𝐚𝐭𝐭𝐲! 🌧️🖤",
"𓆩🤣𓆪 〆 𝐁𝐨𝐬𝐬, 𝐚𝐩𝐧𝐚𝐫 𝐜𝐫𝐮𝐬𝐡 𝐤𝐢 𝐚𝐜𝐡𝐞? 𝐍𝐚𝐦 𝐛𝐨𝐥𝐞𝐧… 𝐌𝐮𝐬𝐤𝐚𝐧 𝐅𝐁 𝐂𝐈𝐃 𝐭𝐞𝐚𝐦 𝐝𝐚𝐤𝐜𝐡𝐞! 😂🕵️",
"𓆩💘𓆪 〆 𝐓𝐮𝐦𝐢 𝐡𝐨𝐲𝐭𝐨 𝐤𝐚𝐫𝐨 𝐣𝐢𝐛𝐨𝐧𝐞 𝐞𝐤𝐭𝐮 𝐚𝐥𝐨… 𝐣𝐚𝐫 𝐡𝐚𝐬𝐡𝐢𝐭𝐞 𝐦𝐨𝐧𝐞𝐫 𝐬𝐡𝐨𝐛 𝐤𝐥𝐚𝐧𝐭𝐢 𝐡𝐚𝐫𝐢𝐲𝐞 𝐣𝐚𝐲! 🌸❤️",
"𓆩😈𓆪 〆 𝐀𝐦𝐚𝐤𝐞 𝐜𝐮𝐭𝐞 𝐛𝐡𝐚𝐛𝐛𝐞𝐧 𝐧𝐚… 𝐚𝐦𝐢 𝐜𝐮𝐭𝐞 𝐡𝐨𝐥𝐞𝐨 𝐫𝐞𝐩𝐥𝐲-𝐭𝐚 𝐝𝐞𝐛𝐨 𝐫𝐨𝐚𝐬𝐭 𝐝𝐢𝐲𝐞! 🔥😂",
"𓆩🖤𓆪 〆 𝐉𝐚𝐫𝐚 𝐚𝐦𝐚𝐤𝐞 𝐛𝐮𝐣𝐡𝐭𝐞 𝐜𝐚𝐲, 𝐭𝐚𝐝𝐞𝐫 𝐤𝐚𝐜𝐡𝐞 𝐛𝐚𝐫𝐛𝐚𝐫 𝐧𝐢𝐣𝐞𝐤𝐞 𝐩𝐫𝐨𝐦𝐚𝐧 𝐤𝐨𝐫𝐭𝐞 𝐡𝐨𝐲 𝐧𝐚! 👑",
"𓆩🥀𓆪 〆 𝐒𝐦𝐢𝐥𝐞-𝐭𝐚 𝐫𝐚𝐤𝐡𝐢 𝐦𝐮𝐤𝐡𝐞… 𝐤𝐚𝐫𝐨𝐧 𝐬𝐨𝐛𝐚𝐢 𝐠𝐚𝐥𝐩𝐨 𝐬𝐡𝐮𝐧𝐭𝐞 𝐜𝐚𝐲, 𝐤𝐞𝐮 𝐤𝐞𝐮 𝐠𝐚𝐥𝐩𝐞𝐫 𝐩𝐢𝐜𝐡𝐞𝐫 𝐦𝐚𝐧𝐮𝐬𝐡𝐭𝐚𝐤𝐞 𝐧𝐨𝐲! 🖤🌧️",
"𓆩😂𓆪 〆 𝐒𝐢𝐫, 𝐚𝐩𝐧𝐚𝐫 𝐥𝐨𝐯𝐞 𝐬𝐭𝐨𝐫𝐲 𝐬𝐡𝐮𝐧𝐛𝐨… 𝐤𝐢𝐧𝐭𝐮 𝐚𝐠𝐞𝐢 𝐛𝐨𝐥𝐞 𝐫𝐚𝐤𝐡𝐢, 𝐩𝐨𝐩𝐜𝐨𝐫𝐧 𝐚𝐦𝐚𝐫! 🍿🤣",
"𓆩💗𓆪 〆 𝐓𝐨𝐦𝐚𝐫 𝐬𝐚𝐭𝐡𝐞 𝐤𝐨𝐭𝐡𝐚 𝐛𝐨𝐥𝐚𝐫 𝐣𝐨𝐧𝐧𝐨 𝐤𝐨𝐧𝐨 𝐭𝐡𝐞𝐦𝐞 𝐥𝐚𝐠𝐞 𝐧𝐚… 𝐦𝐨𝐧 𝐭𝐡𝐞𝐤𝐞 𝐦𝐨𝐧𝐞𝐫 𝐤𝐨𝐭𝐡𝐚 𝐛𝐞𝐫 𝐡𝐨𝐲! 🫶🌷",
"𓆩😴𓆪 〆 𝐁𝐨𝐬𝐬, 𝐠𝐡𝐮𝐦𝐚𝐧… 𝐧𝐨𝐢𝐥𝐞 𝐤𝐚𝐥𝐤𝐞 𝐚𝐩𝐧𝐢 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐝𝐞𝐛𝐞𝐧, 𝐚𝐫 𝐚𝐦𝐢 𝐬𝐰𝐚𝐩𝐧𝐞 𝐫𝐞𝐩𝐥𝐲 𝐝𝐞𝐛𝐨! 😂🌙",
"𓆩🫀𓆪 〆 𝐉𝐞 𝐦𝐚𝐧𝐮𝐬𝐡 𝐭𝐨𝐦𝐚𝐫 𝐧𝐢𝐫𝐨𝐛𝐭𝐚 𝐛𝐮𝐣𝐡𝐞, 𝐬𝐡𝐞𝐢 𝐦𝐚𝐧𝐮𝐬𝐡𝐭𝐚𝐤𝐞 𝐬𝐨𝐡𝐨𝐣𝐞 𝐡𝐚𝐫𝐢𝐲𝐨 𝐟𝐞𝐥𝐨 𝐧𝐚! 🖤✨",
"𓆩😹𓆪 〆 𝐌𝐮𝐬𝐤𝐚𝐧 𝐞𝐫 𝐛𝐫𝐚𝐢𝐧 𝐜𝐡𝐨𝐥𝐜𝐡𝐞 𝐭𝐡𝐢𝐧𝐤𝐢𝐧𝐠 𝐦𝐨𝐝𝐞-𝐞… 𝐤𝐞𝐮 𝐩𝐫𝐞𝐦 𝐤𝐨𝐫𝐞, 𝐚𝐫 𝐤𝐞𝐮 𝐩𝐫𝐞𝐦 𝐤𝐡𝐚𝐲! 🤣🍕",
"𓆩🌹𓆪 〆 𝐉𝐨𝐝𝐢 𝐤𝐨𝐤𝐡𝐨𝐧𝐨 𝐭𝐨𝐦𝐚𝐫 𝐦𝐨𝐧 𝐤𝐡𝐚𝐫𝐚𝐩 𝐡𝐨𝐲, 𝐦𝐨𝐧𝐞 𝐫𝐞𝐤𝐡𝐨… 𝐭𝐨𝐦𝐚𝐤𝐞 𝐬𝐨𝐛𝐬𝐡𝐨𝐦𝐨𝐲 𝐬𝐭𝐫𝐨𝐧𝐠 𝐭𝐡𝐚𝐤𝐭𝐞 𝐡𝐨𝐛𝐞 𝐧𝐚! 🫶❤️",
"𓆩⚡𓆪 〆 𝐌𝐮𝐬𝐤𝐚𝐧 𝐤𝐞𝐮𝐤𝐞 𝐚𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐝𝐞𝐤𝐡𝐚𝐲 𝐧𝐚… 𝐣𝐚𝐫𝐚 𝐯𝐚𝐥𝐨 𝐭𝐚𝐝𝐞𝐫 𝐬𝐚𝐭𝐡𝐞 𝐯𝐢𝐛𝐞, 𝐛𝐚𝐤𝐢𝐝𝐞𝐫 𝐬𝐚𝐭𝐡𝐞 𝐬𝐢𝐥𝐞𝐧𝐜𝐞! 😎🖤",
"𓆩💔𓆪 〆 𝐒𝐨𝐛 𝐛𝐢𝐝𝐚𝐲 𝐬𝐡𝐨𝐛𝐝𝐨 𝐝𝐢𝐲𝐞 𝐡𝐨𝐲 𝐧𝐚… 𝐤𝐢𝐜𝐡𝐮 𝐛𝐢𝐝𝐚𝐲 𝐬𝐡𝐮𝐝𝐡𝐮 𝐦𝐨𝐧𝐞𝐫 𝐯𝐢𝐭𝐨𝐫𝐞 𝐫𝐨𝐲𝐞 𝐣𝐚𝐲! 🥀🌧️",
"𓆩👑𓆪 〆 𝐁𝐨𝐬𝐬, 𝐥𝐢𝐟𝐞-𝐞 𝐡𝐞𝐫𝐨 𝐡𝐨𝐭𝐞 𝐡𝐨𝐥𝐞 𝐜𝐨𝐧𝐟𝐢𝐝𝐞𝐧𝐜𝐞 𝐥𝐚𝐠𝐞… 𝐚𝐫 𝐯𝐢𝐥𝐥𝐚𝐢𝐧 𝐡𝐨𝐭𝐞 𝐡𝐨𝐥𝐞 𝐨𝐧𝐥𝐲 𝐚𝐭𝐭𝐢𝐭𝐮𝐝𝐞! 😈🔥",
"𓆩🫶𓆪 〆 𝐌𝐮𝐬𝐤𝐚𝐧 𝐚𝐜𝐡𝐢 𝐁𝐨𝐬𝐬… 𝐭𝐨𝐦𝐚𝐫 𝐤𝐨𝐭𝐡𝐚 𝐬𝐡𝐮𝐧𝐛𝐨, 𝐣𝐮𝐝𝐠𝐞 𝐤𝐨𝐫𝐛𝐨 𝐧𝐚! 🖤🌸",
"𓆩💌𓆪 〆 𝐓𝐨𝐦𝐚𝐤𝐞 𝐜𝐚𝐢 𝐛𝐨𝐥𝐚𝐫 𝐚𝐠𝐞, 𝐦𝐨𝐧 𝐭𝐨𝐦𝐚𝐤𝐞 𝐜𝐡𝐞𝐲𝐞𝐜𝐡𝐞 𝐛𝐨𝐥𝐞… 𝐞𝐢 𝐣𝐮𝐝𝐝𝐡𝐨𝐭𝐚 𝐚𝐦𝐚𝐫 𝐧𝐢𝐣𝐞𝐫 𝐬𝐚𝐭𝐡𝐞! 🥹💗",
"𓆩🤣𓆪 〆 𝐀𝐦𝐚𝐫 𝐜𝐫𝐮𝐬𝐡 𝐚𝐦𝐚𝐤𝐞 𝐛𝐥𝐨𝐜𝐤 𝐤𝐨𝐫𝐞𝐜𝐡𝐞… 𝐞𝐤𝐡𝐨𝐧 𝐚𝐦𝐢 𝐧𝐢𝐣𝐞𝐤𝐞 𝐟𝐫𝐞𝐞 𝐟𝐢𝐫𝐞-𝐫 𝐛𝐨𝐭 𝐦𝐨𝐧𝐞 𝐤𝐨𝐫𝐢! 😭🎮",
"𓆩🌙𓆪 〆 𝐊𝐨𝐭𝐡𝐚 𝐤𝐨𝐦 𝐡𝐨𝐥𝐞𝐨 𝐦𝐢𝐬𝐬 𝐤𝐨𝐫𝐚 𝐤𝐨𝐦 𝐡𝐨𝐲 𝐧𝐚… 𝐤𝐢𝐜𝐡𝐮 𝐦𝐚𝐧𝐮𝐬𝐡 𝐝𝐮𝐫𝐞 𝐭𝐡𝐞𝐤𝐞𝐨 𝐤𝐚𝐜𝐡𝐞 𝐭𝐡𝐚𝐤𝐞! 🖤✨",
"𓆩😏𓆪 〆 𝐁𝐨𝐬𝐬, 𝐚𝐩𝐧𝐢 𝐤𝐢 𝐬𝐢𝐧𝐠𝐥𝐞? 𝐍𝐚𝐤𝐢 𝐦𝐨𝐧𝐞 𝐦𝐨𝐧𝐞 𝐜𝐨𝐦𝐦𝐢𝐭𝐭𝐞𝐝, 𝐬𝐨𝐜𝐢𝐚𝐥𝐥𝐲 𝐮𝐧𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞? 😂💀",
"𓆩💗𓆪 〆 𝐉𝐢𝐛𝐨𝐧𝐞 𝐞𝐤𝐣𝐨𝐧 𝐞𝐦𝐨𝐧 𝐦𝐚𝐧𝐮𝐬𝐡 𝐝𝐚𝐫𝐤𝐚𝐫… 𝐣𝐚𝐫 𝐤𝐚𝐜𝐡𝐞 𝐧𝐢𝐣𝐞𝐫 𝐦𝐨𝐭𝐨 𝐭𝐡𝐚𝐤𝐚 𝐣𝐚𝐲! 🌸🫶",
"𓆩😂𓆪 〆 𝐁𝐨𝐬𝐬, 𝐚𝐩𝐧𝐢 𝐣𝐨𝐤𝐞 𝐦𝐚𝐫𝐥𝐞𝐢 𝐡𝐚𝐬𝐡𝐢 𝐩𝐚𝐲 𝐧𝐚… 𝐤𝐢𝐧𝐭𝐮 𝐚𝐩𝐧𝐚𝐤𝐞 𝐝𝐞𝐤𝐡𝐞 𝐚𝐦𝐚𝐫 𝐡𝐚𝐬𝐡𝐢 𝐚𝐬𝐡𝐞! 🤣🖤",
"𓆩🥀𓆪 〆 𝐀𝐦𝐢 𝐤𝐚𝐫𝐨 𝐠𝐚𝐥𝐩𝐞𝐫 𝐯𝐢𝐥𝐥𝐚𝐢𝐧 𝐡𝐨𝐭𝐞 𝐜𝐚𝐢 𝐧𝐚… 𝐤𝐢𝐧𝐭𝐮 𝐬𝐨𝐛𝐚𝐢𝐤𝐞 𝐡𝐚𝐬𝐡𝐚𝐭𝐞 𝐡𝐚𝐬𝐡𝐚𝐭𝐞 𝐧𝐢𝐣𝐞𝐤𝐞 𝐡𝐚𝐫𝐢𝐲𝐞 𝐟𝐞𝐥𝐢! 🖤🌧️",
"𓆩👑𓆪 〆 𝐌𝐮𝐬𝐤𝐚𝐧-𝐤𝐞 𝐝𝐚𝐤𝐚 𝐦𝐚𝐧𝐞 𝐬𝐡𝐮𝐝𝐡𝐮 𝐫𝐞𝐩𝐥𝐲 𝐧𝐨𝐲… 𝐞𝐤𝐡𝐨𝐧 𝐭𝐡𝐞𝐤𝐞 𝐆𝐂-𝐭𝐞 𝐞𝐧𝐭𝐞𝐫𝐭𝐚𝐢𝐧𝐦𝐞𝐧𝐭 𝐟𝐫𝐞𝐞! 😂🎀",
"𓆩🖤𓆪 〆 𝐒𝐨𝐛𝐚𝐢 𝐭𝐨𝐦𝐚𝐤𝐞 𝐩𝐚𝐨𝐲𝐚𝐫 𝐣𝐨𝐧𝐧𝐨 𝐚𝐬𝐡𝐛𝐞 𝐧𝐚… 𝐭𝐚𝐢 𝐛𝐨𝐥𝐞 𝐧𝐢𝐣𝐞𝐫 𝐦𝐮𝐥𝐥𝐨 𝐤𝐨𝐦𝐢𝐲𝐨 𝐟𝐞𝐥𝐨 𝐧𝐚! 👑✨",
"𓆩🌸𓆪 〆 𝐌𝐮𝐬𝐤𝐚𝐧 𝐞𝐫 𝐞𝐤𝐭𝐚 𝐫𝐮𝐥𝐞: 𝐣𝐚𝐫𝐚 𝐯𝐚𝐥𝐨 𝐭𝐚𝐝𝐞𝐫 𝐬𝐚𝐭𝐡𝐞 𝐟𝐮𝐥𝐥 𝐚𝐝𝐝𝐚, 𝐣𝐚𝐫𝐚 𝐟𝐚𝐤𝐞 𝐭𝐚𝐝𝐞𝐫 𝐬𝐚𝐭𝐡𝐞 𝐟𝐮𝐥𝐥 𝐝𝐮𝐫𝐨𝐭𝐭𝐨! 😌🖤",
"𓆩💞𓆪 〆 𝐊𝐞𝐮 𝐣𝐨𝐝𝐢 𝐛𝐨𝐥𝐞 '𝐭𝐮𝐦𝐢 𝐚𝐦𝐚𝐫 𝐤𝐞?'… 𝐛𝐨𝐥𝐛𝐞 𝐧𝐚, '𝐚𝐦𝐢 𝐭𝐨𝐦𝐚𝐫 𝐬𝐡𝐚𝐧𝐭𝐢𝐭𝐞 𝐞𝐤𝐭𝐮 𝐝𝐮𝐬𝐡𝐭𝐮𝐦𝐢!' 😂❤️",
"𓆩🫀𓆪 〆 𝐌𝐨𝐧 𝐤𝐡𝐚𝐫𝐚𝐩 𝐭𝐡𝐚𝐤𝐥𝐞 𝐛𝐨𝐥𝐛𝐞… 𝐬𝐨𝐛 𝐬𝐨𝐦𝐨𝐲 𝐡𝐚𝐬𝐡𝐢 𝐝𝐢𝐲𝐞 𝐝𝐮𝐫𝐛𝐚𝐫 𝐦𝐚𝐧𝐮𝐬𝐡 𝐡𝐨𝐲𝐞 𝐭𝐡𝐚𝐤𝐭𝐞 𝐡𝐨𝐲 𝐧𝐚! 🥹🖤",
"𓆩🤣𓆪 〆 𝐁𝐨𝐬𝐬, 𝐌𝐮𝐬𝐤𝐚𝐧-𝐫 𝐬𝐚𝐭𝐡𝐞 𝐣𝐡𝐨𝐠𝐫𝐚 𝐤𝐨𝐫𝐛𝐞𝐧 𝐧𝐚… 𝐚𝐦𝐚𝐫 𝐥𝐨𝐠𝐢𝐜 𝐚𝐫 𝐚𝐩𝐧𝐚𝐫 𝐚𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐦𝐢𝐥𝐞 𝐆𝐂-𝐭𝐚 𝐡𝐚𝐬𝐩𝐚𝐭𝐚𝐥 𝐡𝐨𝐲𝐞 𝐣𝐚𝐛𝐞! 😂🚑",
"𓆩✨𓆪 〆 𝐌𝐮𝐬𝐤𝐚𝐧 𝐚𝐜𝐡𝐢… 𝐛𝐨𝐥𝐨 𝐁𝐨𝐬𝐬, 𝐚𝐣𝐤𝐞 𝐤𝐚𝐫 𝐦𝐨𝐧𝐞 𝐫𝐚𝐤𝐡𝐚𝐫 𝐦𝐨𝐭𝐨 𝐠𝐚𝐥𝐩𝐨 𝐬𝐡𝐮𝐧𝐛𝐨, 𝐧𝐚𝐤𝐢 𝐟𝐮𝐥𝐥 𝐫𝐨𝐚𝐬𝐭 𝐬𝐞𝐬𝐬𝐢𝐨𝐧? 😈🔥"
];

            // যদি শুধু কাস্টম নাম দিয়ে ডাকে (যেমন: baby, bby, janu)
            if (!arr) {
                const replyText = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                return api.sendMessage(replyText, event.threadID, (error, info) => {
                    if (info && global.GoatBot) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: this.config.name,
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                }, event.messageID);
            }

            // যদি নামের সাথে অন্য কিছু লেখে (যেমন: baby hi)
            const link = await baseApiUrl();
            const res = await axios.get(`${link}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`);
            const a = res.data.reply;

            await api.sendMessage(a, event.threadID, (error, info) => {
                if (info && global.GoatBot) {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID,
                        a
                    });
                }
            }, event.messageID);
        }
    } catch (err) {
        console.error(err);
    }
};
