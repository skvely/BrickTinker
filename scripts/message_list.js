function executeForumFullThread()
{
	var links = document.getElementsByTagName("a");
	for (var i=0; i<links.length; i++)
	{
		var a = links[i];
		if (a.href.search("message.asp\\?ID") >= 0)
		{
			//Find thread link in "Brief" display
			var threadLink = getPreviousSiblingOfType(a, "a");
			
			//Find thread link in "Compact" display
			if (threadLink == null)
			{
				var td = getParentOfType(a, "td");
				if (td != null)
				{
					var prevTD = getPreviousSiblingOfType(td, "td");
					if (prevTD != null)
					{
						threadLink = getChildOfType(prevTD, "a");
					}
				}
			}
			
			//Find thread link in "Compact" display "Without replies"
			if (threadLink == null)
			{
				var table = getParentOfType(a, "table");
				if (table != null)
				{
					var td = getParentOfType(table, "td");
					if (td != null)
					{
						alert("In tdnull if");
						var prevTD = getPreviousSiblingOfType(td, "td");
						alert("prevTD: " + prevTD);
						if (prevTD != null)
						{
							threadLink = getChildOfType(prevTD, "a");
						}
					}
				}
			}
			
			if (threadLink != null && threadLink.href.search("messageThread.asp\\?ID") >= 0)
			{
				var messageID = a.href.slice(a.href.indexOf("ID=") + 3);
				a.href = threadLink.href + "&jumpto=" + messageID;
			}
		}
	}
}

function executeForumFilter()
{
	var matches = [ "% off", "sale", "inventory change request", "update packaging dimensions", "(cancelled)", "5%", "0%", "free shipping",
					"\\*\\*\\*", "price drop", "new in store"];
	
	
	var links = document.getElementsByTagName("a");
	for (var i=0; i<links.length; i++)
	{
		var a = links[i];
		if (a.href.search("message.asp\\?ID") >= 0)
		{
			var txt = a.innerHTML;

			var b = getChildOfType(a, "b");
			if (b != null)
				var txt = b.innerHTML;
			
			var foundMatch = false;
			for (var j=0; j<matches.length; j++)
			{
				var match = matches[j];
				if (txt.match(new RegExp(match, "i")))
				{
					foundMatch = true;
					break;
				}
			}
			if (foundMatch)
				a.style.color = "LightGray";
		}
	}
}

chrome.storage.sync.get({
	forumFilter: false,
	forumFullThread: false
}, function(items) {
	if (items.forumFilter)
		executeForumFilter();
	if (items.forumFullThread)
		executeForumFullThread();	
});

