function executeInventoryWidth(width)
{
	var mainTable = document.getElementById('id-main-legacy-table');
	if (mainTable == null) return;

	mainTable.width = width;
}

chrome.storage.sync.get({
    inventoryWidth: true,
    inventoryWidthValue: 800
}, function(items) {
	if (items.inventoryWidth)
		executeInventoryWidth(items.inventoryWidthValue);
});

