const fs = require('fs').promises;
const path = require('path');
const utils = require('./utils.js');

/**
 * Darbiniu funkciju su failu sistema objektas
 */
const data = {};
data.baseDir = path.join(__dirname, '../.data/');

/**
 * Absoliutaus kelio kontravimas iki nurodyto failo esancio .data folder'yje.
 * @param {string} dir Sub-folder'is esantis .data folder'yje.
 * @param {string} file Failo pavadinimas be failo pletinio.
 * @returns {string} Absoliutus kelias iki failo.
 */
function fullPath(dir, file) {
    return `${data.baseDir}${dir}/${file}.json`;
}

/**
 * JSON failo kurimas .data folder'yje.
 * @param {string} dir Sub-folder'is esantis .data folder'yje.
 * @param {string} fileName Kuriamo failo pavadinimas be failo pletinio.
 * @param {Object} content JavaScript objektas, pvz.: `{name: "Marsietis"}`.
 * @returns {boolean} Pozymis, ar funkcija sekmingai sukure nurodyta faila.
 */
data.create = async (dir, fileName, content) => {
    let fileDescriptor = null;
    try {
        fileDescriptor = await fs.open(fullPath(dir, fileName), 'wx');
        await fs.writeFile(fileDescriptor, JSON.stringify(content));
        return 'Failas sukurtas';
    } catch (error) {
        return 'Klaida kuriant faila';
    } finally {
        if (fileDescriptor) {
            await fileDescriptor.close();
        }
    }
}

/**
 * JSON failo turinio nuskaitymas.
 * @param {string} dir Sub-folder'is esantis .data folder'yje.
 * @param {string} fileName Kuriamo failo pavadinimas be failo pletinio.
 * @returns {Object} Isparsintas failo turinys.
 */
data.read = async (dir, fileName) => {
    try {
        const content = await fs.readFile(fullPath(dir, fileName), 'utf-8');
        return utils.parseJSONtoObject(content);
    } catch (error) {
        return 'Nepavyko perskaityti failo';
    }
}

/**
 * JSON failo turinio atnaujinimas .data folder'yje.
 * @param {string} dir Sub-folder'is esantis .data folder'yje.
 * @param {string} fileName Kuriamo failo pavadinimas be failo pletinio.
 * @param {Object} content JavaScript objektas, pvz.: `{name: "Marsietis"}`.
 * @returns {boolean} Pozymis, ar funkcija sekmingai atnaujintas nurodyta faila.
 */
data.update = async (dir, fileName, content) => {
    let fileDescriptor = null;
    try {
        fileDescriptor = await fs.open(fullPath(dir, fileName), 'r+');
        await fileDescriptor.truncate();
        await fs.writeFile(fileDescriptor, JSON.stringify(content));
        return 'Failas atnaujintas';
    } catch (error) {
        return 'Klaida atnaujinant faila';
    } finally {
        if (fileDescriptor) {
            await fileDescriptor.close();
        }
    }
}

/**
 * JSON failo istrinimas .data folder'yje.
 * @param {string} dir Sub-folder'is esantis .data folder'yje.
 * @param {string} fileName Kuriamo failo pavadinimas be failo pletinio.
 * @returns {boolean} Pozymis, ar funkcija sekmingai istrintas nurodyta faila.
 */
data.delete = async (dir, fileName) => {
    try {
        await fs.unlink(fullPath(dir, fileName));
        return 'Failas istrintas';
    } catch (error) {
        return 'Nepavyko istrinti failo';
    }
}

/**
 * Folderyje esanciu failu pavadinimu sarasas
 * @param {string} dir Sub-folder'is esantis .data folder'yje.
 * @returns {function}
 */
data.folderContent = async (dir) => {
    const fullPathToFolder = data.baseDir + dir + '/';
    try {
        const fileList = await fs.readdir(fullPathToFolder);
        const trimmedFileNames = [];
        for (const file of fileList) {
            const trimmedFile = file.split('.').slice(0, -1).join('.');
            trimmedFileNames.push(trimmedFile);
        }
        return trimmedFileNames;
    } catch (error) {
        return error;
    }
}

module.exports = data;