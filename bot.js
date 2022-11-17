//-- Works, not very well.... But it works! 
//Supposed to use database to make a 'snake list' 
//Many features have yet to be implemented...


//Load up the discord.js library
const Discord = require("discord.js");
//client is client
const client = new Discord.Client();
//json file has token and prefix 
const config = require("./config.json");
//mysql
const mysql = require("mysql");
//create sql connection
var con = mysql.createConnection({
 //// **insert mysql credentials here
});
//Runs wen connection is successful
con.connect(err => {
    if(err) throw err;
    console.log("connected to database.");
});
client.on("ready", () => {
  //This event will run if the bot starts, and logs in, successfully.
  console.log(`Hisssssss let's spot some snakes`); 
  client.user.setActivity(`Finding snakes`);
});

  //This will react to any message from a user that is a 'snake' 
  //For now, this feature is hard coded and doesn't use the database.
client.on("message", async message => {


  if (message.content === 'im a snake') {
    Promise.all([
      message.react('🐍')
    ])
      .catch(() => console.error('failed to react to snake..'));
  }

  //proabbly not good practice to be putting actual IDs here (please don't look these up or anything)
  //Again, this will all eventually be done through a database, details like these should not be avalible to be seen in the code itself....
  if (message.author.id  === "96425998089736192") {
    Promise.all([
      message.react('🐍')
    ])
      .catch(() => console.error('failed to react to snake..'));
  }
  
  if (message.author.id  === "478453730082029589") {
    Promise.all([
      message.react('🐍')
    ])
      .catch(() => console.error('failed to react to snake..'));
  }
  
  if (message.author.id  === "521931888378642443") {
    Promise.all([
      message.react('🐍')
    ])
      .catch(() => console.error('failed to react to snake..'));
  }

  // Separates "command" name, and "arguments" for the command. 
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  //not really used right now ^

//---------------------------------DETECT COMMAND--------------------------------
  
if(command === "detect") {
  const m = await message.channel.send("detecting snakes.....");
  //gets the number of rows in the database table.... This is how many 'snakes' are detected
  con.query(`SELECT * FROM snakepoints`, (err,rows) => {
  if(err) throw err;
  
  let snakeNum = rows.length;
  m.edit(`${snakeNum} snakes detected!`);
});
}


  
//---------------------------------HELP COMMAND--------------------------------
  
  if(command === "help") {
    message.channel.send(`Prefix:\t\t\tpls\ndetect:\t\t\tdetect the number of snakes\nexpose:\t\t\treturns a list of known snakes and their snake scores\nreport:\t\t\tadds 1 point to a persons snakescore\nsnakescore:\t\treturns selected users snakescore`);
  }

  
//---------------------------------EXPOSE COMMAND----------------------------------

if(command === "expose") {
  con.query(`SELECT * FROM snakepoints`, (err,rows) => {
  if(err) throw err;
  //temporary, better 'leaderboard' will be implemented at some point...
  //Again, this part is hard-coded! Which is bad! 
  //Eventually the leaderboard should be able to display user-names that are optained from the database, NOT their actual names! 
  var txt = 'USER: ------ TOTAL SNAKE POINTS:\n';
  for(i=0;i<rows.length;i++){
    
    txt=txt.concat(`${rows[i].username} --- ${rows[i].points}\n`);
  }
  console.log(txt);

  const list = new Discord.RichEmbed()
  .setTitle("Snake List")
  .setThumbnail('https://images.emojiterra.com/google/android-nougat/512px/1f40d.png')
  .setColor([186, 255, 140])
  .setDescription(txt);
  message.channel.send(list);

  });
}  
//---------------------------------REPORT COMMAND--------------------------------

  if(command === "report") {
    //reporting a user adds 1 point to their snake points.
    const m = await message.channel.send("Contacting KRL.....");
    //if reported user is not mar
    if(message.mentions.users.first().id !== "363189216508903424"){
      m.edit(`I've contacted KRL and the police is on it's way to arrest: <@${message.mentions.users.first().id}>`);
      //database stuff
      con.query(`SELECT * FROM snakepoints WHERE id = '${message.mentions.users.first().id}'`, (err,rows) =>{
        if(err) throw err;

        let sql;
        let currentpoints = rows[0].points;
        //if person has no points, add them to the database
        if(rows.length < 1) {
          sql = `INSERT INTO snakepoints (id, username, points) VALUES ('${message.mentions.users.first().id}', '${message.mentions.users.first().username}', 1)`;
        //if they have points, add 1 to their points
        }else if(currentpoints<19){
          let currentpoints = rows[0].points; 
          sql = `UPDATE snakepoints SET points = ${currentpoints}+1  WHERE id = '${message.mentions.users.first().id}'`;
        }else {
          sql = `UPDATE snakepoints SET points = 20  WHERE id = '${message.mentions.users.first().id}'`;
          sql = `UPDATE snakepoints SET snakestatus = 1  WHERE id = '${message.mentions.users.first().id}'`;
          message.channel.send( `<@${message.mentions.users.first().id}> is now VERIFIED SNAKE! Congrats on reaching the highest level of snakiness. 🐍`);
            
        }

        con.query(sql, console.log);
      });
  }
    else{
      m.edit(`<@${message.mentions.users.first().id}> has done nothing wrong.`);
    }}
 function chkStat(id){
    con.query(`SELECT * FROM snakepoints WHERE id = '${id}'`, (err,rows) =>{
    if(err) throw err;

    let sql;
    let currentpoints = rows[0].points;

    if(currentpoints==20){
      sql = `UPDATE snakepoints SET snakestatus = 1  WHERE id = '${message.mentions.users.first().id}'`;
          message.channel.send( `<@${message.mentions.users.first().id}> is now VERIFIED SNAKE! Congrats on reaching the highest level of snakiness. 🐍`);
    }
  });

 }


//---------------------------------SNAKEPOINTS COMMAND----------------------------------

if(command === "snakepoints"){
  let target = message.mentions.users.first() || message.author;
  con.query(`SELECT * FROM snakepoints WHERE id = '${target.id}'`, (err, rows) => {
    if(err) throw err;

    if(!rows[0]) return message.channel.send(`This user has no snake points yet! Let's all thank <@${target.id}> for not being a snake.`);

    let tarpoints = rows[0].points;
    let status = rows[0].snakestatus;
    
    if(status==0){
      const results = new Discord.RichEmbed()
      .setColor([161, 230, 255])
      .setFooter(`USER: ${target.tag}.`, target.displayAvatarURL)
      .setDescription(`This user has a snake score of: ${tarpoints}`);
      message.channel.send(results);
    }
    else{
      const results = new Discord.RichEmbed()
      .setColor([52, 235, 140])
      .setTitle(`VERIFIED SNAKE 🐍`)
      .setFooter(`USER: ${target.tag}.`, target.displayAvatarURL)
      .setDescription(`This user has a snake score of: ${tarpoints}`);
      message.channel.send(results);
    }
    
    
  });

}

//---------------------------------SAY COMMAND--------------------------------

  if(command === "say") {
    // makes the bot say something and delete the message. 
    const sayMessage = args.join(" ");
    // Then we delete the command message
    message.delete().catch(O_o=>{}); //some smiley face for some reason
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
//---------------------------------PURGE COMMAND--------------------------------

  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(config.token);
