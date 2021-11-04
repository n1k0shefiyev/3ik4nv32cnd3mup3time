require("express")().listen(1343);
const ayarlar = require("./ayarlar.json");
const db = require("quick.db");
const discord = require("discord.js");
const client = new discord.Client({ disableEveryone: true });
const fetch = require("node-fetch");
const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  console.log(` Bot Pinglenmedi`);
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
let prefix = ayarlar.prefix;
let token = ayarlar.token;
let durum = ayarlar.durum;

client.on("ready", async () => {
  client.user.setPresence({ activity: { name: durum }, status: "idle" }); // bot durumu; idle, dnd, online
});

client.login(process.env.token);

setInterval(() => {
  var links = db.get("links");
  if (!links) return;
  var linkA = links.map(c => c.url);
  linkA.forEach(link => {
    try {
      fetch(link);
    } catch (e) {
      console.log("" + e);
    }
  });
  console.log("Pong! Requests sent");
}, 60000);

client.on("ready", () => {
  if (!Array.isArray(db.get("links"))) {
    db.set("links", []);
  }
});

client.on("message", message => {
  if (message.author.bot) return;
  var spl = message.content.split(" ");
  if (spl[0] == `${prefix}ekle`) {
    var link = spl[1];
    fetch(link)
      .then(() => {
        if (
          db
            .get("links")
            .map(z => z.url)
            .includes(link)
        )
          return message.channel.send(
            new discord.MessageEmbed()
              .setCıkır("RED")
              .setDescription(
                `> **<a::> \`Hatalı Link\` \n\n Botunuz **Zaten Sistemime** Kayıtlı Lütfen **Başka** Bir **Link** Giriniz.`
              )
              .setThumbnail(
                message.author.avatarURL({
                  dynamic: true,
                  format: "png",
                  size: 1024
                })
              )
              .setTimestamp()
              .setFooter(
                `${message.author.tag} Tarafından İstendi!`,
                message.author.avatarURL()
              )
          );
        message.channel.send(
          new discord.MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `> <a::> \`Başarılı\` \n\n Botunuz **Sistemimize** Başarıyla Eklendi. \n\n Bizi Tercih Ettiğiniz İçin Teşekkürler.`
            )
            .setThumbnail(
              message.author.avatarURL({
                dynamic: true,
                format: "png",
                size: 1024
              })
            )
            .setTimestamp()
            .setFooter(
              `${message.author.tag} Tarafından İstendi!`,
              message.author.avatarURL()
            )
        );
        db.push("links", { url: link, owner: message.author.id });
      })
      .catch(e => {
        return message.channel.send(
          new discord.MessageEmbed()
            .setColor("RED")
            .setDescription(
              `> **Yanlış Kullanım!** \n\n Kayıtlı Bir Link Girdiniz Veyada Yeni Bir Link Girmelisiniz.\n\n **Örnek Kullanım:** \n > ${prefix}ekle <link> \n `
            )
            .setThumbnail(
              message.author.avatarURL({
                dynamic: true,
                format: "png",
                size: 1024
              })
            )
            .setTimestamp()
            .setFooter(
              `${message.author.tag} Tarafından İstendi!`,
              message.author.avatarURL()
            )
        );
      });
  }
});

client.on("message", message => {
  if (message.author.bot) return;
  var spl = message.content.split(" ");
  if (spl[0] == `${prefix}yardım`) {
    var link = spl[1];
    message.channel.send(
      new discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle(`portaluptimeBOT yardım sistem`)
        .setDescription(
          `**\`${db.get("links").length}\`** Adet Bota Ve **\`${
            client.guilds.cache.size
          }\`** Adet Sunucuya Hizmet Etmektedir.\n\n> Sende Botunu Eklemek İstersen **\`${prefix}ekle\`** Adlı Komudu Kullanabilirsin. \n\n portaluptimeBOT İyi Günler Diler.`
        )
        .setThumbnail(
          message.author.avatarURL({ dynamic: true, format: "png", size: 1024 })
        )
        .setTimestamp()
        .setFooter(
          `${message.author.tag} Tarafından İstendi!`,
          message.author.avatarURL()
        )
    );
  }
});
