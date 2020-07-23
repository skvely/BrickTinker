function selectColor(colorNo)
{
    try
	{
        window.opener.selectColor(colorNo);
    }
    catch (err) {}
    window.close();
    return false;	
}

function executeAdvancedColorSelector()
{
	var params = document.location.search.split('&');
	var canContinue = false;
	for (var p=0; p<params.length; p++)
	{
		if (params[p].startsWith("hacked="))
		{
			canContinue = true;
			break;
		}
	}
	
	if (!canContinue) return;
	
	var table = document.getElementById('id-main-legacy-table');
	var body = getParentOfType(table, "body");
	var tbody = getChildOfType(table, "tbody");
	var tr = getChildOfType(tbody, "tr");
	var td = getChildOfType(tr, "td");
	var center = getChildOfType(td, "center");
	var colorTable = getChildOfType(center, "table");

	var newCenter = document.createElement("center");
	newCenter.appendChild(colorTable);
	body.innerHTML = "";
	body.appendChild(newCenter);
	
	var links = document.getElementsByTagName("a");
	for (var i=0; i<links.length; i++)
	{
		var a = links[i];
		var href = a.href;
		if (href.includes("contact.asp"))
		{
			var parentNode = a.parentNode;
			var firstNode = parentNode.childNodes[0];
			parentNode.innerHTML = "";
			parentNode.appendChild(firstNode);
			i--; //removing the node removes it from the links array also
		}
		if (href.includes("catalogitem.page"))
		{
			let colorNo = href.slice(href.indexOf("idColor=") + 8);
			a.href = colorNo;
			a.addEventListener('click', function(){ selectColor(colorNo); }, false);
		}
	}
}


chrome.storage.sync.get({
	advancedColorSelector: true
}, function(items) {
	if (items.advancedColorSelector)
		executeAdvancedColorSelector();
});

