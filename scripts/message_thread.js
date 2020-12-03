function executeForumJumpTo()
{
	var params = document.location.search.split('&');
	var id = -1;
	for (var p=0; p<params.length; p++)
	{
		if (params[p].startsWith("jumpto="))
		{
			id = params[p].split("=")[1];
			break;
		}
	}
	if (id < 0) return;

	var links = document.getElementsByTagName("a");
	for (var i=0; i<links.length; i++)
	{
		var a = links[i];
		if (a.href.search("messagePost.asp\\?ID") >= 0)
		{
			var messageID = a.href.slice(a.href.indexOf("ID=") + 3);
			if (messageID == id)
			{
				var table1 = getParentOfType(a, "table");
				var table2 = getParentOfType(table1, "table");
				var table3 = getParentOfType(table2, "table");
				if (table3 != null)
				{
					table3.scrollIntoView();
				}
				break;
			}
		}
	}
}


chrome.storage.sync.get({
	forumFullThread: false
}, function(items) {
	if (items.forumFullThread)
		executeForumJumpTo();	
});

