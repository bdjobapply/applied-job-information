// === Configuration ===
const TELEGRAM_TOKEN = "7912499946:AAFpE34PEArOhekEa0e59qZLfnmDsKgfL7M";
const TELEGRAM_CHAT_ID = "7079142411";

// === Form & Loading ===
const form = document.getElementById("jobForm");
const loadingDiv = document.getElementById("loading");

// === Default Apply Date ===
const applyDateField = document.getElementById("applyDate");
const today = new Date().toISOString().split("T")[0];
applyDateField.value = today;

// === Helper: Format date to dd-mm-yyyy ===
function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// === Function to send file to Telegram ===
async function sendFile(file) {
  if (file) {
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("document", file);
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
        method: "POST",
        body: formData
      });
    } catch (err) {
      console.error("❌ Telegram File Error:", err);
    }
  }
}

// === Form Submit ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  loadingDiv.style.display = "flex";

  // Collect data
  const data = {
    applyDate: formatDate(document.getElementById("applyDate").value),
    circularDate: formatDate(document.getElementById("circularDate").value),
    orgName: document.getElementById("orgName").value,
    postName: document.getElementById("postName").value,
    postCount: document.getElementById("postCount").value,
    grade: document.getElementById("grade").value,
    priority: document.getElementById("priority").value,
    applyLink: document.getElementById("applyLink").value,
    paymentAmount: document.getElementById("paymentAmount").value,
    smsNumber: document.getElementById("smsNumber").value,
    userId: document.getElementById("userId").value,
    password: document.getElementById("password").value
  };

  // === CSV line (no quotes, only commas) ===
  const csvLine = [
  data.applyDate,
  data.circularDate,
  data.orgName,
  data.postName,
  data.postCount,
  data.grade,
  data.priority,
  data.applyLink,
  data.paymentAmount,
  data.smsNumber,
  data.userId,
  data.password
].map(value => `"${value}"`).join(",");

  // === Telegram text message ===
  const textMessage =
    `📝 চাকরির আবেদন সংক্রান্ত তথ্যঃ\n\n` +
    `📅 আবেদনের তারিখ: ${data.applyDate}\n` +
    `📅 বিজ্ঞপ্তির তারিখ: ${data.circularDate}\n` +
    `🏢 প্রতিষ্ঠান: ${data.orgName}\n` +
    `📌 পদ: ${data.postName}\n` +
    `🔢 পদসংখ্যা: ${data.postCount}\n` +
    `🎖️ গ্রেড: ${data.grade}\n` +
    `⭐ অগ্রাধিকার: ${data.priority}\n` +
    `🔗 লিংক: ${data.applyLink}\n` +
    `💰 পেমেন্ট: ${data.paymentAmount}\n` +
    `📲 টেলিটক নম্বর: ${data.smsNumber}\n` +
    `👤 ইউজার আইডি: ${data.userId}\n` +
    `🔑 পাসওয়ার্ড: ${data.password}\n\n` +
    `📊 Sheet-ready CSV:\n${csvLine}`;

  try {
    // === Send text to Telegram ===
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: textMessage })
    });

    // === Send files to Telegram ===
    await sendFile(document.getElementById("circularFile")?.files[0]);
    await sendFile(document.getElementById("applicationCopy")?.files[0]);

    alert("✅ ডেটা সফলভাবে সাবমিট হয়েছে।");
    form.reset();
    applyDateField.value = today;

  } catch (err) {
    console.error("❌ Error:", err);
    alert("❌ ডেটা পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করুন!");
  } finally {
    loadingDiv.style.display = "none";
  }
});
