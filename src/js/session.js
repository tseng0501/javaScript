$(function() {
    $("#simple-treeview").dxTreeView({
        items: items,
        width: 300,
        onItemClick: function(e) {
            var item = e.itemData;
            console.log(e, "88")
        }
    }).dxTreeView("instance");
});

var items = [{
    id: "1_1",
    text: "Super Mart of the West",
    expanded: true,
    items: [{
        id: "1_1_1",
        text: "Video Players"
    }, {
        id: "1_1_2",
        text: "Televisions",
        expanded: true,

    }, {
        id: "1_1_3",
        text: "Monitors",
        expanded: true,

    }]
}, {
    id: "1_2",
    text: "Braeburn",
    items: [{
        id: "1_2_1",
        text: "Video Players",
    }, {
        id: "1_2_2",
        text: "Televisions",

    }, {
        id: "1_2_3",
        text: "Monitors",
    }]

}, {
    id: "1_3",
    text: "E-Mart",
    items: [{
        id: "1_3_1",
        text: "Video Players",

    }]
}]