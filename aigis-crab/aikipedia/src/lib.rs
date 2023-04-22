use std::collections::HashMap;

use wasm_bindgen::prelude::*;

mod card;
mod map;
mod mission_quest;
mod quest_list;
mod quest_result;
pub use card::CardsInfo;
pub use map::MapEntryInfo;
pub use mission_quest::MissionQuestMap;

pub use quest_list::{Quest, QuestMap};
pub use quest_result::QuestResult;

type Error = String;
type Result<T> = std::result::Result<T, Error>;

#[derive(Default)]
pub struct Aikipedia {
    pub cards_info: Option<CardsInfo>,
    pub quests_info: Option<QuestMap>,
    pub mission_quest: Option<MissionQuestMap>,
    pub maps: Option<HashMap<(String, String), MapEntryInfo>>,
}

impl Aikipedia {
    pub fn register_quests(&mut self, data: JsValue) -> Result<()> {
        self.quests_info = Some(data.try_into()?);
        Ok(())
    }

    pub fn register_mission_quest(&mut self, data: JsValue) -> Result<()> {
        let map: MissionQuestMap = data.try_into()?;
        if let Some(mission_quest) = &mut self.mission_quest {
            mission_quest.extend(map);
        } else {
            self.mission_quest = Some(map);
        }
        Ok(())
    }

    pub fn register_map(
        &mut self,
        map_key: String,
        entry_key: String,
        data: JsValue,
    ) -> Result<()> {
        data.try_into().map(|info: MapEntryInfo| {
            self.maps
                .get_or_insert_with(|| HashMap::new())
                .entry((map_key, entry_key))
                .or_insert(info);
        })
    }
}
