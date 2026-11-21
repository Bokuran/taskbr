/* Выполняется ПЕРВЫМ скриптом: гарантирует чистый старт после «Стереть всё»,
   даже если автосохранение при выгрузке страницы успело перезаписать сейв. */
(function(){
  try{
    if(localStorage.getItem("tbh_wipe")){
      ["tbh_idle_equipment_v1","tbh_backup_v1","tbh_import_flag","tbh_wipe"].forEach(function(k){localStorage.removeItem(k)});
    }
  }catch(e){}
})();