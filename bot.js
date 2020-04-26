const Discord = require('discord.js');
const fs = require('fs');
var mysql = require('mysql');
const ytdl = require('ytdl-core');
var rawdata = fs.readFileSync('auth.json');
var auth = JSON.parse(rawdata);
var connection = mysql.createConnection({
  host: auth.host,
  user: auth.user,
  password: auth.password
});
connection.connect();
var dispatcher;
var commands = '';
var ccc;
var channel9;
var words = '';
var schedule = require('node-schedule');
//var YoutubeMp3Downloader = require("youtube-mp3-downloader");

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.once('ready', () => {
	console.log('RedBot Ready!');
	client.user.setActivity(' for !help | v1.0.3 | github.com/BreMea/redbot', { type: 'WATCHING' });
});

var j = schedule.scheduleJob('1 * * * *', function() {
	connection.query("SELECT warns FROM redbot.users WHERE did = '683869330223530074'", function (error, results, fields) {
		if (error) throw error;
	});
});

/*var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "ffmpeg",        // Where is the FFmpeg binary located?
    "outputPath": "s",    // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});*/

client.login(auth.key);

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
	if (!channel) return;
	channel.send(`Yay, ${member} is here! Welcome to the server! Read through the <#702216016842719232> and then come chat with us in <#690336115684802562>! :D`);
});

client.on('guildMemberRemove', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
	if (!channel) return;
	channel.send(`Aww, ${member} left. See ya!`);
});
  

client.on('message', message => {
	if(message.author.id != '702222347738022002') {
		var msg = message.content.toLowerCase();
		rawdata = fs.readFileSync('commands.json');
		commands = JSON.parse(rawdata);
		rawdata = fs.readFileSync('words.json');
		words = JSON.parse(rawdata);
		channel9 = message.channel;
		for (i = 0; i < words.blacklist.length; i++) {
			if (msg.includes(words.blacklist[i])) {
				message.delete()
				.then(mesg => mesg.channel.send("**Hey!** We don't say those words here, ok? *(You've been given a warning)*"))
				.catch(console.error);

				connection.query('SELECT * FROM redbot.users WHERE did = ' + message.author.id, function (error, results, fields) {
					if (error) throw error;
					if (results.length == 0) {
						connection.query("INSERT INTO redbot.users (`did`, `warns`, `kicks`, `bans`) VALUES ('" + message.author.id + "', 1, 0, 0)", function (error, results, fields) {
							if (error) throw error;
							client.channels.cache.get("702941579559567481").send("**MED PRIORITY** - Gave 1 warning to <@" + message.author.id + "> (" + message.author.id + ") for cursing. *Message:* \n " + message.content);
						});
					} else {
						connection.query("UPDATE redbot.users SET warns = 1 WHERE did = " + message.author.id, function (error, results, fields) {
							if (error) throw error;
							const channel = client.channels.cache.get('702941579559567481');
							channel.send("<@&690336930201862176> **MED PRIORITY** - Gave 1 warning to <@" + message.author.id + "> for cursing. *Message:* \n" + message.content);
						});
					}
				});
			}
		}
		if (msg.includes('69') && message.channel.id === '702327056825843822') {
			message.channel.send("nice");
		} else if (msg.includes('420') && message.channel.id === '702327056825843822') {
			message.channel.send("nice");
		}
		for (i = 0; i < words.fake_blacklist.length; i++) {
			if (msg.includes(words.fake_blacklist[i])) {
				message.channel.send("**Hey!** We don't say those words here, ok? Don't do that again, thanks.");
			}
		}/*
		for (i = 0; i < words.ok.length; i++) {
			if (msg.includes(words.ok[i])) {
				eval('if (!usrc.' + message.author.id + ') { usrc.' + message.author.id + ' = 1;')
				message.channel.send(eval('usrc.' + message.author.id));
			}
		}*/
		if (msg.substring(0, 1) === '!') {
			if (commands.hasOwnProperty(msg.slice(1))) {
				var msgresult = eval('commands.' + msg.slice(1) + ';');
				message.channel.send(msgresult);
			} else if (msg.substring(0, 6) === '!warns' && message.channel.id === '702941579559567481') {
				var msgq = msg.split(' ');
				connection.query("SELECT warns FROM redbot.users WHERE did = " + msgq[1], function (error, results, fields) {
				if (error) throw error;
					if (results.length != 0 && !msgq[2]) {
						message.channel.send('<@' + msgq[1] + '> has ' + results[0].warns + ' warning(s).');
					} else if (results.length != 0) {
						connection.query("UPDATE redbot.users SET warns = " + msgq[2] + " WHERE did = " + msgq[1], function (error, results, fields) {
						if (error) throw error;
							message.channel.send('<@' + msgq[1] + '> now has ' + msgq[2] + ' warning(s).');
						});
					 } else {
						message.channel.send('I could not find a user with that ID, sorry.');
					}
				});
			} else if (msg === '!warns' && message.channel.id !== '702941579559567481') {
				connection.query("SELECT warns FROM redbot.users WHERE did = " + message.author.id, function (error, results, fields) {
					if (error) throw error;
					if (results.length != 0) {
						message.channel.send('<@' + message.author.id + '> DM Sent 👍');
						message.author.send('You currently have ' + results[0].warns + ' warning(s).');
					} else {
						message.channel.send('<@' + message.author.id + '> DM Sent 👍');
						message.author.send('I did not find any warnings for you. (This normally means you have not recived a warning at all on the server.)');
					}
				});
			} else if (msg === '!positive' || msg === '!affirmations') {
				rawdata = fs.readFileSync('https://www.affirmations.dev/');
				var quote = JSON.parse(rawdata);
				message.channel.send(quote.affirmation);
			} else if (msg.substring(0, 6) === '!play ' && message.channel.id == '703449804193267792') {
				message.channel.send("I'll download that song now, and play it once the download is finished. \n **Progress: 0%**");
				var u2 = message.content.split(' ');
				//YD.download(u2[1]);
			} else {
				message.channel.send('**Command not found!** Send **!help** for a list of commands.');
			}
		} else if (msg.includes('best mod')) {
			message.channel.send('The best mod is **BreMea**. He even has a role saying so!!');
		} else if (msg.substring(0, 3) == "i'm" && message.channel.id === '702327056825843822') {
			message.channel.send('Nice to meet you ' + message.content.slice(4) + ", I'm RedBot.");
		} else if (msg.substring(0, 2) == "im" && message.channel.id === '702327056825843822') {
			message.channel.send('Nice to meet you ' + message.content.slice(3) + ", I'm RedBot.");
		} else if (message.content == "I'll download that song now, and play it once the download is finished. \n **Progress: 0%**" && message.author.id == "702222347738022002") {
			channel9 = message;
		}
	}
});

