import puppeteer from "puppeteer";
import fetch from "node-fetch";

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto("https://bc.game/game/aviator-by-spribe", { waitUntil: "networkidle2" });
  console.log("🛩️ Bot iniciado...");

  while (true) {
    try {
      await page.waitForSelector(".game-crash-point", { timeout: 40000 });
      const txt = await page.$eval(".game-crash-point", el => el.innerText);
      const multiplier = parseFloat(txt.replace("x", ""));
      console.log("🎯 Crash detectado:", multiplier);

      await fetch("https://1e6e1490-73d9-4308-93a0-6b3a6583bffc-00-11r4z0lfb7o9v.riker.replit.dev/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ round: `Auto-${Date.now()}`, multiplier })
      });

      console.log("✅ Enviado al dashboard");
      await page.waitForTimeout(15000);
    } catch {
      console.log("⌛ Esperando nueva ronda...");
    }
  }
})();
