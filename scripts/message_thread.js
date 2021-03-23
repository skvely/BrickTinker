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

function executeCollapseQuotations()
{
	var collapseStyle = document.createElement('style');
	collapseStyle.innerHTML = `
.collapsible {
  background-color: #777;
  color: white;
  cursor: pointer;
  padding: 8px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
  margin-bottom: 20px;
}

.active, .collapsible:hover {
  background-color: #555;
  color: white;
  cursor: pointer;
  padding: 8px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
}

.quotecontent {
  display: none;
  overflow: hidden;
}
`;

	document.head.appendChild(collapseStyle);
	
	
	var tables = document.getElementsByTagName("table");
	for (var i=0; i<tables.length; i++)
	{
		var table = tables[i];
		var styles = window.getComputedStyle(table);
		var style = styles.getPropertyValue('border-left');
		if (style.startsWith("1px dashed"))	
		{
			table.className = "quotecontent";
			table.style.display = "none";
			
			var quoteButton = document.createElement('button');
			quoteButton.className = "collapsible";
			quoteButton.innerHTML = "Click to show/hide quotation";
			var parentNode = table.parentNode;
			var insertBeforeNode = getPreviousSiblingOfType('br');
			if (insertBeforeNode != null)
				parentNode.insertBefore(quoteButton, insertBeforeNode);
			else
				parentNode.insertBefore(quoteButton, table);

			quoteButton.addEventListener("click", function() 
			{
				if (this.className == "active")
					this.className = "collapsible";
				else
					this.className = "active";
				var content = this.nextElementSibling;
				if (!isType(content, 'table'))
					content = getNextSiblingOfType('table');
				if (content.style.display === "block")
					content.style.display = "none";
				else
					content.style.display = "block";
			});
		}
	}	
}


chrome.storage.sync.get({
	forumFullThread: false,
	forumCollapseQuotations: false,
}, function(items) {
	if (items.forumFullThread)
		executeForumJumpTo();	
	if (items.forumCollapseQuotations)
		executeCollapseQuotations();
});

