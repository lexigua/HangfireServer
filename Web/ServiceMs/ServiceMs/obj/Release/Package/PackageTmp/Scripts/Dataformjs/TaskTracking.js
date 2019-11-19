
function TaskTrackingPost(TaskId, TaskNode, Remark) {
    if ($.isEmpty(TaskId)) {
        return false;
    }
    if (!TaskNode || TaskNode.trim() == '') {
        return false;
    }
    if (!Remark) {
        Remark = '';
    }
    var jsonobj = { TaskId: TaskId, TaskNode: TaskNode, Remark: Remark };
    $.post('/Task/TaskTrackingRecord/Save2', jsonobj, function (resulte) { }, "json");
}