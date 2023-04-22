use serde::Deserialize;
use wasm_bindgen::JsValue;

pub struct QuestResult {
    id: u32,
    lottery: Vec<u32>,
}

impl QuestResult {
    pub fn quest_id(&self) -> u32 {
        self.id
    }
    pub fn prize_num(&self, idx: usize) -> u32 {
        *self.lottery.get(idx).unwrap_or(&0)
    }
}

impl TryFrom<JsValue> for QuestResult {
    type Error = crate::Error;
    fn try_from(value: JsValue) -> Result<Self, Self::Error> {
        #[derive(Debug, Deserialize)]
        #[allow(non_snake_case)]
        struct Lottery {
            Result: Vec<String>,
        }

        #[derive(Debug, Deserialize)]
        #[allow(non_snake_case)]
        struct MetaInfo {
            QuestID: String,
        }
        #[derive(Debug, Deserialize)]
        #[serde(rename_all = "UPPERCASE")]
        struct QuestResultValue {
            qr: MetaInfo,
            lottery: Lottery,
        }

        let value =
            serde_wasm_bindgen::from_value::<QuestResultValue>(value).map_err(|e| e.to_string())?;
        Ok(QuestResult {
            id: value.qr.QuestID.parse::<u32>().map_err(|e| e.to_string())?,
            lottery: value
                .lottery
                .Result
                .iter()
                .map(|s| s.parse::<u32>())
                .collect::<Result<Vec<_>, _>>()
                .map_err(|e| e.to_string())?,
        })
    }
}
