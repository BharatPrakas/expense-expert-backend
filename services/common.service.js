const parseTemplate = function (template, data) {
  let html = template;
  let dynamicData = data;
  for (const key in dynamicData) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), dynamicData[key]);
  }
  return html;
}
module.exports.parseTemplate = parseTemplate;