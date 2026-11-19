      window.TBH = window.TBH || {};
      TBH.config = TBH.config || {};
      TBH.config.balance = {
        startGold: 0,
        hero: { dmgGrowth: 1.05, milestoneEvery: 25, milestoneMult: 2, costGrowth: 1.16 },
        enemy: { hpBase: 10, hpGrowth: 1.18, goldBase: 3, goldGrowth: 1.13, countBase: 5, countPerWave: .5, countMax: 12, spawnBase: 1.45, spawnMin: .55, speedBase: 34, speedPerWave: .4, speedMaxBonus: 30 },
        boss: { hpMult: 10, goldMult: 8, timer: 45, finalMult: 2 },
        combat: {
          defCap: 60, heroBaseRegen: .6,
          monsterDmgPow: .5, monsterDmgScale: 1.7, bossDmgMult: 1.4,
          normalHitCapPct: .45, bossHitCapPct: .70,
          monsterAtkInt: 1.25, bossAtkInt: 1.1, attackRange: 38, fullHealOnWave: true
        },
        party: { hpBonusPerLvl: .08, lazaretCostBase: 60, lazaretCostGrowth: 1.55 },
        economy: { waveBonusMult: 2.5, mineCostBase: 120, mineCostGrowth: 1.7, goldPerMineLevel: .08 },
        drops: { chance: .10, bossChance: 1, bossExtraChance: .35, inventoryCap: 60, itemLevelScale: .10, sellBase: 6, sellPerLevel: 3, offlineItemCap: 3 },
        crit: { baseChance: 5, baseDamage: 150 },
        prestige: { minWave: 20, formulaDiv: 8, formulaPow: 1.5, gemBonus: .12 },
        offline: { minSeconds: 60, maxSeconds: 14400, efficiency: .5 }
      };
