// 操作数据库。文档：https://jsstore.net/docs/connection

// 连接数据库，获取表对象
let DB; // 数据库
let NoteClass; // table
let Note; // table
function init_DB(){
    // 连接数据库
    DB = new Dexie(app_class+"NoteContent");
    // 声明 表+表字段
    DB.version(1).stores({
        note_class: `
            note_class_id,
            user_id,
            note_class_name,
            note_class_order
        `, // 表+字段
        note: `
            note_id,
            user_id,
            note_class_id,
            note_text,
            update_time
        `, // 表+字段
    });
    // 赋表
    NoteClass = DB.note_class;
    Note = DB.note;
}

// 新增或更新
function update_data(note_id, user_id, note_class_id, note_text, update_time) {
    let data;
    if (!note_id) { // add
        return Note.toArray().then((res)=>{
            if (res.length>0){
                note_id = res[res.length-1].note_id*1+1; // 取最后一条数据+1，设置自增主键值
            }else{
                note_id = 1; // 从请开始
            }
            view.log("查询完成list=", [res, note_id]);
            data = {
                note_id: note_id,
                user_id: user_id,
                note_class_id: note_class_id,
                note_text: note_text,
                update_time: update_time,
            };
            // 目标表 插入/更新数据
            return Note.bulkPut([data]).then((res)=>{
                view.log("成功插入数据=", res);
                return [res, note_id];
            });
        });
    }else {
        data = {
            note_id: note_id,
            user_id: user_id,
            note_class_id: note_class_id,
            note_text: note_text,
            update_time: update_time,
        };
        // 目标表 插入/更新数据
        return Note.bulkPut([data]).then((res)=>{
            view.log("成功插入数据=", res);
            return [res, note_id];
        });
    }
}

// 查询列表
function get_date(note_class_id, user_id){
    // 当前表
    let Note = DB.note;
    // 查询
    if (!note_class_id){
        return Note.where({user_id: user_id}).toArray().then((res)=>{
            view.log("查询完成list=", res);
            return res;
        });
    }else{
        return Note.where({note_class_id: note_class_id, user_id: user_id}).toArray().then((res)=>{
            view.log("查询完成list=", res);
            return res;
        });
    }
}

// 删除数据
function del_data(note_id, user_id){
    // 当前表
    let Note = DB.note;
    return Note.where({note_id: note_id, user_id: user_id}).delete().then((res)=>{
        view.log("删除数据num=", res);
        return res;
    });
}
