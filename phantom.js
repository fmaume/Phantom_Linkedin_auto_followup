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

//get list of message thread available
const get_thread_list = (arg, done) => {



  try {
        stemp = document.querySelectorAll('[data-control-name="view_message"]')
        result = []
        var i;
        for (i = 0; i < stemp.length; i++) {
            stemp2 = stemp[i].href
            result.addObject(stemp2)
        }


  } catch(err) {
    result = []
  }  
  done(null, result)
  
  
}
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

async function send_message_from_thread(thread, message){

await tab.open(thread)



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


}

message = "Hi #firstName#, you are working at #CompanyName#, isn't it?"



async function main(){
const arg = buster.argument
const linkedInScraper = new LinkedInScraper(utils)
const tab = await nick.newTab()
//loging
await linkedIn.login(tab, arg.sessionCookie)

//open messaging tab
await tab.open("https://www.linkedin.com/messaging/")

//scrool to revel more message
const pageTimeout = 5000
selectors = '[data-control-name="view_message"]'
await tab.waitUntilVisible(selectors, pageTimeout)
console.log("redirected to messages")
//const x = 1000
//const y = 2000
//await tab.scroll(x, y)
await tab.scrollToBottom()
console.log("scrolled down")
await tab.wait(10000)
console.log("waited")
const thread_list = await tab.evaluate(get_thread_list, arg)
console.log(thread_list)

nick.exit()
    
}    
main()
