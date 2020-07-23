function executeAddInventorySearch()
{
	addInventorySearch();
	
	var tabTable = document.getElementById("_idTabMenu");
	if (tabTable == null) return;
	
	var mutationObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation){
			addInventorySearch();
		});
	});
	mutationObserver.observe(tabTable,
	{
		attributes: true,
		attributeFilter: ["style"],
		childList: false,
		subtree: false,
	});
}

function addInventorySearch()
{
	var tabTable = document.getElementById("_idTabMenu");
	if (tabTable.style.display == 'none') return;
	var tabTbody = getChildOfType(tabTable, "tbody");
	var tabTR = getChildOfType(tabTbody, "tr");
	var tabTD = getNthChildOfType(tabTR, "td", 3);
	
	//Insert new tab
	var newTabTD = tabTD.cloneNode(true);
	newTabTD.childNodes[0].data = "Inventory";
	newTabTD.childNodes[2].innerHTML = "...";
	newTabTD.childNodes[2].id = "_idInventoryNum";
	newTabTD.setAttribute("data-tab-id", "V");
	newTabTD.className = "blWideTabMenu blWideTabInactive";
	var separator = tabTD.nextSibling;
	var newSeparator = separator.cloneNode(true);
	tabTR.insertBefore(newSeparator, tabTD);
	tabTR.insertBefore(newTabTD, newSeparator);
	
	newTabTD.onclick = onTabClick;
	
	//Insert new tab contents
	var table = getParentOfType(tabTR, "table");
	var mainDiv = getParentOfType(table, "div");
	var overviewTabContents = document.getElementById("_idContentsTabA");
	var newContents = overviewTabContents.cloneNode(false);
	newContents.id = "_idContentsTabV";
	newContents.style.display = 'none';
	var iframe = document.createElement("iframe");
	iframe.id = "invIframe";
	iframe.seamless = true;
	var keyword = document.getElementById("_idInKeyword").value;
	iframe.src = "https://www.bricklink.com/inventory_detail.asp?q=" + keyword;
	iframe.style.position = 'relative';
	iframe.style.width = '100%';
	iframe.scrolling = 'no';
	iframe.setAttribute("frameborder", "0");
	iframe.onload = fixInventoryBody;
	newContents.appendChild(iframe);
	mainDiv.appendChild(newContents);
}

function fixInventoryBody()
{
	//adjust inventory page if needed
	var iframe = document.getElementById("invIframe");
	doc = iframe.contentDocument;

	if (doc.body.childNodes.length > 0 && doc.body.childNodes[0].id == "id-main-legacy-table") return;
	
	var invTable = doc.getElementById("id-main-legacy-table");
	var invBody = doc.body;
	invBody.innerHTML = "";
	invBody.appendChild(invTable);		

	//fix links
	var links = doc.getElementsByTagName("a");
	for (var i=0; i<links.length; i++)
	{
		var a = links[i];
		if (a.href.search("inventory_detail.asp") >= 0 && a.href.search("pg=") >=0) continue;
		if (a.href.search("JavaScript:") >=0) continue;
		a.target = '_PARENT';
	}

	//update tab's "number found"
	var tas = doc.getElementsByClassName("ta");
	if (tas.length == 0)
	{
		//nothing found, do not show tab
		var tabs = document.getElementsByClassName("blWideTabMenu blWideTabInactive");
		for (var i=0; i<tabs.length; i++)
		{
			var tab = tabs[i];
			if (tab.getAttribute("data-tab-id") == "V")
			{
				tab.style.display = 'none';
				tab.nextSibling.style.display = 'none';
			}
		}
		return;
	}
	var numFound = getChildOfType(tas[0], "b").innerHTML;
	document.getElementById("_idInventoryNum").innerHTML = "(" + numFound + ")";


	//fix price guide links
	chrome.storage.sync.get({
		showMedianPrice: true,
		addToInventory: true
	}, function(items) {
		if (items.showMedianPrice)
			executeChangePriceGuideLink(doc);
		if (items.addToInventory)
			executeAddToInventory(doc);
	});


	//adjust iframe height to fit content
	iframe.style.height = doc.documentElement.scrollHeight + 'px';
}

function onTabClick(sender)
{
	var td = sender.target;
	if (!isType(td, "td"))
		td = getParentOfType(td, "td");
	var tr = td.parentNode;
	//disable other tabs
	for (var i=0; i<tr.childNodes.length; i++)
	{
		var node = tr.childNodes[i];
		// if (node.tagName == null || node.tagName.toLowerCase() != "td") continue;
		if (!isType(node, "td")) continue;
		
		if (node.className.search("blWideTabActive") >= 0)
			node.className = "blWideTabMenu blWideTabInactive";
		
	}
	//enable inventory tab
	td.className = "blWideTabMenu blWideTabActive";
	
	//hide other content areas
	var table = getParentOfType(tr, "table");
	var mainDiv = getParentOfType(table, "div");
	
	for (var i=0; i<mainDiv.childNodes.length; i++)
	{
		var node = mainDiv.childNodes[i];
		if (!isType(node, "div")) continue;
		if (node.className != "pspItemTabContents") continue;
		if (node.id == "_idContentsTabV") continue;
		if (node.style.display == 'none') continue;
		node.style.display = 'none';
	}
	
	//make the inventory content area visible
	var inventoryContents = document.getElementById("_idContentsTabV");
	inventoryContents.style.display = "";

	//adjust iframe height to fit content
	var iframe = document.getElementById("invIframe");
	doc = iframe.contentDocument;
	iframe.style.height = doc.documentElement.scrollHeight + 'px';
}


chrome.storage.sync.get({
    addInventorySearch: true
}, function(items) {
	if (items.addInventorySearch)
		executeAddInventorySearch();
});

