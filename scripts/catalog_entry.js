function executeSearchInventory()
{
	var addLink = document.getElementById('_idAddToMyInvLink');
	if (addLink == null) return;

	var itemNo = getItemNo(addLink);
	var container = addLink.parentNode;

	var br = document.createElement("br");
	container.insertBefore(br, addLink);

	var searchLink = addLink.cloneNode();
	searchLink.id = '_idSearchInventoryLink';
	searchLink.innerHTML = "Search My Inventory";
	searchLink.href = "https://www.bricklink.com/inventory_detail.asp?q=" + itemNo;
	container.insertBefore(searchLink, br);
}

function getItemNo(addLink)
{	
	var addHref = addLink.href;
	var start = addHref.toLowerCase().indexOf("&itemid=") + 8;
	var itemNo = addHref.slice(start, addHref.indexOf('&', start));
	return itemNo;
}

function executeSearchVariants()
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
	searchLink.href = "https://www.bricklink.com/v2/search.page?q=" + itemNo + "*#T=P";
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
    searchInventory: true,
	searchVariants: true,
	usaSellers: false
}, function(items) {
	if (items.searchInventory)
		executeSearchInventory();
	if (items.searchVariants)
		executeSearchVariants();
	if (items.usaSellers)
		executeUSASellers();
});

