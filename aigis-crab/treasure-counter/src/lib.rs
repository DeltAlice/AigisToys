use std::collections::VecDeque;

use aikipedia::{Aikipedia, QuestResult};
use serde::Serialize;
use wasm_bindgen::prelude::*;

use crate::data_repo::DataRepo;

mod data_repo;
type Result<T> = std::result::Result<T, String>;

#[wasm_bindgen]
pub struct TreasureCounter {
    aikipedia: Aikipedia,
    records: VecDeque<Record>,
}

#[wasm_bindgen]
impl TreasureCounter {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            aikipedia: Aikipedia::default(),
            records: VecDeque::new(),
        }
    }

    pub fn register_quests(&mut self, data: JsValue) -> Result<()> {
        self.aikipedia.register_quests(data)
    }

    pub fn register_mission_quest(&mut self, data: JsValue) -> Result<()> {
        self.aikipedia.register_mission_quest(data)
    }

    pub fn register_map(
        &mut self,
        map_key: String,
        entry_key: String,
        data: JsValue,
    ) -> Result<()> {
        self.aikipedia.register_map(map_key, entry_key, data)
    }

    pub fn check_treasures(&mut self, data: JsValue) -> Result<JsValue> {
        let timestamp = chrono::Local::now().format("%m/%d %H:%M:%S").to_string();
        let result: QuestResult = data.try_into()?;
        let treasures = DataRepo::load_from(&self.aikipedia)
            .and_then(|repo| repo.check_quest_treasures(result.quest_id()))
            .map(|treasures| {
                treasures
                    .into_iter()
                    .enumerate()
                    .map(|(order, idx)| TreasureInfo {
                        idx,
                        num: result.prize_num(order),
                    })
                    .filter(|info| info.num > 0)
                    .collect::<Vec<_>>()
            })?;
        self.records.push_front(Record {
            quest_id: result.quest_id(),
            treasures,
            timestamp,
        });
        serde_wasm_bindgen::to_value(self.records.front().unwrap()).map_err(|err| err.to_string())
    }

    pub fn history(&self) -> Result<JsValue> {
        serde_wasm_bindgen::to_value(&self.records).map_err(|e| e.to_string())
    }
}

#[derive(Serialize)]
struct TreasureInfo {
    pub idx: u32,
    pub num: u32,
}

#[derive(Serialize)]
struct Record {
    quest_id: u32,
    treasures: Vec<TreasureInfo>,
    timestamp: String,
}
