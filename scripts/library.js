function hideElement(e)
{
	e.style.display = 'none';
}

function isType(node, type)
{
	return (node.tagName != null && node.tagName.toLowerCase() == type.toLowerCase());
}

function getParentOfType(node, type)
{
	var p = node.parentNode;
	while (p != null && !isType(p, type) && !isType(p, "html"))
		p = p.parentNode;
	if (isType(p, type)) return p;
	return null;
}

function getChildOfType(node, type)
{
	for (var i=0; i<node.childNodes.length; i++)
		if (isType(node.childNodes[i], type))
			return node.childNodes[i];
	return null;
}

function getLastChildOfType(node, type)
{
	for (var i=node.childNodes.length-1; i>=0; i--)
		if (isType(node.childNodes[i], type))
			return node.childNodes[i];
	return null;
}

function getNthChildOfType(node, type, index)
{
	var typeIndex = 0;
	for (var i=0; i<node.childNodes.length; i++)
	{
		if (isType(node.childNodes[i], type))
		{
			if (typeIndex == index)
				return node.childNodes[i];
			typeIndex++;
		}
	}
	return null;
}

function getChildOfTypeRec(node, type)
{
	for (var i=0; i<node.childNodes.length; i++)
	{
		if (isType(node.childNodes[i], type))
			return node.childNodes[i];
		var rec = getChildOfTypeRec(node.childNodes[i], type);
		if (rec != null) return rec;
	}
	return null;
}

function getChildCountOfType(node, type)
{
	var count = 0;
	for (var i=0; i<node.childNodes.length; i++)
		if (isType(node.childNodes[i], type))
			count++;
	return count;
}

function getTypeIndexOf(node)
{
	if (node == null || node.tagName == null) return -1;
	
	var index = -1;
	var typeIndex = 0;
	var parentNode = node.parentNode; //getParentOfType(input_td, "tr");
	for (var x = 0, l = parentNode.childNodes.length; x < l; x++)
	{
		var n = parentNode.childNodes[x];
		if (n == node)
			return typeIndex;
		if (isType(n, node.tagName))
			typeIndex++;
	}
	return -1;
}

//Finds the TD node in the same position as input_td, but in a different TR of the same table, defined by tr_index
function getTDFromTRIndex(input_td, tr_index)
{
	var index = getTypeIndexOf(input_td);
	var tbody = getParentOfType(input_td, "tbody");

	if (index >= 0 && isType(tbody, "tbody")) //tbody.tagName.toLowerCase() == "tbody")
	{
		var title_tr = getNthChildOfType(tbody, "tr", tr_index);
		tdIndex = 0;
		for (var y = 0, yl = title_tr.childNodes.length; y < yl; y++)
		{
			var yNode = title_tr.childNodes[y];
			if (!isType(yNode, "td")) continue;
								
			if (tdIndex == index)
				return yNode;
			
			if (yNode.hasAttribute("colspan"))
			{
				var colspan = parseInt(yNode.getAttribute("colspan"));
				if (index > tdIndex && index <= tdIndex + (colspan - 1))
					return yNode;
				tdIndex += parseInt(yNode.getAttribute("colspan"));
			}
			else
				tdIndex++;
		}
	}
	return null;
}
