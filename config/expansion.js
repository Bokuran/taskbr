window.TBH = window.TBH || {};
TBH.config = TBH.config || {};
TBH.config.partyCap = 4;
const SHEET = "assets/expansion.png";

TBH.config.heroes.push(
  { id:"paladin", name:"Паладин", flavor:"Святая стена: много HP и регена, держит удар за отряд.", color:"#ffd866",
    baseDmg:8, atkSpeed:.8, baseHp:400, hpPerLevel:46, baseRegen:1.2, costBase:40, recruitCost:1200,
    range:"melee", projectile:null, projColor:"#ffd866", splash:0,
    sprite:{ src:SHEET, region:[0.01,0.01,0.15,0.21], pixelHeight:48,
      palette:{P:"#ff4d62",h:"#ffd866",f:"#ffd9a8",a:"#e0a83c",b:"#8a5a2b",s:"#c0c8d8",r:"#c0392b",g:"#ffd866"},
      rows:[".....PP.......","....hhhh......","....hffh......","....hhhh......","..aaaaaa.s....",".raaaaaa.s....",".rgaaaaa.s....",".raaaaaa.s....","..aaaaaa......","...aa.aa......","...bb.bb......"] } },
  { id:"necro", name:"Некромант", flavor:"Тёмные сферы взрываются по площади и травят толпы.", color:"#b06cff",
    baseDmg:30, atkSpeed:.7, baseHp:130, hpPerLevel:15, baseRegen:.4, costBase:1400, recruitCost:5000,
    range:"ranged", projectile:"orb", projColor:"#78ff7a", splash:40,
    sprite:{ src:SHEET, region:[0.17,0.01,0.15,0.21], pixelHeight:48,
      palette:{h:"#5a3fd6",f:"#cfe8d8",r:"#3a2a6e",o:"#78ff7a",s:"#8a5a2b",k:"#2c3350"},
      rows:["....hhhh......","...hhhhhh.....","...hffffh.....","...hffffh.....","..rrrrrr.o....",".frrrrrr.o....","..rrrrrr.o....","..rrrrrr.s....","..rrrrrr.s....","...rr.rr......","...kk.kk......"] } },
  { id:"monk", name:"Монах", flavor:"Серия молниеносных ударов. Хрупкий, но очень быстрый.", color:"#ff7a3d",
    baseDmg:12, atkSpeed:2.2, baseHp:180, hpPerLevel:20, baseRegen:.6, costBase:300, recruitCost:2000,
    range:"melee", projectile:null, projColor:"#ff7a3d", splash:0,
    sprite:{ src:SHEET, region:[0.33,0.01,0.15,0.21], pixelHeight:48,
      palette:{f:"#ffd9a8",g:"#ff7a3d",t:"#c05a20",k:"#2c3350",s:"#8a5a2b",w:"#f2f6ff"},
      rows:["....ffff......","....ffff......","....ffff......","..gggggg..s...",".fgggggg..s...",".wgggggg..s...","..gggggg..s...","..gggggg......","...gg.gg......","...kk.kk......"] } }
);

Object.assign(TBH.config.monsters, {
  crystal_golem:{id:"crystal_golem",name:"Кристальный голем",color:"#38dfff",hpMult:2.2,speedMult:.6,goldMult:1.25,flying:false,sprite:{src:SHEET,region:[0.50,0.50,0.16,0.45],palette:{g:"#38b6ff",e:"#a8f0ff"},rows:["..gggggg..",".ggegggeg.","gggggggggg","gggggggggg","ggg.ggg.gg","..gg..gg.."]}},
  crystal_titan:{id:"crystal_titan",name:"Кристальный титан",color:"#38dfff",hpMult:1,speedMult:.55,goldMult:1,flying:false,boss:true,sprite:{src:SHEET,region:[0.50,0.50,0.16,0.45],palette:{g:"#38b6ff",e:"#a8f0ff"},rows:["..gggggg..",".ggegggeg.","gggggggggg","gggggggggg","ggg.ggg.gg","..gg..gg.."]}},
  flame_demon:{id:"flame_demon",name:"Пламенный демон",color:"#ff5a3d",hpMult:1.2,speedMult:1.1,goldMult:1.15,flying:false,sprite:{src:SHEET,region:[0.66,0.50,0.16,0.45],palette:{r:"#ff5a3d",e:"#ffd866",o:"#ff7a3d"},rows:[".h....h...",".hr..rh...","..rrrr....","..reer....","..rrrr....","..roor....","...rr.....","..r..r...."]}},
  flame_lord:{id:"flame_lord",name:"Владыка пламени",color:"#ff5a3d",hpMult:1,speedMult:.7,goldMult:1,flying:false,boss:true,sprite:{src:SHEET,region:[0.66,0.50,0.16,0.45],palette:{r:"#ff5a3d",e:"#ffd866",o:"#ff7a3d"},rows:[".h....h...",".hr..rh...","..rrrr....","..reer....","..rrrr....","..roor....","...rr.....","..r..r...."]}},
  shadow_wraith:{id:"shadow_wraith",name:"Теневой призрак",color:"#b06cff",hpMult:1,speedMult:1.25,goldMult:1.1,flying:true,sprite:{src:SHEET,region:[0.82,0.50,0.17,0.45],palette:{w:"#2c2c3e",e:"#ff4d62"},rows:["...wwww...","..wwwwww..","..wewwew..","..wwwwww..","...wwww...","..w.ww.w.."]}},
  shadow_king:{id:"shadow_king",name:"Владыка теней",color:"#b06cff",hpMult:1,speedMult:.65,goldMult:1,flying:false,boss:true,sprite:{src:SHEET,region:[0.82,0.50,0.17,0.45],palette:{w:"#2c2c3e",e:"#ff4d62"},rows:["...wwww...","..wwwwww..","..wewwew..","..wwwwww..","...wwww...","..w.ww.w.."]}}
});

TBH.config.levels.push(
  {id:"crystal",name:"Кристальные пещеры",icon:"💎",waves:10,hpMult:1.5,goldMult:1.4,monsters:["crystal_golem","golem"],boss:"crystal_titan",colors:{sky1:"#141031",sky2:"#241245",hill1:"#1a0f33",hill2:"#120a26",ground:"#1c1236"},stars:true,musicRoot:87.3,bg:{src:SHEET,region:[0.01,0.46,0.47,0.14]}},
  {id:"volcano",name:"Вулканическая пустошь",icon:"🌋",waves:10,hpMult:1.65,goldMult:1.55,monsters:["flame_demon","imp"],boss:"flame_lord",colors:{sky1:"#2a0a08",sky2:"#451408",hill1:"#330c06",hill2:"#220804",ground:"#3a1008"},stars:false,musicRoot:82,bg:{src:SHEET,region:[0.01,0.61,0.47,0.14]}},
  {id:"cursed",name:"Проклятый лес",icon:"🌲",waves:10,hpMult:1.85,goldMult:1.75,monsters:["shadow_wraith","wraith"],boss:"shadow_king",colors:{sky1:"#0e2a1f",sky2:"#123a2e",hill1:"#0c2f26",hill2:"#0a241d",ground:"#123524"},stars:false,musicRoot:92,bg:{src:SHEET,region:[0.01,0.76,0.47,0.14]}}
);