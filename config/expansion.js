(function(){
  window.TBH = window.TBH || {};
  TBH.config = TBH.config || {};
  TBH.config.partyCap = 4;
  const X = "assets/expansion.png";
  TBH.config.heroes.push(
    { id:"paladin", name:"Паладин", flavor:"Святая стена: много HP и регена, держит удар за отряд.", color:"#ffd866",
      baseDmg:8, atkSpeed:.8, baseHp:400, hpPerLevel:46, baseRegen:1.2, costBase:40, recruitCost:1200,
      range:"melee", projectile:null, projColor:"#ffd866", splash:0,
      sprite:{ src:X, region:[0.02,0.02,0.14,0.20], pixelHeight:48,
        palette:{P:"#ff4d62",h:"#ffd866",f:"#ffd9a8",a:"#e0a83c",b:"#8a5a2b",s:"#c0c8d8",r:"#c0392b",g:"#ffd866"},
        rows:[".....PP.......","....hhhh......","....hffh......","....hhhh......","..aaaaaa.s....",".raaaaaa.s....",".rgaaaaa.s....",".raaaaaa.s....","..aaaaaa......","...aa.aa......","...bb.bb......"] } },
    { id:"necro", name:"Некромант", flavor:"Тёмные сферы взрываются по площади и травят толпы.", color:"#b06cff",
      baseDmg:30, atkSpeed:.7, baseHp:130, hpPerLevel:15, baseRegen:.4, costBase:1400, recruitCost:5000,
      range:"ranged", projectile:"orb", projColor:"#78ff7a", splash:40,
      sprite:{ src:X, region:[0.18,0.02,0.14,0.20], pixelHeight:48,
        palette:{h:"#5a3fd6",f:"#cfe8d8",r:"#3a2a6e",o:"#78ff7a",s:"#8a5a2b",k:"#2c3350"},
        rows:["....hhhh......","...hhhhhh.....","...hffffh.....","...hffffh.....","..rrrrrr.o....",".frrrrrr.o....","..rrrrrr.o....","..rrrrrr.s....","..rrrrrr.s....","...rr.rr......","...kk.kk......"] } },
    { id:"monk", name:"Монах", flavor:"Серия молниеносных ударов. Хрупкий, но очень быстрый.", color:"#ff7a3d",
      baseDmg:12, atkSpeed:2.2, baseHp:180, hpPerLevel:20, baseRegen:.6, costBase:300, recruitCost:2000,
      range:"melee", projectile:null, projColor:"#ff7a3d", splash:0,
      sprite:{ src:X, region:[0.34,0.02,0.14,0.20], pixelHeight:48,
        palette:{f:"#ffd9a8",g:"#ff7a3d",t:"#c05a20",k:"#2c3350",s:"#8a5a2b",w:"#f2f6ff"},
        rows:["....ffff......","....ffff......","....ffff......","..gggggg..s...",".fgggggg..s...",".wgggggg..s...","..gggggg..s...","..gggggg......","...gg.gg......","...kk.kk......"] } }
  );
})();