function executeEscToCloseImagePreview()
{
	document.body.addEventListener('keydown', function (e)
	{
		e = e || window.event;
		if (e.key == "Escape")
		{
			//search.page, store, catalogList
			var xs = document.getElementsByClassName("fas fa-times");
			if (xs.length > 0)
			{
				for (var i = 0; i < xs.length; i++)
				{
					if (isVisible(xs[i]))
					{
						xs[i].click();
						return;
					}
				}
			}

			//catalogitem
			var bc = document.getElementsByClassName("blLILClose");
			if (bc.length > 0)
			{
				for (var i = 0; i < bc.length; i++)
				{
					if (isVisible(bc[i]))
					{
						bc[i].click();
						return;
					}
				}
			}

			//orderDetail
			var lb = document.getElementById("lbClose");
			if (lb != null)
			{
				if (isVisible(lb))
				{
					lb.click();
					return;
				}
			}
		}
	});
}

function executeEnlargeThumbnails()
{
	if (window.location.href.includes(`catalogitem.page`))
		return;
	
	var searchTerm = `img.bricklink.com/ItemImage/`;
	var searchTerm2 = /img.bricklink.com\/[A-Z]\//;
	var searchTerm3 = /img.bricklink.com\/[A-Z]\/\d+\//;
	var imgs = document.getElementsByTagName("img");
	for (var i = 0; i < imgs.length; i++)
	{
		var img = imgs[i];
		if (img.src.includes(searchTerm))
		{
			img.src = img.src.replace(`.t1.`, `.t2.`);
			
			img.style = "max-width: 160px;" + img.style;
			img.removeAttribute("width");
			img.removeAttribute("height");
		}
		
		var index = img.src.search(searchTerm2);
		if (index >= 0)
		{
			var needs0 = img.src.search(searchTerm3) < 0;
			var src = img.src.replace(`img.bricklink.com/`, searchTerm);
			var index = src.indexOf(searchTerm) + searchTerm.length + 1;
			var toAdd = "T";
			if (needs0) toAdd = toAdd + `/0`;
			src = src.substr(0, index) + toAdd + src.substr(index);
			img.src = src.replace(".jpg", ".t2.png");

			img.style = "max-width: 160px;" + img.style;
			img.removeAttribute("width");
			img.removeAttribute("height");
		}
		
		if (img.src.includes("noImage.gif"))
		{
			img.height = "120";
			img.width = "160";
		}
	}
	
	
	//Reconfigure the grid layout of catalogList to 5 columns instead of 8 to fit the larger images
	if (window.location.href.includes(`bricklink.com/catalogList.asp`))
	{
		var actives = document.getElementsByClassName("active");
		for (var j = 0; j < actives.length; j++)
		{
			var aNode = getChildOfType(actives[j], "a");
			if (aNode != null && aNode.innerHTML == "Thumbnail Gallery")
			{
				var maxCols = 5;

				var newTRs = [];
				var tbody = null;
				var refTR = null;
				var oldTDs = [];
				
				for (var k = 0; k < imgs.length; k++)
				{
					var img = imgs[k];
					if (img.src.includes(searchTerm) || img.src.includes("noImage.gif"))
					{
						var tempTD = getParentOfType(img, "td");
						var td = getParentOfType(tempTD, "td");
						var tr = getParentOfType(td, "tr");
						if (refTR == null)
							refTR = tr;
						if (tbody == null)
							tbody = getParentOfType(tr, "tbody");
						oldTDs.push(td);
					}
				}
				
				var newTR;
				var colCount = 0;

				for (var n = 0; n < oldTDs.length; n++)
				{
					var oldTD = oldTDs[n];
					if (colCount == 0)
					{
						newTR = refTR.cloneNode();
						newTRs.push(newTR);
					}
					newTR.appendChild(oldTD);
					
					colCount++;
					if (colCount == maxCols)
					{
						colCount = 0;
					}
				
				}
				
				clearChildNodes(tbody);
				for (var m = 0; m < newTRs.length; m++)
				{
					tbody.appendChild(newTRs[m]);
				}
			}
		}
	}
}

chrome.storage.sync.get({
	escToCloseImagePreview: true,
	enlargeThumbnails: false
}, function(items) {
	if (items.escToCloseImagePreview)
		executeEscToCloseImagePreview();
	if (items.enlargeThumbnails)
		executeEnlargeThumbnails();
});
