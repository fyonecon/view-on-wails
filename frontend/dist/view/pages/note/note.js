
// note_class_id user_id note_class_name note_class_order
// note_id user_id note_class_id note_text update_time

// 新增或更新（顺便删除xss代码）
// update_note
function update_note(){
    let note_text = $(".note-content").html();
    if (note_text){ // 有值
        let save_note_text = view.text_encode(view.filter_xss(note_text));
        close_note_window();
        //

    }else{ // 空值
        close_note_window();
    }
}

// 删除
function del_note(note_id, user_id){
    close_note_window();
    //
}

// 获取指定分类列表
function list_note(note_class_id, user_id){
    // 展示
    let note_text = "";
    let show_note_text = view.text_decode(note_text);
    //
}

// 初始化输入框（每次打开窗口时运行）
function init_note_window(){
    $(".note-content").html("");
}
// 关闭窗口
function close_note_window(){
    $(".note-edit").slideUp("fast");
}
// 打开窗口
function open_note_window(){
    init_note_window();
    $(".note-edit").slideDown("slow");
}

$(document).on("click", ".add-note", function (){
    let that = $(this);
    open_note_window();
});
$(document).on("click", ".note-box", function (){
    let that = $(this);
    let note_id = that.attr("note_id");
    let note_class_id = that.attr("note_class_id");
    let note_text = that.attr("note_text");
    if (!note_id || !note_class_id || !note_text){ // 没有就新增
        open_note_window();
    }else{
        // 展示
        let note_text = "";
        let show_note_text = view.text_decode(note_text);
    }
});
$(document).on("click", ".del-note", function (){
    let that = $(this);
    view.alert_confirm("⚠️", "确认删除 ？", function (state){
        if (state){
            let note_id = "";
            let user_id = "";
            del_note(note_id, user_id);
        }else{
            close_note_window();
        }
    });
});
$(document).on("click", ".update-note-edit", function (){
    let that = $(this);
    update_note();
});
$(document).on("click", ".close-note-edit", function (){
    let that = $(this);
    view.alert_confirm("⚠️", "保存内容 ？", function (state){
        if (state){
            update_note();
        }else{
            $(".note-edit").slideUp("slow");
        }
    });
});

// 用户ID
const userID = view.md5(app_class);

// 组件起始函数
function run_parts(text, data){
    // init
    if (view.get_url_param("", "route") === "note"){ // 单页
        $(".back-div").removeClass("hide");
        $(".page-content-choose").addClass("page-content");
        $(".tools-right-content-part").addClass("tools-right-content-part-style");
    }else { // 组件
        $(".page-content-choose").addClass("run-tools-content");
    }
    //
    list_note("", userID);
}

function start_page(){
    //
    if (view.get_url_param("", "route") === "note"){ // 单页
        run_parts("记事本", []);
    }else { // 组件
        view.log("跳过");
    }
}
