const Discord = require('discord.js');
const fs = require('fs');
var mysql = require('mysql');
var rawdata = fs.readFileSync('auth.json');
var auth = JSON.parse(rawdata);
var connection = mysql.createConnection({
  host: auth.host,
  user: auth.user,
  password: auth.password
});
connection.connect();
var commands = '';
var words = '';
var schedule = require('node-schedule');

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

client.login(auth.key);

client.on('message', message => {
	if(message.author.id != '702222347738022002') {
		var msg = message.content.toLowerCase();
		rawdata = fs.readFileSync('commands.json');
		commands = JSON.parse(rawdata);
		rawdata = fs.readFileSync('words.json');
		words = JSON.parse(rawdata);
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
							client.channels.get("702941579559567481").send("**MED PRIORITY** - Gave 1 warning to <@" + message.author.id + "> (" + message.author.id + ") for cursing. *Message:* \n " + message.content);
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
			} else {
				message.channel.send('**Command not found!** Send **!help** for a list of commands.');
			}
		} else if (msg.includes('best mod')) {
			message.channel.send('The best mod is **BreMea**. He even has a role saying so!!');
		} else if (msg.substring(0, 3) == "i'm" && message.channel.id === '702327056825843822') {
			message.channel.send('Nice to meet you ' + message.content.slice(4) + ", I'm RedBot.");
		} else if (msg.substring(0, 2) == "im" && message.channel.id === '702327056825843822') {
			message.channel.send('Nice to meet you ' + message.content.slice(3) + ", I'm RedBot.");
		}
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