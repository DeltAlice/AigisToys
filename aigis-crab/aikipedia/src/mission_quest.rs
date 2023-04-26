use crate::Result;
use serde::Deserialize;
use std::collections::HashMap;
use wasm_bindgen::JsValue;

pub struct MissionQuestMap(HashMap<u32, u32>);

impl MissionQuestMap {
    pub fn get_mission_id(&self, quest_id: u32) -> Result<u32> {
        self.0
            .get(&quest_id)
            .copied()
            .ok_or_else(|| format!("Failed to find mission id for quest {}", quest_id))
    }
    pub fn extend(&mut self, other: MissionQuestMap) {
        self.0.extend(other.0)
    }
}

impl TryFrom<JsValue> for MissionQuestMap {
    type Error = crate::Error;
    fn try_from(value: JsValue) -> Result<Self> {
        parse_as_normal_missions(value.clone()).or_else(|_| parse_as_history_missions(value))
    }
}

fn parse_as_normal_missions(value: JsValue) -> Result<MissionQuestMap> {
    #[allow(non_snake_case)]
    #[derive(Deserialize, Debug)]
    struct MissionQuest {
        MissionID: u32,
        QuestID: u32,
    }

    serde_wasm_bindgen::from_value::<Vec<MissionQuest>>(value)
        .map(|v| v.into_iter().map(|mq| (mq.QuestID, mq.MissionID)).collect())
        .map(|m| MissionQuestMap(m))
        .map_err(|err| err.to_string())
}

fn parse_as_history_missions(value: JsValue) -> Result<MissionQuestMap> {
    #[allow(non_snake_case)]
    #[derive(Deserialize, Debug)]
    struct HistoryMissionQuest {
        MissionID: u32,
        QuestIdList: String,
    }
    let raw: Vec<HistoryMissionQuest> =
        serde_wasm_bindgen::from_value(value).map_err(|err| err.to_string())?;
    let mut map = HashMap::<u32, u32>::new();
    for mq in raw {
        let mission_id = mq.MissionID;
        for quest_id in mq
            .QuestIdList
            .split(',')
            .filter_map(|s| s.parse::<u32>().ok())
        {
            map.insert(quest_id, mission_id);
        }
    }
    Ok(MissionQuestMap(map))
}
