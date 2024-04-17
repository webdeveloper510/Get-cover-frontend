export function checkWordsExist(string, words) {
    for (let i = 0; i < words.length; i++) {
        if (string.includes(words[i])) {
            return true; // If any word is found, return true
        }
    }
    return false; // If no word is found, return false
}