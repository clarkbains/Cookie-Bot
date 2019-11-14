const Discord = require('discord.js');
const client = new Discord.Client();
const mysql = require ('mysql')
const commands = require('./commands');

function getOpts(filename){
    const fs = require('fs');
    let path = process.cwd()+"/"+filename;
    var buffer = fs.readFileSync(path);
    let opts = {};
    try{
        opts = JSON.parse(buffer.toString());
    }
    catch (e){
        console.error(e);
        process.exit();
    }
    return opts;
}
function argsParse (msg){
    let msgOpts = {}
    msgOpts.senderName = msg.author.username;
    msgOpts.senderId = msg.author.id;
    msgOpts.content = msg.content.match(/;;cookies?\s*(.*$)/i)[1];
    console.log(msgOpts)
    msgOpts.channel = msg.channel.id;
    msgOpts.client = msg.channel
    if (msg.content.indexOf("bake")>-1){
        msgOpts.type = "bake"
    }
    else if (msg.content.indexOf("list")>-1){
        msgOpts.type = "list"
    }
    else {
        msgOpts.type = "unknown"
    }
    return msgOpts
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', msg => {
	if (!msg.author.bot){
        //console.log(msg)
        if (msg.content.match(/^;;cookies?/i)) {
            let msgOpts = argsParse(msg)
            commands.run(client,con, msgOpts)
        }
    }
});

let opts = getOpts("auth.json");
var con = mysql.createConnection({
    host: opts.sqlHost,
    user: opts.sqlUsername,
    password: opts.sqlPassword,
    database:"general"
  });
  
  con.connect(function(err) {
    
    console.log("Connected to MySQL");
  });

client.login(opts.discordToken);
setInterval(function(){commands.notify(client, con)}, 3000);

