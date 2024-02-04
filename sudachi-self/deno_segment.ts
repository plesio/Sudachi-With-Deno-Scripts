import $ from "https://deno.land/x/dax@0.38.0/mod.ts";
const encoder = new TextEncoder();

/// 動かす前に定数を調整すること MEMO: ./sudachi-self が起点PATHとなる
const INPUT_FILE_PATH = "../input.txt";
const OUTPUT_FILE_DIR_PATH = "../";

const SUDACHI_DIR_PATH = "../sudachi-0";
const SUDACHI_JAR_NAME = "sudachi-0.7.3.jar";
const SYSTEM_DIC_PATH = "../sudachi-dictionary-20240109/system_core.dic";
const USER_DIC_CSV_PATH = "../sudachi-self/user_dic.csv";
const USER_DIC_OUT_PATH = "../sudachi-self/user.dic";
/// ---

const SUDACHI_EXEC = `${SUDACHI_DIR_PATH}/${SUDACHI_JAR_NAME}`
// call sudachi user dictionary builder
async function buildUserDictionary() {
    await $`java -Dfile.encoding=UTF-8 -cp ${SUDACHI_EXEC} com.worksap.nlp.sudachi.dictionary.UserDictionaryBuilder -o ${USER_DIC_OUT_PATH} -s ${SYSTEM_DIC_PATH} ${USER_DIC_CSV_PATH}`;
    //console.log(result.code);
}
await buildUserDictionary();

// 
async function segmentText(): Promise<{ word: string; type: string; }[]> {
    const txt = await Deno.readTextFile(INPUT_FILE_PATH);
    const result = await $`java -Dfile.encoding=UTF-8 -jar ${SUDACHI_EXEC} -s '{"userDict":["${USER_DIC_OUT_PATH}"], "systemDict":"${SYSTEM_DIC_PATH}"}'`.stdinText(txt).stdout("piped");
    const resultAllTxt = `${result.stdout}`;
    await Deno.writeFile(OUTPUT_FILE_DIR_PATH + "result_segment.txt", encoder.encode(resultAllTxt), { append: false });
    const resultArray = resultAllTxt.split("\n").map((line) => line.split("\t"));
    return resultArray.map((txt) => {
        return { word: txt[0], type: txt[1]?.split(",")[0] ?? "" }
    });
}
const segmentsArray = await segmentText();
// console.log(segmentsArray);

// 単語の重複の回数を数える
const wordCountMap = new Map<string, number>();
segmentsArray.forEach((segment) => {
    const { word, type } = segment;
    if (word === "EOS" && type === "") return;
    else if (type === "助詞" || type === "助動詞") return;
    // カウントしない \n や \t などの文字を除外
    else if (word.match(/\s/g)) return;
    // 句読点や濁点単品の文字を除外
    else if (word.match(/[\u3000-\u303F]/g)) return;
    // ひらがな1文字（助詞と思われるもの）を除外
    else if (word.match(/^[ぁ-ん]$/)) return;

    //
    if (wordCountMap.has(word)) {
        wordCountMap.set(word, wordCountMap.get(word)! + 1);
    } else {
        wordCountMap.set(word, 1);
    }
});

// 回数が多い順に ファイルに書き出し
const sorted = new Map([...wordCountMap.entries()].sort((a, b) => b[1] - a[1]));

let sortedTxt = "";
const obj: Record<string, number> = {};
for (const [key, value] of sorted) {
    obj[`${key}`] = value;
    sortedTxt += `${key}: ${value}\n`;
}
await Deno.writeFile(OUTPUT_FILE_DIR_PATH + "result_count.txt", encoder.encode(sortedTxt), { append: false });
await Deno.writeFile(OUTPUT_FILE_DIR_PATH + "result_count_json.txt", encoder.encode(JSON.stringify(obj, null, 4)), { append: false });


