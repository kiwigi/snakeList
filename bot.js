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
  host: "localhost",
  user: "root",
  password: "420",
  database: "snake"
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

client.on("message", async message => {


  if (message.content === 'im a snake') {
    Promise.all([
      message.react('🐍')
    ])
      .catch(() => console.error('failed to react to snake..'));
  }

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

  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  
//---------------------------------DETECT COMMAND--------------------------------
  
  if(command === "detect") {
    const m = await message.channel.send("detecting snakes.....");
    con.query(`SELECT * FROM snakepoints`, (err,rows) => {
    if(err) throw err;
    
    let snakeNum = rows.length;
    m.edit(`${snakeNum} snakes detected!`);
  });
  }

//---------------------------------EXPOSE COMMAND----------------------------------

if(command === "expose") {
  con.query(`SELECT * FROM snakepoints`, (err,rows) => {
  if(err) throw err;
  message.channel.send(`NAME:\t\t\tSNAKE POINTS:\n`);
  names = ['Richard','Abner','Tyler','Steven','Alex'];
  for(i=0;i<rows.length;i++){
    message.channel.send(`${names[i]}\t\t\t\t${rows[i].points}\n`);
  }
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
        //if person has no points, add them to the database
        if(rows.length < 1) {
          sql = `INSERT INTO snakepoints (id, points) VALUES ('${message.mentions.users.first().id}', 1)`;
        //if they have points, add 1 to their points
        }else {
          let currentpoints = rows[0].points; 
          sql = `UPDATE snakepoints SET points = ${currentpoints}+1  WHERE id = '${message.mentions.users.first().id}'`;
        }
        con.query(sql, console.log);
      });
  }
    else{
      m.edit(`<@${message.mentions.users.first().id}> has done nothing wrong.`);
    }}



//---------------------------------SNAKEPOINTS COMMAND----------------------------------

if(command === "snakepoints"){
  let target = message.mentions.users.first() || message.author;
  con.query(`SELECT * FROM snakepoints WHERE id = '${target.id}'`, (err, rows) => {
    if(err) throw err;

    if(!rows[0]) return message.channel.send(`This user has no snake points yet! Let's all thank <@${target.id}> for not being a snake.`);

    let tarpoints = rows[0].points;
    message.channel.send(`This user has:  ${tarpoints} snake points.`);
  });

}

//--------------------------------HENTAI COMMAND--------------------------------

  if(command === "hentai") {
    return message.reply("I refuse to enable this kind of behaviour. Please seek help.");
  }

//---------------------------------SAY COMMAND--------------------------------

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
//---------------------------------PURGE COMMAND--------------------------------

  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(config.token);