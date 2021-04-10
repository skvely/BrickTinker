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

function executeUSASellers()
{
	var radios = document.getElementsByName("inSellerLocation");
	for (var i=0; i<radios.length; i++)
	{
		if (radios[i].value == "C")
			radios[i].checked = true;
	}
	
	var dropdown = document.getElementById("_idSelSellerCountry");
	dropdown.value = "US";
	
	var button = document.getElementById("_idbtnSearch2");
	button.click();
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

