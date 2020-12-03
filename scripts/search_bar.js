function executeDefaultToCatalogSearch()
{
	var searchType = document.getElementById("idSelectedVal");
	if (searchType == null) return;
	
	var parentDiv = getParentOfType(searchType, "div");
	if (!parentDiv.hasAttribute("data-val")) return;
	
	parentDiv.setAttribute("data-val", "c");
	searchType.innerHTML = "Catalog Items";
}

chrome.storage.sync.get({
	catalogSearch: false
}, function(items) {
	if (items.catalogSearch)
		executeDefaultToCatalogSearch();	
});

