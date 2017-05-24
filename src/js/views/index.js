require("../../css/common/public.less");
require("../../css/views/index.less");

let arry = ["张三", "李四", "王五", "马六"];
let temp = "";
for (let v of arry) {
    temp += v + "<br/>";
}
$("#index").html(temp);