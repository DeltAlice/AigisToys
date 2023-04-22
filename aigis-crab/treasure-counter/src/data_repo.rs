use std::collections::HashMap;

use aikipedia::{Aikipedia, MapEntryInfo, MissionQuestMap, Quest, QuestMap};
use web_sys::console;

use crate::Result;

pub struct DataRepo<'a> {
    quests: &'a QuestMap,
    mission_quest: &'a MissionQuestMap,
    maps: &'a HashMap<(String, String), MapEntryInfo>,
}

impl<'a> DataRepo<'a> {
    pub fn load_from(aikipedia: &'a Aikipedia) -> Result<Self> {
        let quests = aikipedia
            .quests_info
            .as_ref()
            .ok_or_else(|| "Quests not loaded".to_string())?;
        let mission_quest = aikipedia
            .mission_quest
            .as_ref()
            .ok_or_else(|| "MissionQuest not loaded".to_string())?;
        let maps = aikipedia
            .maps
            .as_ref()
            .ok_or_else(|| "Maps not loaded".to_string())?;
        Ok(Self {
            quests,
            mission_quest,
            maps,
        })
    }

    pub fn get_quest(&self, quest_id: u32) -> Result<&Quest> {
        self.quests
            .get_quest(quest_id)
            .ok_or_else(|| format!("Quest {} not found in QuestList", quest_id))
    }

    pub fn check_quest_treasures(&self, quest_id: u32) -> Result<Vec<u32>> {
        let quest = self.get_quest(quest_id)?;
        console::log_1(&format!("quest is {:?}", quest).into());
        let map_no = quest.map_ref();
        let mission_id = self.mission_quest.get_mission_id(quest_id)?;
        let entry_info = [
            format!("Map{}_{}.aar", mission_id, map_no),
            format!("Map{}.aar", map_no),
        ]
        .into_iter()
        .map(|key| self.maps.get(&(key, quest.entry_label())))
        .filter_map(|res| res)
        .nth(0)
        .ok_or_else(|| format!("Map entry not found for quest {}", quest_id))?;
        entry_info
            .treasures_sequence()
            .into_iter()
            .map(|(prize_id, _)| {
                quest.treasure_id(prize_id as usize).ok_or_else(|| {
                    format!("Prize id of quest {} is unexpected({})", quest_id, prize_id)
                })
            })
            .collect::<Result<Vec<u32>>>()
    }
}
