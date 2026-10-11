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
"꧁༒☬ 𝐌𝐔𝐒𝐊𝐀𝐍 ☬༒꧂ 〆 𝐁𝐨𝐥𝐨 𝐁𝐨𝐬𝐬!",
"『亗』𝑯𝒖𝒎𝒎... 𝑴𝒖𝒔𝒌𝒂𝒏 𝒔𝒉𝒖𝒏𝒄𝒉𝒆 〆",
"𓆩♛𓆪 𝓚𝓮 𝓭𝓪𝓴𝓵𝓸? 𝓜𝓾𝓼𝓴𝓪𝓷 𝓱𝓪𝔃𝓲𝓻!",
"╭━━━〔 𝐌𝐔𝐒𝐊𝐀𝐍 〕━━━╮ 𝐁𝐨𝐥𝐨 𝐤𝐢 𝐡𝐨𝐥𝐨?",
"༺═──────── 𝙈𝙪𝙨𝙠𝙖𝙣 ────────═༻",
"𖤍 𝕐𝕖𝕤𝕤 𝔹𝕠𝕤𝕤, 𝕓𝕠𝕝𝕠 𝕜𝕚 𝕜𝕙𝕠𝕓𝕠𝕣?",
"⫷ 𝖬𝗎𝗌𝗄𝖺𝗇 𝖨𝗌 𝖧𝖾𝗋𝖾 ⫸ 〆",
"꧁𓊈𒆜 𝓜𝓾𝓼𝓴𝓪𝓷 𒆜𓊉꧂",
"┏━━━♛ 𝐌𝐔𝐒𝐊𝐀𝐍 ♛━━━┓ 𝐁𝐨𝐥𝐨!",
"╰┈➤ 𝑩𝒐𝒍𝒐 𝒋𝒂𝒏𝒂𝒃, 𝑴𝒖𝒔𝒌𝒂𝒏 𝒂𝒄𝒉𝒆!",
"『 𝐁𝐀𝐁𝐘 』 𝓗𝓾𝓶𝓶, 𝓫𝓸𝓵𝓸 𝓴𝓲 𝓬𝓪𝓸?",
"⸙ 𝙊𝙞 𝙗𝙖𝙗𝙪, 𝙈𝙪𝙨𝙠𝙖𝙣 𝙚𝙠𝙝𝙖𝙣𝙚!",
"𓆩⚜𓆪 𝕂𝕖 𝕒𝕞𝕒𝕜𝕖 𝕕𝕒𝕜𝕔𝕙𝕖?",
"༒︎ 𝐀𝐝𝐝𝐚 𝐑𝐚𝐧𝐢 𝐌𝐮𝐬𝐤𝐚𝐧 𝐚𝐬𝐜𝐡𝐞 〆",
"╰┈⫷ 𝑺𝒊𝒓 𝒃𝒐𝒍𝒆𝒏, 𝒌𝒊 𝒍𝒂𝒈𝒃𝒆? ⫸",
"𓂀 𝙈𝙪𝙨𝙠𝙖𝙣 𝙊𝙣𝙡𝙞𝙣𝙚 — 𝘼𝙙𝙙𝙖 𝙊𝙣!",
"꧁༺ 𝕄𝕦𝕤𝕜𝕒𝕟 𝕄𝕒𝕕𝕒𝕞 ༻꧂",
"『亗』𝐊𝐨𝐢 𝐠𝐞𝐥𝐞? 𝐌𝐮𝐬𝐤𝐚𝐧 𝐭𝐨 𝐚𝐜𝐡𝐞!",
"⟡ 𝓐𝓻𝓮 𝓫𝓪𝓹𝓻𝓮, 𝓮𝓽𝓸 𝓭𝓪𝓴𝓪𝓭𝓪𝓴𝓲 𝓴𝓮𝓷?",
"╭─〔 𝙈𝙐𝙎𝙆𝘼𝙉 〕─╮ 𝙎𝙖𝙮 𝙎𝙤𝙢𝙚𝙩𝙝𝙞𝙣𝙜!",
"༺♛༻ 𝑴𝒖𝒔𝒌𝒂𝒏 𝒆𝒓 𝒆𝒏𝒕𝒓𝒚, 𝑮𝑪 𝒆𝒓 𝒔𝒕𝒚𝒍𝒆!",
"𓆩〆𓆪 𝖡𝗈𝗅𝗈 𝖡𝗈𝗌𝗌, 𝖬𝗎𝗌𝗄𝖺𝗇 𝗋𝖾𝖺𝖽𝗒!",
"『♛』𝕄𝕦𝕤𝕜𝕒𝕟 𝕒𝕔𝕙𝕖, 𝕔𝕙𝕚𝕟𝕥𝕒 𝕟𝕒𝕚!",
"꧁𓊈 𝐘𝐞𝐬𝐬 𝐃𝐞𝐚𝐫, 𝐁𝐨𝐥𝐨 𝐍𝐚 𓊉꧂",
"⫷ 𝙆𝙚 𝙙𝙖𝙠𝙚? 𝙈𝙖𝙙𝙖𝙢 𝙐𝙥𝙤𝙨𝙩𝙝𝙞𝙩! ⫸",
"༄ 𝓑𝓸𝓵𝓸 𝓫𝓪𝓫𝔂, 𝓜𝓾𝓼𝓴𝓪𝓷 𝓼𝓱𝓾𝓷𝓬𝓱𝓮",
"╰━━➤ 𝐊𝐢 𝐡𝐨𝐥𝐨 𝐁𝐨𝐬𝐬? 𝐀𝐝𝐝𝐚 𝐣𝐨𝐦𝐛𝐞!",
"𖤐 𝕄𝕦𝕤𝕜𝕒𝕟 𝕂𝕖? 𝕋𝕒𝕘 𝕜𝕠𝕣𝕠, 𝕙𝕒𝕫𝕚𝕣!",
"『 𝑱𝒂𝒂𝒏 』 𝑯𝒖𝒎𝒎, 𝒌𝒊 𝒉𝒐𝒍𝒐 𝒂𝒃𝒂𝒓?",
"꧁༒ 𝐌𝐮𝐬𝐤𝐚𝐧 𝐄𝐫 𝐃𝐚𝐫𝐛𝐚𝐫 ༒꧂",

