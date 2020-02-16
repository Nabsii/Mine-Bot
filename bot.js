var mineflayer = require('mineflayer');
var tpsPlugin = require('mineflayer-tps')(mineflayer)
var navigatePlugin = require('mineflayer-navigate')(mineflayer);

var Vec3 = require('vec3').Vec3;

var username_auth = process.argv[2]; //value will be username_auth
var password_auth = process.argv[3]; //value will be password_auth

var options = {
    host: "b2t2.org",
    port: 25565,
    username: username_auth,
    password: password_auth,
    version: "1.12.2"
};
  
var client = mineflayer.createBot(options);

function GetBlockNameFromCaptcha(json) {
    var object = JSON.parse(json);
    var text = object.text;
    var parsed = text.substr(19);
    console.log("Parsed shit: " + parsed);
    var remove_characters = parsed.split("_-_").join("_");
    var remove_last_character = remove_characters.substring(0, remove_characters.length - 1);
    return remove_last_character;
}

function PRINTC(msg) {
    console.log("[CLIENT]: " + msg);
}

function understr(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 /* Random shit for Spammer Credits: xercer#2619 */
var spamtext = ['> I bet youre the type of person to lick blocks of cheese', '>inb4 Jesus is a short middle-eastern Jew', '> I want to shove a firecracker up my nose and end it all', '> People on this server seem like pissed-on sprinklers', '> People on this server seem like pissed-on sprinklers', '> Hurricanes can smell fear', '>I hope you flush yourself down a toilet', '> Im sorry, I dont speak caucasian', '> Watching people play on this server is like watching someone try and roll a marble up a slide', '> Im lactose intolerant so I have to dunk my oreos in a glass of water', '> Donald Trump is built like a shattered lavalamp', '> Push us down, we get back up. Try to destroy our stashes? We rebuild. We are the Horizon', '> Cmon guys, jokes about black people? Kenya not?', 'Youre the type of person whos hand looks nervous kek', 'No homo, I would PLOW Shel Silverstein', 'Brb I need to vacuum my ceiling', '> I just want to shove a firecracker up my nose and end it all', '> I like to put a traffic cone on my head, look in the mirror, and pretend Im a toothpick', '> French Toast surrenders in your mouth', '>If someone REALLY loves you, theyll leave a salmon on your grave', 'Flamingos are durable', 'Watermelon can hurt you too',
'>I identify as a proximity mine attatched to a soccerball', '> Spleens', '> You ever deep fry a scorpion?', '>Broaden your Horizons, join Horizon today', 'Girls are just sour cream and silicon', 'Why do dogs bark if a leaf crunches?', 'Trains are very powerful pieces of meat', 'Why is someone swimming in my grass??? O_o', 'The siberian winter is just a white ash summer', '> Are you ever really into it if you arent gobbling wheels?', '> A voicemail is just a phony message', '> I think its a joke, but it could just be bread', '> Im gonna slap your diphthong', '> I want to slap a dolphin with a clothes hanger', '> I only see three or one', '> Jellyfish are like tacos, they sneeze!', '> Bewildered', '>tfw you sit in a wing place', '> Why do people lick candy?', '> Is the universal constant edible?', '> Dont you hate it when the abyss sneezes?', '>MFW I walk into a childs B-day party and pop all of the balloons', '> The sink is knocking... Let that sink in kek', '> Im just a fuckin spatula trying to be a spoon', '> I would jam a screw driver into a rabbit, but the tortois may sue me for HARE-assment'];


var prefix = "-";
spammer = false;
debug = true; //Logs Messages from (Chat, etc...)
console.log("Loading..");

bindEvents(client);

function bindEvents(client) {

    client.loadPlugin(tpsPlugin)
    navigatePlugin(client);

    client.navigate.blocksToAvoid[10] = true; // Avoid Lava
    client.navigate.blocksToAvoid[11] = true; // Avoid Lava
    client.navigate.blocksToAvoid[8] = true; // Avoid Water
    client.navigate.blocksToAvoid[9] = true; // Avoid Water

    client.navigate.on('pathFound', function (path) {
        PRINTC("found path. Length: " + path.length + " Blocks.");
    });

    client.navigate.on('cannotFind', function (closestPath) {
        PRINTC("Error while trying get the path..");
        client.navigate.walk(closestPath);
    });
    client.navigate.on('arrived', function () {
        PRINTC("Path reached, Stopping..");
    });
    client.navigate.on('interrupted', function() {
        PRINTC("Stopping Walking to Correct Path..");
    });

    client.once('spawn', () => {
        console.log("Bot is connected..");
        console.log("Logged as " + client.username);	
    });

    client.on('kicked', function(reason) {
        console.log("[SERVER-KICK]: Got kicked with reason: " + reason);

      client = mineflayer.createBot(options);
      bindEvents(client);
    });

    client.on('chat', function(username, message) {
        if (username === client.username) return;
        if (username === "queue") return; //Block Server messages.

        if(debug) {
            PRINTC("Got Message: " + message + "\nFrom: " + username);
        }

        if(message == prefix + "tps") {
            client.chat(' > Current TPS: ' + client.getTps() + " | " + understr(10));
        }
         else if(message == prefix + "coords") {
            client.chat(' > My current coords x: ' + client.entity.position.x + " y: " + client.entity.position.y + " z: " + client.entity.position.z + " | " + understr(10));
        }
        else if(message == prefix + "help") {
            client.chat(" > Made by Nabsi#9822\n > Commands: -goto <x> <y> <z> (bot walks to the coordinates) -tps (output's current Tick per second!) -coords (Output's bot current coordinates!) -report <name> <reason> (Reports player's!) | " + understr(10));
        }
        else if(message.indexOf(prefix + "goto ") > -1) {
            var array = message.split(' ');
            if(array[4] != "") {
                client.chat(" > Invalid arguments! usage: -goto <x> <y> <z>");
                return;
            }
            if(username == "Avustaja") {
                var cords = new Vec3(array[1], array[2], array[3]);
                client.navigate.to(cords);
            } else {
                client.chat(">> Sorry but you dont have permission to execute that.. | " + understr(10));
            }
        }

        else if(message == prefix + "report" || message == prefix + "report ") {
            client.chat(" > You didn't mention name!");
            return;
        }

        else if(message.indexOf(prefix + "report ") > -1) {
            var array = message.split(' ');
            var name = array[1];
            if(name == "Avustaja".toLowerCase() || name == client.username) {
                client.chat(" > No..");
                return;
            }
            var reason = message.substr(array[1].length + 8);
            if(reason == "") {
                client.chat(" > You didn't mention reason!");
                return;
            }
            client.chat(" > " + name + " has been reported for " + reason + " Staff will deal with this soon.");
        }

        if(spammer) {
            var d = Math.random();
            if (d < 0.5) { //50% Chance of sending the message!
                var rand = Math.floor(Math.random() * spamtext.length);
                client.chat(spamtext[rand]);
            }
        }
      });


    //For mc.SalC1.com
    client.on('windowOpen', function(window) {
        var text = GetBlockNameFromCaptcha(window.title); //Parses block name from Captcha Title!
        let filtered = window.slots.filter(r => {if(r) { return r.name == text.toLowerCase()} }) //Filtering thru every block in list if it fails it will reconnect bot!
        if(filtered[0]) {
            client.clickWindow(filtered[0].slot, 1, 0); //Sends click to the Block!
            console.log("[CAPTCHA]: Bypassed Captcha!");
        } else {
            bindEvents(client); //Reload's bot
        }
    });
}