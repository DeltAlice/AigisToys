use serde::Deserialize;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct CardsInfo {
    // ability: Vec<u32>,
    // card_id: Vec<u32>,
}