"『 𝕂𝕚 𝕣𝕖, 𝕒𝕞𝕒𝕜𝕖 𝕕𝕒𝕜𝕝𝕖 𝕓𝕙𝕠𝕪 𝕡𝕒𝕔𝕔𝕙𝕠? 』",
"꧁𓊈 𝙈𝙪𝙨𝙠𝙖𝙣 𝙚𝙧 𝙨𝙚𝙧𝙫𝙞𝙘𝙚 𝙛𝙧𝙚𝙚 𝙣𝙖 𓊉꧂",
"༺ 𝐁𝐨𝐬𝐬, 𝐝𝐚𝐤𝐥𝐞𝐢 𝐚𝐬𝐡𝐢 — 𝐛𝐢𝐥 𝐩𝐨𝐫𝐞 𝐝𝐢𝐨! ༻",
"⫷ 𝑨𝒓𝒆 𝒔𝒊𝒓, 𝑮𝑪 𝒏𝒂𝒌𝒊 𝒏𝒂𝒕𝒐𝒌𝒆𝒓 𝒔𝒕𝒂𝒈𝒆? ⫸",
"𓆩♛𓆪 𝕄𝕦𝕤𝕜𝕒𝕟 𝕖𝕣 𝕞𝕠𝕠𝕕 𝕣𝕠𝕪𝕒𝕝!",
"╭━━〔 𝙁𝙐𝙉𝙉𝙔 𝙈𝙊𝘿𝙀 〕━━╮ 𝙃𝙖𝙨𝙝𝙗𝙖 𝙣𝙖𝙠𝙞?",
"꧁༺ 𝓜𝓾𝓼𝓴𝓪𝓷 𝓮𝓻 𝓱𝓪𝓼𝓲, 𝓖𝓒 𝓮𝓻 𝓷𝓪𝓼𝓱𝓪 ༻꧂",
"『亗』𝖤𝗍𝗈 𝗌𝖾𝗋𝗂𝗈𝗎𝗌 𝗄𝖾𝗇? 𝖢𝗁𝗂𝗅𝗅 𝗄𝗈𝗋𝗈!",
"༒︎ 𝐀𝐝𝐝𝐚 𝐤𝐨𝐫𝐭𝐞 𝐚𝐬𝐡𝐜𝐡𝐢, 𝐣𝐡𝐨𝐠𝐫𝐚 𝐧𝐚 𝐤𝐨𝐫𝐨!",
"𓂃 𝑴𝒖𝒔𝒌𝒂𝒏 𝒆𝒓 𝒃𝒓𝒂𝒊𝒏 𝒂𝒋 𝒖𝒏𝒅𝒆𝒓 𝒎𝒂𝒊𝒏𝒕𝒆𝒏𝒂𝒏𝒄𝒆",
"⟡ 𝕂𝕖 𝕒𝕞𝕒𝕜𝕖 𝕔𝕙𝕒𝕪? 𝕋𝕖𝕒 𝕓𝕚𝕝 𝕥𝕠𝕞𝕒𝕣!",
"꧁ 𝙈𝙪𝙨𝙠𝙖𝙣 𝙚𝙨𝙚𝙘𝙝𝙚, 𝙨𝙤𝙗𝙖𝙞 𝙨𝙖𝙫𝙙𝙝𝙖𝙣! ꧂",
"『♛』𝐀𝐦𝐚𝐤𝐞 𝐭𝐚𝐠 𝐤𝐨𝐫𝐨, 𝐆𝐂 𝐞𝐫 𝐣𝐨𝐤𝐞 𝐚𝐬𝐛𝐞!",
"༺ 𝓜𝓾𝓼𝓴𝓪𝓷 𝓶𝓪𝓷𝓮 𝓪𝓭𝓭𝓪, 𝓪𝓭𝓭𝓪 𝓶𝓪𝓷𝓮 𝓶𝓪𝓼𝓽𝓲 ༻",
"𖤍 𝕄𝕦𝕤𝕜𝕒𝕟 𝕖𝕣 𝕣𝕖𝕡𝕝𝕪 𝕕𝕖𝕜𝕙𝕖 𝕛𝕒𝕠!",
"╰┈➤ 𝑲𝒊 𝒃𝒐𝒔𝒔, 𝒂𝒋𝒌𝒆 𝒏𝒂𝒕𝒐𝒌 𝒌𝒐𝒕𝒐 𝒑𝒂𝒓𝒕?",
"⫷ 𝙈𝙪𝙨𝙠𝙖𝙣 𝙚𝙧 𝙖𝙩𝙩𝙞𝙩𝙪𝙙𝙚, 𝙨𝙤𝙗𝙖𝙧 𝙗𝙖𝙮𝙧𝙚 ⫸",
"꧁༒ 𝐁𝐨𝐬𝐬 𝐝𝐚𝐤𝐥𝐞 𝐌𝐮𝐬𝐤𝐚𝐧 𝐚𝐬𝐛𝐞, 𝐫𝐨𝐛𝐨𝐭 𝐧𝐚! ༒꧂",
"『 𝕄𝕠𝕠𝕕 𝕠𝕗𝕗? 𝔾ℂ 𝕥𝕖 𝕛𝕠𝕜𝕖 𝕕𝕒𝕠! 』",
"𓆩〆𓆪 𝐌𝐮𝐬𝐤𝐚𝐧 𝐢𝐬 𝐧𝐨𝐭 𝐛𝐨𝐫𝐢𝐧𝐠, 𝐛𝐨𝐬𝐬!",

