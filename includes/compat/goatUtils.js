
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Maintained by: Siyam Hasan
// Original helper logic adapted from Goat Bot V2 (NTKhang, MIT License)
// https://github.com/ntkhang03/Goat-Bot-V2
// GoatBot-Pro (EryXenX)

let moment = null;
try {
    moment = require("moment-timezone");
} catch (error) {}

let mimeDB = {};
try {
    mimeDB = require("mime-db");
} catch (error) {}

const TIMEZONE = () =>
    (global.config &&
        (global.config.timeZone || global.config.TIMEZONE)) ||
    "Asia/Dhaka";

class CustomError extends Error {
    constructor(obj) {
        let message;

        if (typeof obj === "string") {
            message = obj;
        } else if (obj && obj.message) {
            message = obj.message;
        } else {
            try {
                message = JSON.stringify(obj);
            } catch (error) {
                message = String(obj);
            }
        }

        super(message || "Unknown error");

        if (obj && typeof obj === "object") {
            Object.assign(this, obj);
        }

        this.name = "CustomError";
    }
}

let chalk = null;

try {
    chalk = require("chalk");
} catch (error) {}

const paint = (fn, text) =>
    chalk && chalk[fn] ? chalk[fn](text) : text;

function makeLogger(label, color) {
    return (tag, ...rest) => {
        let msg = "";

        try {
            msg = rest.length
                ? rest.map(value => {
                    if (value instanceof Error) {
                        return value.stack || value.message;
                    }

                    if (typeof value === "object" && value !== null) {
                        try {
                            return JSON.stringify(value);
                        } catch (error) {
                            return String(value);
                        }
                    }

                    return String(value);
                }).join(" ")
                : "";
        } catch (error) {
            msg = String(tag);
        }

        const head = rest.length ? `[ ${tag} ]` : "";

        console.log(
            `${paint(color, `[${label}]`)} ${head} ${rest.length ? msg : tag}`
        );
    };
}

const log = Object.assign(makeLogger("INFO", "cyan"), {
    info: makeLogger("INFO", "cyan"),
    success: makeLogger("OK", "green"),
    warn: makeLogger("WARN", "yellow"),
    err: makeLogger("ERROR", "red"),
    error: makeLogger("ERROR", "red"),
    master: makeLogger("MASTER", "magenta"),
    dev: makeLogger("DEV", "blue")
});

function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}

function isNumber(value) {
    return value !== "" && value !== null &&
        value !== undefined && !isNaN(Number(value));
}

function randomString(max, onlyOnce = false, possible) {
    if (!Number.isInteger(Number(max)) || Number(max) <= 0) {
        max = 10;
    }

    max = Number(max);

    possible = possible ||
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    if (typeof possible !== "string" || possible.length === 0) {
        throw new Error("The possible characters must be a non-empty string");
    }

    if (onlyOnce && max > new Set(possible).size) {
        throw new Error("Not enough unique characters available");
    }

    let text = "";

    for (let i = 0; i < max; i++) {
        let random = Math.floor(Math.random() * possible.length);

        if (onlyOnce) {
            while (text.includes(possible[random])) {
                random = Math.floor(Math.random() * possible.length);
            }
        }

        text += possible[random];
    }

    return text;
}

