function executeHideRefundSection()
{
	alert("starting");
	var bolds = document.getElementsByTagName('b');
	for (var i = 0, l = bolds.length; i < l; i++)
	{
		var b = bolds[i];
		if (b.innerHTML != "Refund") continue;
		
		var hr1 = getPreviousSiblingOfType(b, "hr");
		var hrCount = 0;
		var node = hr1.nextSibling;
		while (node != null && hrCount < 2)
		{
			hideElement(node);
			if (isType(node, "hr")) hrCount++;
			node = node.nextSibling;
		}
		break;
	}
}

chrome.storage.sync.get({
	hideRefundSection: false
}, function(items) {
	if (items.hideRefundSection)
		executeHideRefundSection();	
});

