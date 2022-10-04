const puppeteer = require("puppeteer");
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["-use-gl=egl", "--headless", "--no-sandbox"],
  });
  const page = await browser.newPage();
  page
    .on("console", (message) =>
      console.log(
        `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
      )
    )
    .on("pageerror", ({ message }) => console.log(message))
    .on("response", (response) =>
      console.log(`${response.status()} ${response.url()}`)
    )
    .on("requestfailed", (request) =>
      console.log(`${request.failure().errorText} ${request.url()}`)
    );

  await page.setViewport({
    width: 500,
    height: 500,
    deviceScaleFactor: 2,
  });

  const recorder = new PuppeteerScreenRecorder(page, { fps: 60 });

  await page.goto("http://localhost:3000");
  await page.waitForFunction(
    'document.querySelector("#status-text").innerText.includes("loaded map")'
  );

  await page.waitForSelector("#load-activity-button");
  await page.click("#load-activity-button");

  await page.waitForFunction(
    'document.querySelector("#status-text").innerText.includes("loaded activity")'
  );

  await delay(2000);

  console.log("Activity loaded");

  await page.waitForSelector("#play-button");
  await page.click("#play-button");
  console.log("Clicked play");

  await recorder.start("video.mp4");

  await page.waitForFunction(
    'document.querySelector("#status-text").innerText.includes("done")',
    { timeout: 60 * 1000 }
  );

  console.log("Status is done");

  await recorder.stop();
  console.log("Recording stopped");
  await browser.close();
  console.log("Closed");
})();
