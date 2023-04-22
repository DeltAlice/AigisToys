use serde::Deserialize;
use wasm_bindgen::JsValue;

#[derive(Deserialize)]
#[allow(non_snake_case)]
struct MapObject {
    EnemyID: i32,
    Loop: u32,
    PrizeCardID: u32,
}

#[derive(Deserialize)]
pub struct MapEntryInfo(Vec<MapObject>);

impl MapEntryInfo {
    pub fn treasures_sequence(&self) -> Vec<(u32, u32)> {
        let mut count = 0;
        let mut res = Vec::new();
        for obj in &self.0 {
            if obj.EnemyID > 0 && obj.EnemyID != 2000 {
                count += obj.Loop;
            }
            if obj.PrizeCardID > 0 {
                res.push((obj.PrizeCardID, count));
            }
        }
        res
    }
}

impl TryFrom<JsValue> for MapEntryInfo {
    type Error = crate::Error;
    fn try_from(value: JsValue) -> Result<Self, Self::Error> {
        serde_wasm_bindgen::from_value(value).map_err(|e| e.to_string())
    }
}
