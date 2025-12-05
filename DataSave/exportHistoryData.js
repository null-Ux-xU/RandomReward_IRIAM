/**
 * 履歴をtextファイル用に整形する
 * 
 * @param {object[]} history 
 * @param {object[]} rarityDisplayNames 
 * @returns string || false
 */
export function buildHistoryToTextString(history, rarityDisplayNames) {
    if (!history || Object.keys(history).length === 0) {
        return false;
    }

    let output = "=== 履歴データ一覧 ===\n\n";

    for (const date in history) {
        output += `${date}\n`;

        const userNames = history[date];
        for (const userName in userNames) {
            output += `    ▼ ${userName}\n`;

            const gachas = userNames[userName];
            for (const gachaName in gachas) {
                const stringGachaName = gachaName || "名無し";
                output += `        - ガチャ:${stringGachaName}\n`;

                const data = gachas[gachaName];
                if (data.results && data.results.length > 0) {
                    data.results.forEach((res, index) => {
                        const totalVal = res.reduce((sum, obj) => sum + (obj.val ?? 1), 0);
                        output += `            --- ${index + 1}回目の結果(${totalVal}連) ---\n`;
                        for(const obj of res) {
                            const rarity = rarityDisplayNames[obj.rarity] || obj.rarity;
                            const item = obj.item || "不明";
                            const val = obj.val || 1;

                            output += `            ・${rarity} / ${item} / ×${val}\n`;
                        }
                        output += `\n`;
                    });
                } else {
                    output += `            （結果なし）\n`;
                }
            }
        }
        output += "\n";
    }
    return output;
}

/**
 * 履歴をcsv用に整形して取得
 * 
 * @param {object[]} history 
 * @param {object[]} rarityDisplayNames 
 * @returns string || false
 */
export function buildHistoryToCsvString(history, rarityDisplayNames) {
    if (!history || Object.keys(history).length === 0) {
        return false;
    }

    let output = `日付,ユーザー,ガチャ,回数,レアリティ,アイテム名,個数\n`;

    for (const date in history) {

        const userNames = history[date];
        for (const userName in userNames) {

            const gachas = userNames[userName];
            for (const gachaName in gachas) {
                const stringGachaName = gachaName || "名無し";

                const data = gachas[gachaName];
                if (data.results && data.results.length > 0) {
                    data.results.forEach((res, index) => {
                        const totalVal = res.reduce((sum, obj) => sum + (obj.val ?? 1), 0);

                        for(const obj of res) {
                            const rarity = rarityDisplayNames[obj.rarity] || obj.rarity;
                            const item = obj.item || "不明";
                            const val = obj.val || 1;

                            output += `${date},${userName}さん,${stringGachaName},${index + 1}回目の結果(${totalVal}連),${rarity},${item},${val}個\n`;
                        }
                    });
                } else {
                    return false;
                }
            }
        }
    }
    return output;
}
