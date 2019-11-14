# Cookie Bot
Simple discord bot to bake cookies. In reality it is more of just a fun little database project. Requires a config file to work. 

Config file should be like the following.
```
{
    "discordToken":"",
    "sqlHost":"",
    "sqlUsername":"",
    "sqlPassword":""
}
```
Save this as `auth.json` and place in the project root folder.
Installation
* `git clone https://github.com/clarkbains/Cookie-Bot.git`
* `cd Cookie-Bot`
* `npm install`
* `node bot.js`