"꧁𓊈 𝓜𝓸𝓷 𝓴𝓱𝓪𝓻𝓪𝓹? 𝓜𝓾𝓼𝓴𝓪𝓷 𝓪𝓬𝓱𝓮 𓊉꧂",
"『 𝑨𝒎𝒊 𝒂𝒄𝒉𝒊, 𝒃𝒐𝒍𝒐 𝒎𝒐𝒏𝒆𝒓 𝒌𝒐𝒕𝒉𝒂 』",
"༺ 𝐇𝐚𝐬𝐡𝐢 𝐝𝐢𝐲𝐞 𝐝𝐞𝐤𝐡𝐚𝐢, 𝐦𝐨𝐧 𝐭𝐚 𝐤𝐞𝐮 𝐝𝐞𝐤𝐡𝐞 𝐧𝐚 ༻",
"𓂃 𝙈𝙪𝙨𝙠𝙖𝙣 𝙘𝙝𝙪𝙥 𝙢𝙖𝙣𝙚 𝙢𝙤𝙤𝙙 𝙤𝙛𝙛",
"⟡ 𝕊𝕠𝕓 𝕥𝕙𝕚𝕜 𝕒𝕔𝕙𝕖 𝕓𝕠𝕝𝕚, 𝕜𝕚𝕟𝕥𝕦 𝕞𝕠𝕟 𝕞𝕒𝕟𝕖 𝕟𝕒",
"꧁༒ 𝐀𝐣 𝐞𝐤𝐭𝐮 𝐬𝐡𝐚𝐧𝐭𝐢 𝐜𝐡𝐚𝐢 ༒꧂",
"『♛』𝓜𝓸𝓷𝓮𝓻 𝓴𝓸𝓽𝓱𝓪 𝓼𝓸𝓫𝓼𝓸𝓶𝓸𝔂 𝓫𝓸𝓵𝓪 𝓳𝓪𝔂 𝓷𝓪",
"𓆩♡𓆪 𝐌𝐮𝐬𝐤𝐚𝐧 𝐚𝐜𝐡𝐞, 𝐭𝐨𝐦𝐚𝐫 𝐤𝐨𝐭𝐡𝐚 𝐬𝐡𝐮𝐧𝐛𝐨",
"╰┈➤ 𝑴𝒐𝒏 𝒌𝒉𝒂𝒓𝒂𝒑 𝒉𝒐𝒍𝒆 𝒆𝒌𝒕𝒖 𝒂𝒅𝒅𝒂 𝒅𝒊𝒊",
"༄ 𝙈𝙪𝙨𝙠𝙖𝙣 𝙝𝙖𝙨𝙝𝙚, 𝙠𝙞𝙣𝙩𝙪 𝙢𝙤𝙣 𝙘𝙝𝙪𝙥",
"『 𝐀𝐦𝐚𝐤𝐞 𝐝𝐚𝐤𝐥𝐞 𝐚𝐬𝐡𝐢, 𝐤𝐢𝐜𝐡𝐮 𝐛𝐨𝐥𝐭𝐞 𝐧𝐚 𝐩𝐚𝐫𝐥𝐞𝐨 𝐩𝐚𝐬𝐡𝐞 𝐭𝐡𝐚𝐤𝐨 』",
"⸙ 𝕄𝕠𝕠𝕕 𝕠𝕗𝕗 𝕙𝕠𝕝𝕖𝕠 𝕄𝕦𝕤𝕜𝕒𝕟 𝕥𝕠 𝕒𝕔𝕙𝕖",
"𓆩〆𓆪 𝓔𝓴𝓽𝓾 𝓱𝓪𝓼𝓲, 𝓮𝓴𝓽𝓾 𝓪𝓭𝓭𝓪, 𝓪𝓻 𝓮𝓴𝓽𝓾 𝓼𝓱𝓪𝓷𝓽𝓲",
"꧁༺ 𝙎𝙝𝙪𝙣𝙩𝙚 𝙥𝙖𝙧𝙞, 𝙗𝙤𝙡𝙤 𝙠𝙞 𝙝𝙤𝙮𝙚𝙘𝙝𝙚? ༻꧂",
"『 𝑩𝒐𝒍𝒐 𝒃𝒐𝒔𝒔, 𝑴𝒖𝒔𝒌𝒂𝒏 𝒍𝒊𝒔𝒕𝒆𝒏𝒊𝒏𝒈 』",

