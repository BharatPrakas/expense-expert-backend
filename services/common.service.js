const parseTemplate = function (template, data) {
  let html = template;
  let dynamicData = data;
  for (const key in dynamicData) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), dynamicData[key]);
  }
  return html;
}
module.exports.parseTemplate = parseTemplate;

const sortDate = function (sortData, sortItem) {
  for (let i = 0; i < sortData.length; i++) {
    for (let j = 0; j < sortData.length; j++) {
      if (sortData[i].created.valueOf() > sortData[j].created.valueOf()) {
        let temp = sortData[i];
        sortData[i] = sortData[j];
        sortData[j] = temp;
      }
    }
  }
  return sortData;
}
module.exports.sortDate = sortDate;

// const objectRename = function (data, originalKey, replaceKey) {
//   for (let i = 0; i < data.length; i++) {
    
//   }
//   return data;
// }
// module.exports.objectRename = objectRename;