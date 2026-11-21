(function(){
  window.TBH = window.TBH || {};
  TBH.config = TBH.config || {};
  const X = "assets/expansion.png";
  TBH.config.heroes = [
    { id:"paladin", name:"Паладин", flavor:"Святая стена: много HP и регена, держит удар за отряд.", color:"#ffd866",
      baseDmg:8, atkSpeed:.8, baseHp:400, hpPerLevel:46, baseRegen:1.2, costBase:40, recruitCost:0,
      range:"melee", projectile:null, projColor:"#ffd866", splash:0,
      sprite:{ src:X, region:[0.02,0.02,0.14,0.22], pixelHeight:48 } },
    { id:"archer", name:"Лучница", flavor:"Быстрые стрелы из-за спины танка.", color:"#4fd873",
      baseDmg:10, atkSpeed:1.65, baseHp:150, hpPerLevel:18, baseRegen:.5, costBase:65, recruitCost:150,
      range:"ranged", projectile:"arrow", projColor:"#e8d8a8", splash:0,
      sprite:{ src:X, region:[0.02,0.26,0.14,0.22], pixelHeight:48 } },
    { id:"mage", name:"Маг", flavor:"Огненные шары по площади. Хрупкий, но смертельный.", color:"#ff5a3d",
      baseDmg:42, atkSpeed:.55, baseHp:120, hpPerLevel:14, baseRegen:.4, costBase:900, recruitCost:2500,
      range:"ranged", projectile:"fire", projColor:"#ff8a3d", splash:52,
      sprite:{ src:X, region:[0.18,0.26,0.14,0.22], pixelHeight:48 } },
    { id:"monk", name:"Монах", flavor:"Серия молниеносных ударов. Хрупкий, но очень быстрый.", color:"#ff7a3d",
      baseDmg:12, atkSpeed:2.2, baseHp:180, hpPerLevel:20, baseRegen:.6, costBase:300, recruitCost:2000,
      range:"melee", projectile:null, projColor:"#ff7a3d", splash:0,
      sprite:{ src:X, region:[0.33,0.02,0.14,0.22], pixelHeight:48, face:"left" } },
    { id:"rogue", name:"Разбойник", flavor:"Теневые клинки: быстрые критические удары из-за спины.", color:"#8a5cff",
      baseDmg:16, atkSpeed:1.9, baseHp:160, hpPerLevel:18, baseRegen:.5, costBase:500, recruitCost:1800,
      range:"melee", projectile:null, projColor:"#b06cff", splash:0,
      sprite:{ src:X, region:[0.33,0.26,0.14,0.22], pixelHeight:48, face:"left" } },
    { id:"necro", name:"Некромант", flavor:"Тёмные сферы бьют по площади с любой дистанции; зелёное пламя лечит раненых.", color:"#b06cff", role:"healer",
      baseDmg:26, atkSpeed:.8, baseHp:140, hpPerLevel:16, baseRegen:.7, costBase:2500, recruitCost:8000,
      range:"ranged", projectile:"orb", projColor:"#78ff7a", splash:40,
      sprite:{ src:X, region:[0.18,0.02,0.14,0.22], pixelHeight:48 } }
  ];
})();