"╭━━〔 𝙍𝙊𝙔𝘼𝙇 𝙈𝙊𝙊𝘿 〕━━╮",
"꧁༒☬ 𝕄𝕌𝕊𝕂𝔸ℕ ☬༒꧂ 𝕋𝕙𝕖 𝔸𝕕𝕕𝕒 ℚ𝕦𝕖𝕖𝕟",
"𓆩♛𓆪 𝑴𝒖𝒔𝒌𝒂𝒏 𝒆𝒓 𝒔𝒕𝒚𝒍𝒆, 𝒄𝒐𝒑𝒚 𝒌𝒐𝒓𝒂 𝒋𝒂𝒚 𝒏𝒂",
"『亗』𝐍𝐚𝐦 𝐌𝐮𝐬𝐤𝐚𝐧, 𝐯𝐢𝐛𝐞 𝐑𝐨𝐲𝐚𝐥!",
"༺═──────── 𝙎𝙩𝙮𝙡𝙚 𝙊𝙣 ────────═༻",
"𖤐 𝕄𝕦𝕤𝕜𝕒𝕟 𝕖𝕣 𝕒𝕥𝕥𝕚𝕥𝕦𝕕𝕖, 𝕤𝕠𝕓𝕒𝕣 𝕥𝕙𝕖𝕜𝕖 𝕒𝕝𝕒𝕕𝕒",
"꧁𓊈 𝐌𝐮𝐬𝐤𝐚𝐧 𝐄𝐧𝐭𝐫𝐲 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞 𓊉꧂",
"⫷ 𝑴𝒖𝒔𝒌𝒂𝒏 𝑨𝒄𝒉𝒆, 𝑮𝑪 𝑩𝒂𝒄𝒉𝒆 ⫸",
"╰┈➤ 𝙆𝙚 𝙙𝙖𝙠𝙡𝙚 𝙖𝙨𝙝𝙞, 𝙠𝙚 𝙣𝙖 𝙙𝙖𝙠𝙡𝙡𝙚 𝙩𝙖𝙤 𝙖𝙘𝙝𝙞",
"꧁༒ 𝐌𝐔𝐒𝐊𝐀𝐍 — 𝐀𝐃𝐃𝐀 𝐋𝐄𝐆𝐄𝐍𝐃 ༒꧂"
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
