/**
 * Created by mac on 16/8/10.
 */
const fs = require('fs');
const func = require('../common/func');

exports.dbbuild = function (tables, markdown) {
  var text = '# 数据库文档\n\n';
  text += `<style type="text/css">
    table {table-layout: fixed;}
    th {background-color:rgb(0, 136, 204);color: white}
    td {word-break: break-all; word-wrap:break-word;}
</style>
`
  const tableHeader =
    '|字段|类型|允许为空|是否主键|是否自增|说明|\n' +
    '|:---:|:---:|:---:|:---:|:---:|:---:|\n';

  //对表名字进行排序
  var tablesArray = Object.keys(tables);
  func.quickSort(tablesArray, 0, tablesArray.length - 1);

  //分别处理每个表
  for (var table of tablesArray) {
    text = text + '## ' + table + '\n';
    text += tableHeader;
    //分别处理表的每个字段
    for (var field in tables[table]) {
      text = text + '|' + field;
      //分别处理字段的每个属性
      var property = tables[table][field];
      text = text +
        '|' + func.typeTransform(property.type) +
        '|' + func.spaceToFalse(property.allowNull) +
        '|' + func.spaceToFalse(property.primaryKey) +
        '|' + func.spaceToFalse(property.autoIncrement) +
        '|' + func.spaceToFalse(property.description);
      text += '|\n'
    }
    text += '\n'
  }

  //写入文件
  fs.writeFile(markdown.path + markdown.file, text, (err) => {
    if (err) throw err;
    console.log('It\'s saved!'); //文件被保存
    return true;
  });
};


exports.apibuild = function (apis, markdown) {
  console.log(apis);
  var text = '# API文档\n\n';
  text += `<style type="text/css">
    table {table-layout: fixed;}
    th {background-color:rgb(0, 136, 204);color: white}
    td {word-break: break-all; word-wrap:break-word;}
</style>
`
  const paramTableHeader =
    '|参数名字|默认值|参数类型|说明|\n' +
    '|:---:|:---:|:---:|:---:|\n';
  const returnTableHeader =
    '|类型|说明|\n' +
    '|:---:|:---:|\n';

  for (var api in apis) {
    var properties = func.propertyAssign(apis[api]);
    var description = properties.description + '\n';
    var path = '```' + properties.path + '```' + '\n';
    var method = properties.method + '\n';
    var example = properties.example + '\n';
    var other = properties.other + '\n';
    var paramTable = paramTableHeader +
      ((properties.paramTable === '') ? '| | | | |' : properties.paramTable) +
      '\n';
    var returnTable = returnTableHeader +
      ((properties.returnTable === '') ? '| | |' : properties.returnTable) +
      '\n';
    text += `## ${api}
#### 简要描述：
 - ${description}
#### 请求URL：
 - ${path}
#### 请求方式：
 - ${method}
#### 参数：
${paramTable}
#### 返回参数说明：
${returnTable}
#### 返回实例：
${example}
#### 其他说明：
 - ${other}`;
  }
  //写入文件
  fs.writeFile(markdown.path + markdown.file, text, (err) => {
    if (err) throw err;
    console.log('It\'s saved!'); //文件被保存
    return true;
  });
};