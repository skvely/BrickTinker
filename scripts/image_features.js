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

chrome.storage.sync.get({
	escToCloseImagePreview: true
}, function(items) {
	if (items.escToCloseImagePreview)
		executeEscToCloseImagePreview();	
});

