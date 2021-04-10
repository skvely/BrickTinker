function getItemNo(addLink)
{	
	var addHref = addLink.href;
	var start = addHref.toLowerCase().indexOf("&itemid=") + 8;
	var itemNo = addHref.slice(start, addHref.indexOf('&', start));
	return itemNo;
}

function executeSearchVariants(isCatalog)
{
	var addLink = document.getElementById('_idAddToMyInvLink');
	if (addLink == null) return;
	
	var dimNode = document.getElementById('yearReleasedSec');
	if (dimNode == null) dimNode = document.getElementById('dimSec');
	if (dimNode == null) dimNode = document.getElementById('item-weight-info');
	if (dimNode == null) return;
	
	var itemNo = getItemNo(addLink);
	
	var nonDigitIndex = itemNo.search(/\D/);
	if (nonDigitIndex >= 0)
		itemNo = itemNo.slice(0, nonDigitIndex);

	var container = dimNode.parentNode;
	container.appendChild(document.createElement("br"));

	var searchLink = addLink.cloneNode();
	searchLink.id = '_idSearchVariantsLink';
	searchLink.innerHTML = "Search Variants";
	if (isCatalog)
	{
		searchLink.href = "https://www.bricklink.com/catalogList.asp?q=" + itemNo + "*";
	}
	else
	{
		searchLink.href = "https://www.bricklink.com/v2/search.page?q=" + itemNo + "*#T=P";
	}
	container.appendChild(searchLink);
}

function toggleUSASellers()
{
	var radios = document.getElementsByName("inSellerLocation");

    var currentVal = "";
	for (var i=0; i<radios.length; i++)
	{
		if (radios[i].checked)
			 currentVal = radios[i].value;
	}

	var desiredVal = "C";
	if (currentVal == "C") desiredVal = "A";

	for (var i=0; i<radios.length; i++)
	{
		if (radios[i].value == desiredVal)
			radios[i].checked = true;
	}
	
	if (desiredVal == "C")
	{
		var dropdown = document.getElementById("_idSelSellerCountry");
		dropdown.value = "US";
	}
	
	var button = document.getElementById("_idbtnSearch2");
	button.click();
}

function executeUSASellers()
{
	toggleUSASellers();
	
	var moreOptionsLink = document.getElementById("_idMoreLink");
	if (moreOptionsLink != null)
	{
		var td = getParentOfType(moreOptionsLink, "td");
		var tr = getParentOfType(td, "tr");
		var prevTR = getPreviousSiblingOfType(tr, "tr");
		var prevTable = getChildOfTypeRec(prevTR, "table");
		
		var newTable = prevTable.cloneNode();
		var newTR = document.createElement("tr");
		var newTD = document.createElement("td");
		newTD.align = "left";
		newTD.style.padding = "10px";
		var newA = document.createElement("a");
		newA.href = "javascript:void(0)";
		newA.innerHTML = "Toggle USA Sellers Filter";
		newA.onclick = toggleUSASellers;
		newTD.appendChild(newA);
		newTR.appendChild(newTD);
		newTR.appendChild(td);
		newTable.appendChild(newTR);

		var newTD2 = document.createElement("td");
		newTD2.appendChild(newTable);
		tr.appendChild(newTD2);
	}
}

chrome.storage.sync.get({
	searchVariants: true,
	usaSellers: false,
	catalogSearch: false
}, function(items) {
	if (items.searchVariants)
		executeSearchVariants(items.catalogSearch);
	if (items.usaSellers)
		executeUSASellers();
});

