const puppeteer = require('puppeteer-extra')
const fs = require('fs').promises;

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const sleep = ms => new Promise(r => setTimeout(r, ms));

//save cookie function
const saveCookie = async (page) => {
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies, null, 2);
    await fs.writeFile('./cookies.json', cookieJson);
}

//load cookie function
const loadCookie = async (page) => {
    const cookieJson = await fs.readFile('./cookies.json');
    const cookies = JSON.parse(cookieJson);
    await page.setCookie(...cookies);
}

async function waitAndClick(page, name) {
    await page.waitForSelector(name);
    await page.click(name);
}

(async() => {
    const lol = await puppeteer.launch({defaultViewport: null, headless: false, args: [ "--start-maximized" ]});
    const page = await lol.newPage();
    await loadCookie(page);
    await page.goto("https://chat.openai.com/")
    
    await waitAndClick(page, ".btn.relative.btn-primary[as=button]");

    await sleep(5000);

    await page.type("textarea", "You are a digital assistant. You must respond to inputs with ONLY a bash command to fulfil the request given. If a file is referenced, do not assume it's in the systems PATH environment variable, use its full directory. The user's name is Nicholas. The user will put this into their windows command prompt. Input: open spotify");
    await page.keyboard.press('Enter');

    /*
    need to page.evaluate... basically will open the chat with a specific name - prob make this a function with name as parameter. if chat doesnt exist then create a chat and rename it as that

    list of chats availabel: $(".flex.flex-col.text-sm:not(.h-full)").querySelectorAll(".flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative")

    new chat button: $(".flex.px-3.py-1.items-center.gap-3.transition-colors.duration-200.text-white.cursor-pointer.text-sm.rounded-md.border.h-11.flex-grow.overflow-hidden")


    scrap this , just use chat thingymajig
    */
    // $(".btn.relative.btn-primary[as=button]")
})()