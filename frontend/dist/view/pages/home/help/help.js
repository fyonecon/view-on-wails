
$(document).on("click", ".clear_all_data", function (){
    clear_all_data();
});

function start_page(e){
    $(".back-div").removeClass("hide");
    $(".body").addClass("bg-white");

    // 复制文字
    let clipboard = new Clipboard('.copy-txt-btn');
    clipboard.on('success', function(e) {
        view.info('Action:', e.action);
        view.info('Text:', e.text);
        view.info('Trigger:', e.trigger);
        view.notice_txt("已复制");
        e.clearSelection();
    });
    clipboard.on('error', function(e) {
        view.error('Action:', e.action);
        view.error('Trigger:', e.trigger);
        view.notice_txt("复制失败！");
        try {call_func();}catch (e){}
    });

}