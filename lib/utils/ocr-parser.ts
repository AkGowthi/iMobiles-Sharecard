
export const parseOCRText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    // Heuristics for Indian formats
    // Phone: +91, 044-, 10 digits
    const phoneRegex = /(\+91[\-\s]?)?[6789]\d{9}|(\d{3,4}[\-\s]?\d{6,8})/g;
    // Email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    // Website
    const websiteRegex = /(https?:\/\/)?(www\.)?[\w-]+\.\w+(\.\w+)?/g;

    const phones = text.match(phoneRegex) || [];
    const emails = text.match(emailRegex) || [];
    const websites = text.match(websiteRegex) || [];

    // Name heuristic: 
    // Often 1st or 2nd line. Avoid lines that look like company names (Pvt Ltd, Inc) or addresses.
    let name = "";
    for (const line of lines) {
        if (line.length < 3) continue;
        if (line.match(emailRegex) || line.match(phoneRegex) || line.match(websiteRegex)) continue;
        if (line.toLowerCase().includes("pvt") || line.toLowerCase().includes("ltd") || line.toLowerCase().includes("road") || line.toLowerCase().includes("nagar")) continue;
        // Assume potential name
        name = line;
        break;
    }

    // Company heuristic: similar logic but looking for keywords or subsequent lines
    let company = "";
    for (const line of lines) {
        if (line === name) continue;
        if (line.match(/pvt|ltd|inc|group|solutions|technologies|enterprises/i)) {
            company = line;
            break;
        }
    }
    // If no company keyword, take the line after name (fallback)
    if (!company && lines.indexOf(name) !== -1 && lines[lines.indexOf(name) + 1]) {
        company = lines[lines.indexOf(name) + 1];
    }

    return {
        name: userFriendlyFormat(name),
        email: emails[0] || "",
        phone: phones[0] || "",
        website: websites[0] || "",
        company: userFriendlyFormat(company),
        designation: "", // Hard to guess accurately without NLP
        address: "", // Address parsing is complex multi-line
        notes: text
    };
};

function userFriendlyFormat(str: string) {
    return str.trim().replace(/[^\w\s&.-]/g, ''); // Remove regex artifacts
}
