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


//scroll down thread
const scroll_thread = (arg, done) => {



    try {

        stemp = document.querySelectorAll('[data-control-name="view_message"]')
        stemp = stemp[stemp.length - 1]
        stemp.scrollIntoView({ block: "start", inline: "nearest" })


    } catch (err) {
        stemp = []
    }
    done(null, stemp)


}


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
//get list of number of message within a thread
const count_messages = (arg, done) => {



  try {
        stemp = document.querySelectorAll('.msg-s-message-group__meta')
        result = stemp.length


  } catch(err) {
    result = 0
  }  
  done(null, result)
  
  
}
//get list name of seder from first message
const get_sender_name = (arg, done) => {



  try {
        stemp = document.querySelector('.msg-s-message-group__meta')
        stemp = stemp.querySelector('[data-control-name="view_profile"]')
        stemp = stemp.innerText


  } catch(err) {
    stemp = 0
  }  
  done(null, stemp)
  
  
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

async function send_message_from_thread(thread, message, tab, pageTimeout, arg, linkedInScraper){

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
    //swolly scroll to reaveal more threads
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    // 13 thread scrolled
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    //19 threads scrolled
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
    stemp = await tab.evaluate(scroll_thread, arg)
    console.log("scrolled down")
    await tab.wait(1000)
const thread_list = await tab.evaluate(get_thread_list, arg)
console.log(thread_list)

var i;
for (i = 0; i < arg.AccountNumber; i++) {
    
    console.log(i)
    try {
        await tab.open(thread_list[i]) 
        await tab.wait(10000)
        message_count = await tab.evaluate(count_messages, arg)  
        console.log(message_count)
    
        //check if the thread contain only on message
        if (message_count == 1) {
            sender_name = await tab.evaluate(get_sender_name, arg) 
            console.log(sender_name)
            //check if the thread is the result of an accepted contact request
            if (sender_name = arg.accountName){
            
                await send_message_from_thread(thread_list[i], arg.Message, tab, pageTimeout, arg, linkedInScraper)
            } else{
                console.log("This thread is a response to an invite: "+ thread_list[i])
            }
        
        
        }else {
            console.log("this thread has already multiple message: " + thread_list[i] ) 
        }
    } catch (error) {
        console.log("There is an issue with this thread " + thread_list[i]);
        console.error(error);
    }
}

nick.exit()
    
}  

async function main_with_error_handling(){
try {
    await main()
}catch(error) {
    console.error(error);

}
}

main_with_error_handling()