function randomNumber(min, max) {
    if (max === undefined || max === null) {
        max = min;
        min = 0;
    }

    if (!isNumber(min)) {
        throw new Error("The first argument (min) must be a number");
    }

    if (!isNumber(max)) {
        throw new Error("The second argument (max) must be a number");
    }

    min = Number(min);
    max = Number(max);

    if (min > max) {
        throw new Error("The minimum value cannot exceed the maximum value");
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeHomeDir(fullPath) {
    if (!fullPath || typeof fullPath !== "string") {
        throw new Error("The first argument (fullPath) must be a string");
    }

    const home = process.cwd();

    while (fullPath.includes(home)) {
        fullPath = fullPath.replace(home, "");
    }

    return fullPath;
}

function splitPage(arr, limit) {
    if (!Array.isArray(arr)) {
        throw new Error("The first argument must be an array");
    }

    if (!Number.isInteger(limit) || limit <= 0) {
        throw new Error("The second argument (limit) must be a positive integer");
    }

    const allPage = [];

    for (let i = 0; i < arr.length; i += limit) {
        allPage.push(arr.slice(i, i + limit));
    }

    return {
        totalPage: allPage.length,
        allPage
    };
}

function formatNumber(number) {
    if (!isNumber(number)) {
        throw new Error("The first argument (number) must be a number");
    }

    return Number(number).toLocaleString(
        (global.config && global.config.language) || "en-US"
    );
}

function convertTime(
    miliSeconds,
    replaceSeconds = "s",
    replaceMinutes = "m",
    replaceHours = "h",
    replaceDays = "d",
    replaceMonths = "M",
    replaceYears = "y",
    notShowZero = false
) {
    if (!isNumber(miliSeconds) || Number(miliSeconds) < 0) {
        throw new Error("The first argument must be a non-negative number");
    }

    if (typeof replaceSeconds === "boolean") {
        notShowZero = replaceSeconds;
        replaceSeconds = "s";
    }

    const second = Math.floor(miliSeconds / 1000 % 60);
    const minute = Math.floor(miliSeconds / 1000 / 60 % 60);
    const hour = Math.floor(miliSeconds / 1000 / 60 / 60 % 24);
    const day = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 % 30);
    const month = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 / 30 % 12);
    const year = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 / 30 / 12);

    let formattedDate = "";

    const parts = [
        { value: year, replace: replaceYears },
        { value: month, replace: replaceMonths },
        { value: day, replace: replaceDays },
        { value: hour, replace: replaceHours },
        { value: minute, replace: replaceMinutes },
        { value: second, replace: replaceSeconds }
    ];

    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];

        if (p.value) {
            formattedDate += p.value + p.replace;
        } else if (formattedDate !== "") {
            formattedDate += "00" + p.replace;
        } else if (i === parts.length - 1) {
            formattedDate += "0" + p.replace;
        }
    }

    if (formattedDate === "") {
        formattedDate = "0" + replaceSeconds;
    }

    if (notShowZero) {
        formattedDate = formattedDate.replace(/00\w+/g, "");
    }

    return formattedDate;
}

function getTime(timestamps, format) {
    if (!format && typeof timestamps === "string") {
        format = timestamps;
        timestamps = undefined;
    }

    if (!moment) {
        return new Date(timestamps || Date.now()).toISOString();
    }

    return moment(timestamps).tz(TIMEZONE()).format(format);
}

function getPrefix(threadID) {
    const fallback = (global.config && global.config.PREFIX) || "/";

    try {
        const t =
            global.data &&
            global.data.threadData &&
            global.data.threadData.get(String(threadID));

        if (t && t.PREFIX) return t.PREFIX;
        if (t && t.data && t.data.prefix) return t.data.prefix;
    } catch (error) {}

    return fallback;
}

function getExtFromAttachmentType(type) {
    switch (type) {
        case "photo":
            return "png";
        case "animated_image":
            return "gif";
        case "video":
            return "mp4";
        case "audio":
            return "mp3";
        default:
            return "txt";
    }
}

function getExtFromMimeType(mimeType = "") {
    const type = String(mimeType).split(";")[0].trim().toLowerCase();

    return mimeDB[type]
        ? (mimeDB[type].extensions || [])[0] || "unknown"
        : "unknown";
}

function getExtFromUrl(url = "") {
    if (!url || typeof url !== "string") {
        throw new Error("The first argument (url) must be a string");
    }

    try {
        const parsed = new URL(url);
        const ext = path.extname(parsed.pathname).replace(".", "");

        if (ext) return ext;
    } catch (error) {}

    return "noext";
}

async function downloadFile(url = "", filePath = "") {
    if (!url || typeof url !== "string") {
        throw new Error("The first argument (url) must be a string");
    }

    if (!filePath || typeof filePath !== "string") {
        throw new Error("The second argument (path) must be a string");
    }

    let response;

    try {
        response = await axios.get(url, {
            responseType: "arraybuffer"
        });
    } catch (error) {
        throw new CustomError(
            error.response ? error.response.data : error
        );
    }

    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, Buffer.from(response.data));

    return filePath;
}

