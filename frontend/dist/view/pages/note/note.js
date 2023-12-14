
// 新增或更新（顺便删除xss代码）
// update_note
function update_note(where){
    if (where === "btn"){
        view.show_loading("long");
    }else if (where === "auto"){
        view.log("auto");
    }

    //
    let note_text = $(".note-content").html();
    if (note_text){ // 有值
        let save_note_text = view.text_encode(view.filter_xss(note_text));
        //
        let note = $(".note-content");
        let note_id = note.attr("data-note_id")*1;
        let note_class_id = note.attr("data-note_class_id")*1;
        let user_id = userID;
        let update_time = view.time_date("YmdHis")*1;
        if (!user_id){
            view.notice_txt("必要参数不完整，不能保存", 3000);
            $(".close-note-edit").removeClass("hide");
            view.hide_loading();
        }else{
            //
            update_data(note_id, user_id, note_class_id, save_note_text, update_time).then((back) => {
                view.log("update_data：", back)
                if (back[0]){
                    // view.notice_txt("保存成功", 2000);
                    if (where === "btn"){
                        list_note(note_class_id, user_id);
                    }else if (where === "auto"){
                        if (!note_id){
                            $(".note-state-update").html("保存状态：已保存「"+view.time_date("H:i:s")+"」");
                        }else {
                            $(".note-state-update").html("保存状态：已更新「"+view.time_date("H:i:s")+"」");
                        }
                        view.log("已自动保存，并设置data-note_id=", back[1]);
                        note.attr("data-note_id", back[1]); // 防止数据重复（即下次就是修改数据）
                    }
                }else{
                    view.notice_txt("保存失败", 2000);
                }
                if (where === "btn"){
                    close_note_window();
                    view.hide_loading();
                }else if (where === "auto"){
                    view.log("已自动保存");
                }
            });
        }
    }else{ // 空值
        view.log("未新建", 2000);
        if (where === "btn"){
            close_note_window();
            view.hide_loading();
        }else if (where === "auto"){
            $(".note-state-update").html("保存状态：空内容");
        }
    }
}

// 删除
function del_note(note_id, user_id){
    note_id = note_id*1;
    del_data(note_id, user_id).then((res)=>{
        if (res>0){
            view.notice_txt("已删除："+note_id, 2000);
        }else{
            view.log("del_note", [note_id, user_id]);
            view.notice_txt("删除失败或数据不存在", 2000);
            view.refresh_page(1500);
        }
        //
        list_note(0, userID);
        close_note_window();
    });
}

// 获取指定分类列表
function list_note(note_class_id, user_id){
    view.show_loading("long");
    //
    get_date(note_class_id, user_id).then((list)=>{
        view.log("list：", list);
        if (list.length > 0){
            // view.notice_txt("查询成功", 2000);
            $(".note-list").html("");
            list.reverse().forEach((row, index)=>{
                //
                let note_id = row.note_id;
                let user_id = row.user_id;
                let note_class_id = row.note_class_id;
                let note_text = row.note_text; note_text = view.text_decode(note_text);
                let update_time = row.update_time;
                update_time = view.date_format(update_time, "Y-m-d");

                let dom = '<div class="note-box font-white" data-note_id="'+note_id+'" data-note_class_id="'+note_class_id+'" >' +
                    '<div class="del-note font-text click select-none">❎</div>' +
                    '<div class="note-text font-text">' + note_text + '</div>' +
                    '<div class="update_time-note font-text"><code class="update_time-note-id font-mini">'+note_id+'</code><code class="update_time-note-date font-mini">'+update_time+'</code><div class="clear"></div></div>' +
                    '</div>';

                $(".note-list").append(dom);
            });
        }else{
            view.notice_txt("查询无数据", 2000);
            $(".note-list").html("");
        }
        view.hide_loading();
    });
}

// 初始化输入框（每次打开窗口时运行）
function init_note_window(){
    let note = $(".note-content");
    note.html("");
    note.attr("data-note_id", ""); // 空值使为 默认最大ID的数值
    note.attr("data-note_class_id", ""); // 空值使为 全部
    $(".close-note-edit").addClass("hide");
}
// 关闭窗口
function close_note_window(){
    init_note_window();
    // 处理自动数据
    clearInterval(word_num_timer);
    clearInterval(word_auto_save_timer);
    $(".note-state-num").html("有效字数：-");
    $(".note-state-update").html("保存状态：-");
    // 关闭窗口
    $(".note-edit").slideUp("fast");
}
// 打开窗口
function open_note_window(){
    // 打开窗口
    $(".note-edit").slideDown("slow");
    // 统计字数
    word_num_timer = setInterval(function (){
        get_word_num();
    }, 2000);
    // 自动保存
    word_auto_save_timer = setInterval(function (){
        word_auto_save();
    }, 6000);
}
// 统计次数
let word_num_timer;
function get_word_num(){
    let num = $(".note-content").text().length;
    $(".note-state-num").html("有效字数："+num);
}
// 自动保存
let word_auto_save_timer;
function word_auto_save(){
    //
    update_note("auto");
}

// 新增笔记
$(document).on("click", ".add-note", function (){
    let that = $(this);
    open_note_window();
});
// 查看笔记
$(document).on("click", ".note-text", function (){
    let that = $(this);
    let note_id = that.parent(".note-box").attr("data-note_id");
    let note_class_id = that.parent(".note-box").attr("data-note_class_id");
    let note_text = that.html();
    view.log("note-box", [note_id, note_class_id, note_text, that.find(".note-text")]);
    //
    if (!note_id || !note_class_id || !note_text){ // 没有就新增
        open_note_window();
    }else{
        // 展示
        let show_note_text = note_text;
        // 填值
        let note = $(".note-content");
        note.html(show_note_text);
        note.attr("data-note_id", note_id);
        note.attr("data-note_class_id", note_class_id);
        open_note_window();
    }
});
// 删除笔记
$(document).on("click", ".del-note", function (){
    let that = $(this);
    view.alert_confirm("⚠️", "确认删除 ？", function (state){
        if (state){
            let note_id = that.parent(".note-box").attr("data-note_id");
            del_note(note_id, userID);
        }else{
            close_note_window();
        }
    });
});
// 保存/完成编辑笔记
$(document).on("click", ".update-note-edit", function (){
    let that = $(this);
    update_note("btn");
});
// 关闭编辑
$(document).on("click", ".close-note-edit", function (){
    let that = $(this);
    view.alert_confirm("⚠️", "保存内容 ？", function (state){
        if (state){
            update_note("btn");
        }else{
            $(".note-edit").slideUp("slow");
        }
    });
});

// 手动刷新
$(document).on("click", ".refresh-note", function (){
    let that = $(this);
    //
    list_note(0, userID);
});

// 用户ID
const userID = view.md5(app_class);

// 组件起始函数
function run_parts(text, data){
    // init db
    init_DB();
    // init dom
    if (view.get_url_param("", "route") === "note"){ // 单页
        $(".back-div").removeClass("hide");
        $(".page-content-choose").addClass("page-content");
        $(".tools-right-content-part").addClass("tools-right-content-part-style");
    }else { // 组件
        $(".page-content-choose").addClass("run-tools-content");
    }

    //
    list_note(0, userID);
}

function start_page(){
    //
    if (view.get_url_param("", "route") === "note"){ // 单页
        run_parts("记事本", []);
    }else { // 组件
        view.log("跳过");
    }
}
