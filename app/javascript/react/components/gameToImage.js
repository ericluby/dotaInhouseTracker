import { loadImage } from 'canvas'
import heroes from './dotaHeroIDs.json'

async function gameToImage(gameData, title){
  const canvas = document.getElementById('dotaMatch');
  const context = canvas.getContext('2d');
  const wXPlacement = gameData.winningTeam === "radiant" ? 157 : 315

//gradient background
  context.rect(0, 0, canvas.width, canvas.height);
  // add linear gradient
  var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  // light blue
  grd.addColorStop(0, '#8ED6FF');
  // dark blue
  grd.addColorStop(1, '#004CB3');
  context.fillStyle = grd;
  context.fill();
  // call text creator function to create text
  await Promise.all([
    // team names
    text(context, 40, 60, "Radiant", "35px Impact"),
    text(context, 360, 60, "Dire", "35px Impact"),
    // player names
    text(context, 60, 90, gameData.players[0].playerName, "12px Impact"),
    text(context, 60, 130, gameData.players[1].playerName, "12px Impact"),
    text(context, 60, 170, gameData.players[2].playerName, "12px Impact"),
    text(context, 60, 210, gameData.players[3].playerName, "12px Impact"),
    text(context, 60, 250, gameData.players[4].playerName, "12px Impact"),
    text(context, 395, 90, gameData.players[5].playerName, "12px Impact", 'black', 'right'),
    text(context, 395, 130, gameData.players[6].playerName, "12px Impact", 'black', 'right'),
    text(context, 395, 170, gameData.players[7].playerName, "12px Impact", 'black', 'right'),
    text(context, 395, 210, gameData.players[8].playerName, "12px Impact", 'black', 'right'),
    text(context, 395, 250, gameData.players[9].playerName, "12px Impact", 'black', 'right'),
    // player kill, death, assists
    text(context, 60, 105, `${gameData.players[0].playerKills} / ${gameData.players[0].playerDeaths} / ${gameData.players[0].playerAssists}`, "12px Impact"),
    text(context, 60, 145, `${gameData.players[1].playerKills} / ${gameData.players[1].playerDeaths} / ${gameData.players[1].playerAssists}`, "12px Impact"),
    text(context, 60, 185, `${gameData.players[2].playerKills} / ${gameData.players[2].playerDeaths} / ${gameData.players[2].playerAssists}`, "12px Impact"),
    text(context, 60, 225, `${gameData.players[3].playerKills} / ${gameData.players[3].playerDeaths} / ${gameData.players[3].playerAssists}`, "12px Impact"),
    text(context, 60, 265, `${gameData.players[4].playerKills} / ${gameData.players[4].playerDeaths} / ${gameData.players[4].playerAssists}`, "12px Impact"),
    text(context, 395, 105, `${gameData.players[5].playerKills} / ${gameData.players[5].playerDeaths} / ${gameData.players[5].playerAssists}`, "12px Impact", 'black', 'right'),
    text(context, 395, 145, `${gameData.players[6].playerKills} / ${gameData.players[6].playerDeaths} / ${gameData.players[6].playerAssists}`, "12px Impact", 'black', 'right'),
    text(context, 395, 185, `${gameData.players[7].playerKills} / ${gameData.players[7].playerDeaths} / ${gameData.players[7].playerAssists}`, "12px Impact", 'black', 'right'),
    text(context, 395, 225, `${gameData.players[8].playerKills} / ${gameData.players[8].playerDeaths} / ${gameData.players[8].playerAssists}`, "12px Impact", 'black', 'right'),
    text(context, 395, 265, `${gameData.players[9].playerKills} / ${gameData.players[9].playerDeaths} / ${gameData.players[9].playerAssists}`, "12px Impact", 'black', 'right'),
  ])
  // call image creator function to create images
  await Promise.all([
    // radiant team
    image(context, {x: 25, y: 80, w: 30, h: 30}, heroes.find(hero => hero.id === gameData.players[0].playerHeroID).icon),
    image(context, {x: 25, y: 120, w: 30, h: 30}, heroes.find(hero => hero.id === gameData.players[1].playerHeroID).icon),
    image(context, {x: 25, y: 160, w: 30, h: 30}, heroes.find(hero => hero.id === gameData.players[2].playerHeroID).icon),
    image(context, {x: 25, y: 200, w: 30, h: 30}, heroes.find(hero => hero.id === gameData.players[3].playerHeroID).icon),
    image(context, {x: 25, y: 240, w: 30, h: 30}, heroes.find(hero => hero.id === gameData.players[4].playerHeroID).icon),
    // dire team
    image(context, {x: 400, y: 80, w: 30, h: 30}, heroes.find(hero => hero.id === gameData.players[5].playerHeroID).icon),
    image(context, {x: 400, y: 120, w: 30, h: 30}, heroes.find(hero => hero.id === gameData.players[6].playerHeroID).icon),
    image(context, {x: 400, y: 160, w: 30, h: 30}, heroes.find(hero => hero.id === gameData.players[7].playerHeroID).icon),
    image(context, {x: 400, y: 200, w: 30, h: 30}, heroes.find(hero => hero.id === gameData.players[8].playerHeroID).icon),
    image(context, {x: 400, y: 240, w: 30, h: 30}, heroes.find(hero => hero.id === gameData.players[9].playerHeroID).icon),
    // vs icon
    image(context, {x: (canvas.width/2)-60, y: (canvas.height/2)-60, w: 120, h: 120}, "https://clipartart.com/images/versus-logo-clipart-transparent.png"),
    // w icons
    image(context, {x: wXPlacement, y: 33, w: 35, h: 35}, "https://i.ya-webdesign.com/images/w-transparent-gold.png"),
  ])
}

//function to create an image and place it somewhere
async function image(context, {x, y, w, h}, imagePath){
  const image = await loadImage(imagePath);
  context.drawImage(image, x, y, w, h);
}

//function to create text and place it somewhere
function text(context, x, y, string, font='30px Impact', color='black', textAlign = "left"){
  context.font = font;
  context.fillStyle = color;
  context.textAlign = textAlign;
  context.fillText(string, x, y);
}

export default gameToImage
