//Note: see inventory_detail.js

function executeChangePriceGuideLink(doc)
{
	var links = doc.getElementsByTagName("a");
	for (var i=0; i<links.length; i++)
	{
		var a = links[i];
		if (a.href.search("catalogPG.asp") < 0) continue;
		if (a.href.search("&v=P") < 0)
			a.href = a.href + "&v=P";
	}
}

function executeAddToInventory(doc)
{
	var links = doc.getElementsByTagName("a");
	for (var i=0; i<links.length; i++)
	{
		var a = links[i];
		if (a.href.search("catalogitem.page") < 0) continue;
		var itemNo = a.innerHTML;
		var font = getParentOfType(a, "font");
		var newFont = font.cloneNode();
		var tr = getParentOfType(a, "tr");
		var newTD = doc.createElement("td");
		var newA = doc.createElement("a");
		newA.href = "http://www.bricklink.com/inventory_add.asp?a=P&itemID=" + itemNo;
		newA.innerHTML = "Add to My Inventory";
		newFont.appendChild(doc.createElement("br"));
		newFont.appendChild(newA);
		newTD.appendChild(newFont);
		tr.appendChild(newTD);
	}
}