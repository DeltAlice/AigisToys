use std::collections::HashMap;

use itertools::izip;
use serde::Deserialize;
use wasm_bindgen::JsValue;

#[derive(Debug)]
pub struct Quest {
    entry: u32,
    map: u32,
    treasures: [u32; 5],
}

impl Quest {
    pub fn map_ref(&self) -> u32 {
        self.map
    }
    pub fn entry_label(&self) -> String {
        format!("Entry{:02}.atb", self.entry)
    }
    pub fn treasure_id(&self, sequence_number: usize) -> Option<u32> {
        self.treasures.get(sequence_number - 1).copied()
    }
}

pub struct QuestMap(HashMap<u32, Quest>);

impl QuestMap {
    pub fn get_quest(&self, id: u32) -> Option<&Quest> {
        self.0.get(&id)
    }
}

impl TryFrom<JsValue> for QuestMap {
    type Error = crate::Error;
    fn try_from(value: JsValue) -> Result<Self, Self::Error> {
        #[derive(Deserialize, Debug)]
        #[allow(non_snake_case)]
        struct QuestListValue {
            QuestID: Vec<String>,
            EntryNo: Vec<String>,
            MapNo: Vec<String>,
            Treasure1: Vec<String>,
            Treasure2: Vec<String>,
            Treasure3: Vec<String>,
            Treasure4: Vec<String>,
            Treasure5: Vec<String>,
        }

        let value = serde_wasm_bindgen::from_value::<QuestListValue>(value)
            .map_err(|err| err.to_string())?;

        let mut res = HashMap::new();
        for (id, entry, map, t1, t2, t3, t4, t5) in izip!(
            value.QuestID,
            value.EntryNo,
            value.MapNo,
            value.Treasure1,
            value.Treasure2,
            value.Treasure3,
            value.Treasure4,
            value.Treasure5
        ) {
            let id = id.parse::<u32>().map_err(|err| err.to_string())?;
            let entry = entry.parse::<u32>().map_err(|err| err.to_string())?;
            let map = map.parse::<u32>().map_err(|err| err.to_string())?;
            let t1 = t1.parse::<u32>().map_err(|err| err.to_string())?;
            let t2 = t2.parse::<u32>().map_err(|err| err.to_string())?;
            let t3 = t3.parse::<u32>().map_err(|err| err.to_string())?;
            let t4 = t4.parse::<u32>().map_err(|err| err.to_string())?;
            let t5 = t5.parse::<u32>().map_err(|err| err.to_string())?;
            res.insert(
                id,
                Quest {
                    entry,
                    map,
                    treasures: [t1, t2, t3, t4, t5],
                },
            );
        }
        Ok(Self(res))
    }
}