/*YD.on("finished", function(err, data) {
	eval("dispatcher = ccc.play('s/" + data.videoTitle + ".mp3');");
	channel9.edit('Download done! Playing **' + data.videoTitle + '**');
	dispatcher.on('start', () => {
		console.log('playing a song');
	});
	
	dispatcher.on('finish', () => {
		console.log('song done');
		channel9.edit('All done playing **' + data.videoTitle + '**. Use `!u [youtube id]` to play another song.');
	});
	
	// Always remember to handle errors appropriately!
	dispatcher.on('error', console.error);
});
 
YD.on("error", function(error) {
    channel9.edit("Error:" + error);
});
 
YD.on("progress", function(progress) {
	channel9.edit("I'll download that song now, and play it once the download is finished. \n **Progress: " + Math.round(progress.progress.percentage) + "%**");
});*/

client.on('voiceStateUpdate', async (oldState, newState) => {
	if (newState.channel == '703449230932443167') {
		newState.guild.members.fetch(newState.id)
		.then(member => member.roles.add('703449651164086283'))
		.catch(console.error);
		ccc = await message.member.voice.channel.join();
	} else {
		newState.guild.members.fetch(newState.id)
		.then(member => member.roles.remove('703449651164086283'))
		.catch(console.error);
		ccc = await message.member.voice.channel.leave();
	}
});

client.on(`messageReactionAdd`, async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log(`Something went wrong when I tried fetching the message: `, error);
			return;
		}
	}
	if (reaction.emoji.name === '🎨' && reaction.message.id === '702226759474610258') {
		//702215476813496421
		reaction.message.guild.members.fetch(user.id)
		.then(member => member.roles.add('702215476813496421'))
		.catch(console.error);
	} else if (reaction.emoji.name === '🖥️' && reaction.message.id === '702226759474610258') {
		//702215350628122696
		reaction.message.guild.members.fetch(user.id)
		.then(member => member.roles.add('702215350628122696'))
		.catch(console.error);
	} else if (reaction.emoji.name === '🔊' && reaction.message.id === '702226759474610258') {
		//702215182448984094
		reaction.message.guild.members.fetch(user.id)
		.then(member => member.roles.add('702215182448984094'))
		.catch(console.error);
	} else if (reaction.emoji.name === '🎮' && reaction.message.id === '702226759474610258') {
		//702273342362615909
		reaction.message.guild.members.fetch(user.id)
		.then(member => member.roles.add('702273342362615909'))
		.catch(console.error);
	}
});

client.on(`messageReactionRemove`, async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log(`Something went wrong when I tried fetching the message: `, error);
			return;
		}
	}
	if (reaction.emoji.name === '🎨' && reaction.message.id === '702226759474610258') {
		//702215476813496421
		reaction.message.guild.members.fetch(user.id)
		.then(member => member.roles.remove('702215476813496421'))
		.catch(console.error);
	} else if (reaction.emoji.name === '🖥️' && reaction.message.id === '702226759474610258') {
		//702215350628122696
		reaction.message.guild.members.fetch(user.id)
		.then(member => member.roles.remove('702215350628122696'))
		.catch(console.error);
	} else if (reaction.emoji.name === '🔊' && reaction.message.id === '702226759474610258') {
		//702215182448984094
		reaction.message.guild.members.fetch(user.id)
		.then(member => member.roles.remove('702215182448984094'))
		.catch(console.error);
	} else if (reaction.emoji.name === '🎮' && reaction.message.id === '702226759474610258') {
		//702273342362615909
		reaction.message.guild.members.fetch(user.id)
		.then(member => member.roles.remove('702273342362615909'))
		.catch(console.error);
	}
});