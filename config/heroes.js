(function(){
  window.TBH = window.TBH || {};
  TBH.config = TBH.config || {};
  const HERO_SHEET = "assets/heroes.png";
  TBH.config.heroes = [
    { id:"knight", name:"Рыцарь", flavor:"Держит переднюю линию и принимает удар на себя.", color:"#8fa2cc",
      baseDmg:6, atkSpeed:1, baseHp:260, hpPerLevel:34, baseRegen:.8, costBase:12, recruitCost:0,
      range:"melee", projectile:null, projColor:"#f2f6ff", splash:0,
      sprite:{ src:HERO_SHEET, index:0, count:4, pixelHeight:48,
        palette:{P:"#ff4d62",h:"#dfe6f5",f:"#ffd9a8",a:"#8fa2cc",b:"#2c3350",w:"#f2f6ff"},
        rows:[".....PP.....","....PPP.....","....hhhh....","....hffh....","....hhhh....","..aahhhaa.w.",".faaaaaaa.w.",".faaaaaaa.w","..aaaaaaa.w.","...aa.aa.ww.","...aa.aa....","...bb.bb....","...bb.bb...."] } },
    { id:"archer", name:"Лучница", flavor:"Быстрые стрелы из-за спины танка.", color:"#4fd873",
      baseDmg:10, atkSpeed:1.65, baseHp:150, hpPerLevel:18, baseRegen:.5, costBase:65, recruitCost:150,
      range:"ranged", projectile:"arrow", projColor:"#e8d8a8", splash:0,
      sprite:{ src:HERO_SHEET, index:1, count:4, pixelHeight:48,
        palette:{g:"#4fd873",t:"#2c9e52",f:"#ffd9a8",b:"#c98a4b",k:"#2c3350"},
        rows:["....gggg....","...gggggg...","...gfffg....","...gfffg....","....gggg....","..tttttt..b.",".ftttttt.b.b","..tttttt.b.b","..tttttt..b.","...tt.tt....","...tt.tt....","...kk.kk...."] } },
    { id:"mage", name:"Маг", flavor:"Огненные шары по площади. Хрупкий, но смертельный.", color:"#8a5cff",
      baseDmg:42, atkSpeed:.55, baseHp:120, hpPerLevel:14, baseRegen:.4, costBase:900, recruitCost:2500,
      range:"ranged", projectile:"fire", projColor:"#ff8a3d", splash:52,
      sprite:{ src:HERO_SHEET, index:2, count:4, pixelHeight:48,
        palette:{h:"#8a5cff",r:"#5a3fd6",o:"#38dfff",s:"#c98a4b",f:"#ffd9a8",k:"#2c3350"},
        rows:[".....hh.....","....hhhh....","...hhhhhh.o.","..hhhhhh..s.","....ff....s.","....ff....s.","..rrrrrr..s.",".frrrrrr..s.","..rrrrrr..s.","..rrrrrr....","..rrrrrr....","...rr.rr....","...kk.kk...."] } },
    { id:"healer", name:"Целительница", flavor:"Лечит самого раненого союзника. Оружие усиливает лечение.", color:"#3fd88f", role:"healer",
      baseDmg:26, atkSpeed:.8, baseHp:140, hpPerLevel:16, baseRegen:.7, costBase:2500, recruitCost:8000,
      range:"ranged", projectile:"heal", projColor:"#78ff7a", splash:0,
      sprite:{ src:HERO_SHEET, index:3, count:4, pixelHeight:48,
        palette:{y:"#ffd866",h:"#e8d8a8",f:"#ffd9a8",w:"#f2f6ff",g:"#3fd88f",o:"#78ff7a",s:"#c98a4b",k:"#2c3350"},
        rows:["....yyyy....","...hhhhhh...","...hffffh...","...hffffh...","....wwww....","..ggwwgg.o..",".fggwwgg.s..","..gggggg.s..","..gggggg.s..","..gggggg....","...gg.gg....","...kk.kk...."] } }
  ];
})();