async function getStreamFromURL(url = "", pathName = "", options = {}) {
    if (pathName && typeof pathName === "object") {
        options = pathName;
        pathName = "";
    }

    if (!url || typeof url !== "string") {
        throw new Error("The first argument (url) must be a string");
    }

    if (!options || typeof options !== "object" || Array.isArray(options)) {
        options = {};
    }

    const response = await axios({
        ...options,
        url,
        method: "GET",
        responseType: "stream"
    });

    if (!pathName) {
        const contentType = response.headers["content-type"] || "";
        const ext = contentType
            ? getExtFromMimeType(String(contentType))
            : "noext";

        pathName = randomString(10) + "." + ext;
    }

    response.data.path = pathName;

    return response.data;
}

async function getStreamsFromAttachment(attachments) {
    if (!Array.isArray(attachments)) {
        throw new Error("The attachments argument must be an array");
    }

    const streams = await Promise.all(
        attachments.map(async attachment => {
            if (!attachment || !attachment.url) {
                throw new Error("Invalid attachment URL");
            }

            const ext = getExtFromUrl(attachment.url);

            const response = await axios({
                url: attachment.url,
                method: "GET",
                responseType: "stream"
            });

            response.data.path =
                randomString(10) + "." + ext;

            return response.data;
        })
    );

    return streams;
}

async function translate(text, lang = "en") {
    if (typeof text !== "string") {
        throw new Error("The first argument (text) must be a string");
    }

    try {
        const response = await axios.get(
            "https://translate.googleapis.com/translate_a/single",
            {
                params: {
                    client: "gtx",
                    sl: "auto",
                    tl: lang,
                    dt: "t",
                    q: text
                }
            }
        );

        return (response.data[0] || [])
            .map(item => item[0])
            .join("");
    } catch (error) {
        throw new CustomError(
            error.response ? error.response.data : error
        );
    }
}

async function shortenURL(url) {
    if (!url || typeof url !== "string") {
        throw new Error("The URL must be a valid string");
    }

    try {
        const response = await axios.get(
            "https://tinyurl.com/api-create.php",
            {
                params: { url }
            }
        );

        return response.data;
    } catch (error) {
        throw new CustomError(
            error.response ? error.response.data : error
        );
    }
}

async function findUid(link) {
    if (!link || typeof link !== "string") {
        throw new Error("The Facebook link must be a valid string");
    }

    try {
        const response = await axios.post(
            "https://seomagnifier.com/fbid",
            new URLSearchParams({
                facebook: "1",
                sitelink: link
            }),
            {
                headers: {
                    "content-type":
                        "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }
        );

        const id = String(response.data).trim();

        if (/^\d+$/.test(id)) {
            return id;
        }

        const cheerio = require("cheerio");
        const html = await axios.get(link);
        const $ = cheerio.load(html.data);

        const element = $('meta[property="al:android:url"]')
            .attr("content");

        if (!element) {
            throw new Error("UID not found");
        }

        return element.split("/").pop();
    } catch (error) {
        throw new Error(
            "An unexpected error occurred. Please try again."
        );
    }
}

const notSupported = name => async () => {
    throw new Error(
        `global.utils.${name} is not supported in the Mirai+Goat hybrid runtime.`
    );
};

const drive = {
    getFile: notSupported("drive.getFile"),
    uploadFile: notSupported("drive.uploadFile"),
    deleteFile: notSupported("drive.deleteFile")
};

module.exports = {
    CustomError,
    log,
    getType,
    isNumber,
    randomString,
    randomNumber,
    removeHomeDir,
    splitPage,
    formatNumber,
    convertTime,
    getTime,
    getPrefix,
    getExtFromAttachmentType,
    getExtFromMimeType,
    getExtFromUrl,
    downloadFile,
    getStreamFromURL,
    getStreamsFromAttachment,
    translate,
    translateAPI: translate,
    shortenURL,
    findUid,
    drive,
    uploadImgbb: notSupported("uploadImgbb"),
    uploadZippyshare: notSupported("uploadZippyshare"),
    loadScripts: notSupported("loadScripts"),
    unloadScripts: notSupported("unloadScripts"),
    getText: (_opts, key) => String(key)
};
