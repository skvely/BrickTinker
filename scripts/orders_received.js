function executeUSPSTrackingLink()
{
	var trs = document.getElementsByTagName('tr');
	var title_td_added = false;
	for (var i = 0, l = trs.length; i < l; i++) {

		//get order id
		var input_tr = trs[i];
		var orderid = input_tr.getAttribute('data-orderid')
		if (orderid == null) continue;
		
		//get tracking number
		var inputs = document.getElementsByName("nT" + orderid);
		if (inputs.length != 1) continue;
		var input = inputs[0];
		var trackingNo = input.value.replace(/\s+/g, '');
		if (trackingNo == null || trackingNo.length == 0) continue;

		//create new column
		var input_td = input.parentNode;
		var new_td = document.createElement("td");
		new_td.setAttribute("style", "vertical-align:bottom");
		
		//create link with image
		var link = document.createElement("a");
		link.href = "https://tools.usps.com/go/TrackConfirmAction?tLabels=" + trackingNo;
		var img = document.createElement("img");
		img.setAttribute("width", "18px");
		img.src = "http://static.bricklink.com/renovate/img/usps.png"
		link.appendChild(img);
		
		//add to column and row
		new_td.appendChild(link);
		input_tr.insertBefore(new_td, input_td.nextSibling);

		//add a blank <td></td> to the header row in the same location as the new column added above
		if (title_td_added == false)
		{
			var titleTDNode = getTDFromTRIndex(input_td, 0);
			var title_tr = titleTDNode.parentNode;
			title_tr.insertBefore(document.createElement("td"), titleTDNode.nextSibling);
			title_td_added = true;
		}
	}
}

function executeHideEmptyInputs(enabled)
{
	var trs = document.getElementsByTagName('tr');
	var title_td_added = false;
	for (var i = 0, l = trs.length; i < l; i++)
	{
		//get order id
		var input_tr = trs[i];
		var orderid = input_tr.getAttribute('data-orderid')
		if (orderid == null) continue;
		
		var last_tr_index = getTypeIndexOf(getLastChildOfType(input_tr.parentNode, "tr"));
		
		//var enabled = [false, true, false, false, false];
		var prefixes = ["nH", "nI", "nD", "nA", "nST"];
		var titlesRemoved = [false, false, false, false, false];
		for (var j = 0; j < prefixes.length; j++)
		{
			if (!enabled[j]) continue;
			
			//find input node
			var inputs = document.getElementsByName(prefixes[j] + orderid);
			if (inputs.length != 1) continue;
			var input = inputs[0];

			//disabled input nodes are not in tds, but hidden after tds in the tr, so previous node is associated td
			var previous_td = input.previousSibling;
			//if it doesn't have previous sibling, it is enabled and a child of the td
			if (previous_td == null) previous_td = input.parentNode;
			previous_td.setAttribute("hidden", null);
			
			if (!titlesRemoved[j])
			{
				var title_td = getTDFromTRIndex(previous_td, 0);
				title_td.setAttribute("hidden", null);
				var footer_td = getTDFromTRIndex(previous_td, last_tr_index);
				footer_td.setAttribute("hidden", null);
				titlesRemoved[j] = true;
			}
		}
	}
}

chrome.storage.sync.get({
    uspsTracking: false,
	hideInputShipping: false,
	hideInputInsurance: false,
	hideInputAdditional: false,
	hideInputTaxes: false
}, function(items) {
	if (items.uspsTracking)
		executeUSPSTrackingLink();
	
	var shipping = items.hideInputShipping;
	var insurance = items.hideInputInsurance;
	var additional = items.hideInputAdditional;
	var taxes = items.hideInputTaxes;
	
	if (shipping || insurance || additional || taxes)
		executeHideEmptyInputs([shipping, insurance, additional, additional, taxes]);
});

