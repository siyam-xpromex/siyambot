
const path = require("path");

if (path.basename(process.argv[1] || "") === "Main.js") {
    try {
        require("../../Script/commands/siyamalert.js");
    } catch (error) {
        console.error("[siyamboot] siyamalert load failed:", error.message);
    }
}
