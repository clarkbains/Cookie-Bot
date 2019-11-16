module.exports = {
    run: function (client,sqlclient,opts){
        let served = false
        if (opts.type == "bake"){
            served=true;
            let cookieNum = opts.content.match(/bake\s*(\d+)?/i)[1]
            cookieNum = cookieNum || 1
            let timeNow = Math.floor(new Date() / 1000)
            console.log([opts.senderId, opts.channel,cookieNum,timeNow,timeNow,450])
            sqlclient.query(`INSERT into cookieTracking (user, server, num, time_in, last_notify, temp) VALUES (?,?,?,?,?,450); `,
            [opts.senderId, opts.channel,cookieNum,timeNow,timeNow,450],
            (err,res)=>{
                if (err){served=false; console.log(err)}
                else{opts.client.send("I've put your cookies in the oven.")}

            })
        
        }
        if (served==false){
            opts.client.send(`I didn't get that, sorry. Try \`;;cookie bake [cookies]\``)
        }
    },
    notify: function (client,sqlclient){
        const timeToBake = 400;
        const notifyEvery = Math.floor((Math.random()*30)+30);
        let currentTime = Math.floor(new Date() / 1000)
        let timeStart = currentTime-timeToBake
        let timeNotify = currentTime-notifyEvery
        sqlclient.query("SELECT * from cookieTracking WHERE (time_in>? and last_notify<?) or (baked=0 and time_in<=?)",[timeStart,timeNotify,timeStart],(err, res)=>{
            for (let notification of res){
                console.log(notification,currentTime - notification.time_in, currentTime-notification.last_notify)
                if (currentTime - notification.time_in>timeToBake){
                    //Finely aged cookie, update baked.
                    client.channels.get(notification.server).send(`<@${notification.user}>, your cookie is done. Enjoy!`)
                    sqlclient.query(`UPDATE cookieTracking SET baked=1 where id=${notification.ID}`)

                }
                else {
                    let percentDone = Math.min(Math.round((currentTime-notification.time_in)/timeToBake * 1000) / 10,99);
                    client.channels.get(notification.server).send(`<@${notification.user}>, your cookie is ${percentDone}% done. Stay tuned.`)
            
                }
                sqlclient.query(`UPDATE cookieTracking SET last_notify = ? WHERE id=?`,[currentTime,notification.ID])
        }
        }
        )
    }
};