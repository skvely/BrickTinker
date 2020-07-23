function executeShowMedianPrice()
{
	addMedianPrice();

	var contentDiv = document.getElementById("_idPGContents");
	if (contentDiv == null) return;
	
	var mutationObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation){
			if (contentDiv.innerHTML.search("Loading...") >= 0) return;
			addMedianPrice();
		});
	});
	mutationObserver.observe(contentDiv,
	{
		attributes: false,
		characterData: false,
		childList: true,
		subtree: false,
		attributeOldValue: false,
		characterDataOldValue: false
	});
}

function fixOldLink(id)
{
	var guideLink = document.getElementById(id);
	if (guideLink.href.search("&v=P") < 0)
		guideLink.href = guideLink.href + "&v=P";
}

function addMedianPrice()
{
	var isCatalogPG = false;
	if (document.location.href.search("catalogPG.asp") >= 0)
	{
		isCatalogPG = true;
		if (!(document.location.search.search("&v=P") >= 0)) return;
	}
	else
	{
		fixOldLink("_idShowPriceGuideLink");
		fixOldLink("_idShowPriceGuideLink2");
		
		var sortType = document.getElementById("_idSelPGSortType");
		if (sortType == null || sortType.value != 3) return;
	}

	var xbolds = document.getElementsByTagName("b");
	//The list changes as new items are entered, so create static copy
	var bolds = [];
	for (let i=0; i<xbolds.length; i++)
	{
		bolds.push(xbolds[i]);
	}
	for (let i=0; i<bolds.length; i++)
	{
		let bold = bolds[i];
		if (bold.innerHTML != "Qty") continue;
		var tbody = getParentOfType(bold, "tbody");
		if (tbody == null) continue;
		
		var currency = "";
		var qtys = [];
		var prices = [];
		
		var breakTR = null;
		for (var j=1; j<tbody.childNodes.length; j++)
		{
			var tr = tbody.childNodes[j];
			if (!isType(tr, "tr")) continue;
			if (tr.childNodes[0].hasAttribute("colspan"))
			{
				breakTR = tr;
				break;
			}
			
			qtys.push(parseInt(tr.childNodes[1].innerHTML));
			let rawPrice = tr.childNodes[2].innerHTML;
			let numStart = rawPrice.search(/[0-9]/);
			if (currency == "")
				currency = rawPrice.slice(0, numStart).replace('~', '');
			prices.push(rawPrice.slice(numStart));
		}

		var medPrice = median(prices);
		
		var qprices = [];
		for (var k=0; k<qtys.length; k++)
		{
			for (var l=0; l<qtys[k]; l++)
			{
				qprices.push(prices[k]);
			}
		}
		
		var qmedPrice = median(qprices);
		
		var lastTR = getLastChildOfType(tbody, "tr");

		addRow(tbody, lastTR, "Med Price:", currency, medPrice);
		addRow(tbody, lastTR, "Qty Med Price:", currency, qmedPrice);		
		
		//add to corresponding top table
		var innerTable = getParentOfType(bold, "table");
		if (isCatalogPG) //catalog page has an extra table for no reason
			innerTable = getParentOfType(innerTable, "table");
		var tableTD = getParentOfType(innerTable, "td");
		
		var upperTableTD = getTDFromTRIndex(tableTD, 2);
		var upperTable = getChildOfType(upperTableTD, "table");
		var upperTbody = getChildOfType(upperTable, "tbody");
		var lastUpperTR = getLastChildOfType(upperTbody, "tr");
		if (isCatalogPG) //catalog page has an extra table for no reason
		{
			var needlessTD = getChildOfType(lastUpperTR, "td");
			var needlessTable = getChildOfType(needlessTD, "table");
			upperTbody = getChildOfType(needlessTable, "tbody");
			lastUpperTR = getLastChildOfType(upperTbody, "tr");
		}
		
		addRow(upperTbody, lastUpperTR, "Med Price:", currency, medPrice);
		addRow(upperTbody, lastUpperTR, "Qty Med Price:", currency, qmedPrice);		
	}
}

function addRow(tbody, lastTR, title, currency, price)
{
		var newTR = lastTR.cloneNode(true);
		newTR.childNodes[0].innerHTML = title;
		newTR.childNodes[1].childNodes[0].innerHTML = currency + parseFloat(price).toFixed(2);
		tbody.insertBefore(newTR, lastTR);	
}

function median(values)
{
	if (values.length === 0) return 0;

	var half = Math.floor(values.length / 2);

	if (values.length % 2) return values[half];
	
	return (parseFloat(values[half - 1]) + parseFloat(values[half])) / 2.0;
}


chrome.storage.sync.get({
    showMedianPrice: true
}, function(items) {
	if (items.showMedianPrice)
		executeShowMedianPrice();
});
