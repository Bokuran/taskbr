(function(){
  window.TBH = window.TBH || {};
  TBH.config = TBH.config || {};
  const X = "assets/expansion.png";
  const BOSS = "assets/boss_atlas.png";
  const CRY=[0.50,0.57,0.15,0.35], FLA=[0.66,0.55,0.15,0.39], SHA=[0.82,0.55,0.15,0.38];
  // три равные колонки атласа боссов на розовом фоне: титан, владыка пламени, владыка теней
  const BCRY=[0.012,0.02,0.3093,0.96], BFLA=[0.3453,0.02,0.3093,0.96], BSHA=[0.6787,0.02,0.3093,0.96];
  TBH.config.monsters = {
    crystal_golem:{id:"crystal_golem",name:"Кристальный голем",color:"#38dfff",hpMult:2.2,speedMult:.6,goldMult:1.25,flying:false,sprite:{src:X,region:CRY}},
    flame_demon:{id:"flame_demon",name:"Пламенный демон",color:"#ff5a3d",hpMult:1.2,speedMult:1.1,goldMult:1.15,flying:false,sprite:{src:X,region:FLA,face:"left"}},
    shadow_wraith:{id:"shadow_wraith",name:"Теневой призрак",color:"#b06cff",hpMult:1,speedMult:1.25,goldMult:1.1,flying:true,sprite:{src:X,region:SHA,face:"left"}},
    crystal_titan:{id:"crystal_titan",name:"Кристальный титан",color:"#38dfff",hpMult:1,speedMult:.55,goldMult:1,flying:false,boss:true,sprite:{src:BOSS,region:BCRY,pixelHeight:64,fb:{src:X,region:CRY}}},
    flame_lord:{id:"flame_lord",name:"Владыка пламени",color:"#ff5a3d",hpMult:1,speedMult:.7,goldMult:1,flying:false,boss:true,sprite:{src:BOSS,region:BFLA,pixelHeight:64,face:"left",fb:{src:X,region:FLA,face:"left"}}},
    shadow_king:{id:"shadow_king",name:"Владыка теней",color:"#b06cff",hpMult:1,speedMult:.65,goldMult:1,flying:false,boss:true,sprite:{src:BOSS,region:BSHA,pixelHeight:64,face:"left",fb:{src:X,region:SHA,face:"left"}}}
  };
})();