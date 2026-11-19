      window.TBH = window.TBH || {};
      TBH.config = TBH.config || {};
      TBH.config.slots = { weapon:{name:"Оружие",icon:"🗡"}, armor:{name:"Броня",icon:"🛡"}, talisman:{name:"Талисман",icon:"🧿"} };
      TBH.config.statMeta = {
        dmgPct:{label:"урон/лечение",suffix:"%",icon:"⚔",weight:3},
        atkSpd:{label:"скор. атаки",suffix:"%",icon:"⚡",weight:3},
        crit:{label:"шанс крита",suffix:"%",icon:"🎯",weight:4},
        critDmg:{label:"сила крита",suffix:"%",icon:"💥",weight:1.5},
        goldPct:{label:"золото",suffix:"%",icon:"🪙",weight:2},
        hpFlat:{label:"HP героя",suffix:"",icon:"❤",weight:.15},
        defPct:{label:"защита героя",suffix:"%",icon:"🛡",weight:3},
        regen:{label:"реген героя",suffix:"/с",icon:"✚",weight:8}
      };
      TBH.config.rarities = [
        {id:"common",name:"Обычный",color:"#c8d0d8",mult:1,weight:55,bossWeight:15},
        {id:"uncommon",name:"Необычный",color:"#78ff7a",mult:1.35,weight:28,bossWeight:35},
        {id:"rare",name:"Редкий",color:"#38b6ff",mult:1.8,weight:12,bossWeight:30},
        {id:"epic",name:"Эпический",color:"#b06cff",mult:2.4,weight:4,bossWeight:15},
        {id:"legendary",name:"Легендарный",color:"#ffb020",mult:3.2,weight:1,bossWeight:5}
      ];
      TBH.config.items = [
        {id:"rusty_sword",slot:"weapon",name:"Ржавый меч",icon:"🗡",stats:{dmgPct:10}},
        {id:"war_axe",slot:"weapon",name:"Боевой топор",icon:"🪓",stats:{dmgPct:14,crit:1}},
        {id:"spark_staff",slot:"weapon",name:"Посох искр",icon:"🔮",stats:{dmgPct:12,atkSpd:2}},
        {id:"moon_blade",slot:"weapon",name:"Лунный клинок",icon:"🌙",stats:{dmgPct:18,critDmg:12}},
        {id:"leather_vest",slot:"armor",name:"Кожаный жилет",icon:"🥋",stats:{hpFlat:30,defPct:2}},
        {id:"chainmail",slot:"armor",name:"Кольчуга",icon:"⛓",stats:{hpFlat:50,defPct:3,regen:.5}},
        {id:"guard_shield",slot:"armor",name:"Щит стража",icon:"🛡",stats:{hpFlat:75,defPct:4}},
        {id:"dragon_plate",slot:"armor",name:"Драконья броня",icon:"🐉",stats:{hpFlat:120,defPct:5,regen:.8}},
        {id:"lucky_coin",slot:"talisman",name:"Монетка удачи",icon:"🪙",stats:{goldPct:8}},
        {id:"wolf_fang",slot:"talisman",name:"Коготь волка",icon:"🐺",stats:{crit:3,critDmg:10}},
        {id:"wind_feather",slot:"talisman",name:"Перо ветра",icon:"🪶",stats:{atkSpd:5}},
        {id:"greed_seal",slot:"talisman",name:"Печать алчности",icon:"💰",stats:{goldPct:12,dmgPct:4}}
      ];
