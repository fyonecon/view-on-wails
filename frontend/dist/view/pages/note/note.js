
// 新增或更新（顺便删除xss代码）
// update_note
function update_note(){
    view.show_loading("long");

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
        if (!user_id || !note_class_id){
            view.notice_txt("必要参数不完整", 2000);
            view.hide_loading();
            console.log("必要参数不完整：", [user_id, note_class_id]);
        }else{
            //
            update_data(note_id, user_id, note_class_id, save_note_text, update_time).then((res) => {
                console.log("update_data：", res)
                if (res){
                    // view.notice_txt("保存成功", 2000);
                    list_note(note_class_id, user_id);
                }else{
                    view.notice_txt("保存失败", 2000);
                }
                close_note_window();
                view.hide_loading();
            });
        }
    }else{ // 空值
        view.notice_txt("未新建", 2000);
        close_note_window();
        view.hide_loading();
    }
}

// 删除
function del_note(note_id, user_id){
    note_id = note_id*1;
    del_data(note_id, user_id).then((res)=>{
        if (res>0){
            view.notice_txt("删除成功", 2000);
        }else{
            console.log("del_note", [note_id, user_id]);
            view.notice_txt("删除失败或数据不存在", 2000);
        }
        //
        list_note(0, userID);
        close_note_window();
    });
}

// 获取指定分类列表
function list_note(note_class_id, user_id){
    // 展示
    let note_text = "";
    let show_note_text = view.text_decode(note_text);
    //
    get_date(note_class_id, user_id).then((list)=>{
        console.log("list：", list);
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

                let dom = '<div class="note-box font-white click" data-note_id="'+note_id+'" data-note_class_id="'+note_class_id+'" ><div class="del-note font-text click select-none">❎</div><div class="note-text">' + note_text +
                    '</div><div class="note-text">' +
                    '</div>';

                $(".note-list").append(dom);
            })
        }else{
            view.notice_txt("查询无数据", 2000);
        }
    });
}

// 初始化输入框（每次打开窗口时运行）
function init_note_window(){
    let note = $(".note-content");
    note.html("");
    note.attr("data-note_id", "");
    note.attr("data-note_class_id", "");
}
// 关闭窗口
function close_note_window(){
    init_note_window();
    $(".note-edit").slideUp("fast");
}
// 打开窗口
function open_note_window(){
    $(".note-edit").slideDown("slow");
}

$(document).on("click", ".add-note", function (){
    let that = $(this);
    open_note_window();
});
$(document).on("click", ".note-text", function (){
    let that = $(this);
    let note_id = that.parent(".note-box").attr("data-note_id");
    let note_class_id = that.parent(".note-box").attr("data-note_class_id");
    let note_text = that.html();
    console.log("note-box", [note_id, note_class_id, note_text, that.find(".note-text")]);
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
