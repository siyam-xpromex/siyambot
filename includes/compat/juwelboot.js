
const path = require("path");

if (path.basename(process.argv[1] || "") === "Main.js") {
    try {
        require("../../Script/commands/juwelalert.js");
    } catch (error) {
        console.error("[siyamboot] juwelalert load failed:", error.message);
    }
}
