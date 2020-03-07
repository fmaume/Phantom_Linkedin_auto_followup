// Phantombuster configuration {
"phantombuster command: nodejs"
"phantombuster package: 5"
"phantombuster dependencies: lib-StoreUtilities.js, lib-LinkedIn.js, lib-LinkedInScraper.js"

const Buster = require("phantombuster")
const buster = new Buster()

const Nick = require("nickjs")
const nick = new Nick({
	loadImages: true,
	printPageErrors: false,
	printResourceErrors: false,
	printNavigation: false,
	printAborts: false,
	debug: false,
	timeout: 30000,
	heigth: 800
})

const StoreUtilities = require("./lib-StoreUtilities")
const utils = new StoreUtilities(nick, buster)
const LinkedIn = require("./lib-LinkedIn")
const linkedIn = new LinkedIn(nick, buster, utils)
const LinkedInScraper = require("./lib-LinkedInScraper")
const { URL } = require("url")

const MAX_SKILLS = 6
const MAX_PROFILES = 100

// }

//get user profile from message panet
const get_user_profile = (arg, done) => {



  try {
    stemp = document.querySelector('[data-control-name="topcard"]')
    link = stemp.href

  } catch(err) {
    link = "unknow"
  }  
  done(null, link)
  
  
}

async function main(thread, message){
const arg = buster.argument
const linkedInScraper = new LinkedInScraper(utils)
const tab = await nick.newTab()
//loging
await linkedIn.login(tab, cookie)
await tab.open(thread)


const pageTimeout = 5000
selectors = '[data-control-name="topcard"]'
await tab.waitUntilVisible(selectors, pageTimeout)
const user_url = await tab.evaluate(get_user_profile, arg)
console.log("scraped url")
console.log(user_url)

//get user data
const scrapedData = await linkedInScraper.scrapeProfile(tab, user_url)
//console.log(scrapedData)
//console.log(scrapedData.csv.company)
//console.log(scrapedData.csv.firstName)

//prespocess message#
message = message.replace('#firstName#', scrapedData.csv.firstName)
message = message.replace('#CompanyName#', scrapedData.csv.company)
await tab.open(thread)

//type message
selectors = ".msg-form__contenteditable"
await tab.waitUntilVisible(selectors, pageTimeout)
await tab.sendKeys(selectors, message)
console.log("message typed")
await tab.wait(10000)

//press send (require click to send setup)
selectors = ".msg-form__send-button"
await tab.waitUntilVisible(selectors, pageTimeout)
await tab.click(selectors)
await tab.wait(10000)

nick.exit()
}

message = "Hi #firstName#, you are working at #CompanyName#, isn't it?"

main("https://www.linkedin.com/messaging/thread/6541646864096219136/", message)
