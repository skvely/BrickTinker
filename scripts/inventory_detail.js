///NOTE that any changes that apply here should also be applied in search_page.js fixInventoryBody
///That's why all the code is put into inventory_detail_shared.js

chrome.storage.sync.get({
    showMedianPrice: true,
	addToInventory: true
}, function(items) {
	if (items.showMedianPrice)
		executeChangePriceGuideLink(document);
	if (items.addToInventory)
		executeAddToInventory(document);
});

