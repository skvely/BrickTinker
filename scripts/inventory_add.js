//------------ AdvancedColorPicker ----------
function executeAdvancedColorPicker()
{
	if (!supportsAdvancedColorFeatures()) return;

	var color = document.getElementById('p_color');
	var parentTD = getParentOfType(color, "td");
	var parentTR = getParentOfType(parentTD, "tr");
	
	var newTD = document.createElement("td");
	var newButton = document.createElement("input");
	newButton.setAttribute("type", "button");
	newButton.value = "Color Picker";
	newButton.onclick = openColorPicker;
	newTD.appendChild(newButton);
	parentTR.insertBefore(newTD, parentTD.nextSibling);
}

function selectColor(colorNo)
{
	var color = document.getElementById('p_color');
	color.value = colorNo;
	color.onchange();
}

function openColorPicker()
{
	var itemNo = document.getElementById('p_selecteditemID').value;
	window.open("https://www.bricklink.com/catalogColors.asp?itemType=P&itemNo=" + itemNo + "&v=2&hacked=y", "", "width=800,height=600");
}
//---------------------------------------------



//---------- AutoShowPriceGuide ---------------
function getWholePriceGuideLink()
{
	var fonts = document.getElementsByTagName("font");
	for (var i=0; i<fonts.length; i++)
	{
		if (fonts[i].innerHTML == "Whole Price Guide")
		{
			return fonts[i].parentNode;
		}
	}
}

function updatePriceGuide()
{
	var color = document.getElementById('p_color');
	if (color == null || !isNaN(parseInt(color.value)))
	{
		var priceGuideLink = getWholePriceGuideLink();
		priceGuideLink.click();
	}
}

function executeAutoShowPriceGuide()
{
	if (!hasCatalogSection()) return;
	
	updatePriceGuide();
	
	var color = document.getElementById('p_color');
	color.setAttribute("price-guide", "true");
	color.onchange = onColorChange;
}
//-------------------------------



//----------------ShowCorrectColorImage--------------
function executeShowCorrectColorImage()
{
	if (!supportsAdvancedColorFeatures()) return;

	updateImage();
	
	var color = document.getElementById('p_color');
	color.setAttribute("correct-color", "true");
	color.onchange = onColorChange;
}

function updateImage()
{
	if (isPageType("G")) return;
	var color = document.getElementById('p_color');
	if (color == null) return;
	
	var colorNo = parseInt(color.value);
	if (isNaN(colorNo)) return;
	var itemNo = document.getElementById('p_selecteditemID').value;
	document.images['img1'].src = "/P/" + colorNo + "/" + itemNo + ".JPG";
}
//--------------------------------------------------

function onColorChange()
{
	var color = document.getElementById('p_color');
	if (color.hasAttribute("price-guide"))
	{
		updatePriceGuide();
	}
	if (color.hasAttribute("correct-color"))
	{
		updateImage();
	}
}

function isPageType(type)
{
	return document.location.search.search("a=" + type.toUpperCase()) >= 0
	|| document.location.search.search("a=" + type.toLowerCase()) >= 0;
}

function hasColorSection()
{
	return isPageType("P") || isPageType("G");
}

function hasCatalogSection()
{
	return !isPageType("U");
}

function supportsAdvancedColorFeatures()
{
	//Gear is mostly colorless, but should show the color area
	//but not support changing the image or advanced color picker
	return isPageType("P");
}

function hasExtendedDescription()
{
	return isPageType("S") || isPageType("U");
}

//--------------------StreamlineAddPage--------------------
function executeStreamlineAdd()
{
	mainTable = document.getElementById("id-main-legacy-table");
	if (mainTable == null) return;
	
	var mainTD = getChildOfTypeRec(mainTable, "td");
	
	var sellItemTable = getNthChildOfType(mainTD, "table", 0);
	var sellFont = getChildOfTypeRec(sellItemTable, "font");

	if (document.location.search.search("&streamline=N") >= 0)
	{
		sellFont.appendChild(document.createTextNode(" - Standard View ("));
		var switchLink = document.createElement("a");
		switchLink.href = document.location.search.replace("&streamline=N", "");
		switchLink.innerHTML = "Streamlined View";
		sellFont.appendChild(switchLink);
		sellFont.appendChild(document.createTextNode(")"));
		return;
	}
	else
	{
		sellFont.appendChild(document.createTextNode(" - Streamlined View ("));
		var revertLink = document.createElement("a");
		revertLink.href = document.location + "&streamline=N";
		revertLink.innerHTML = "Standard View";
		sellFont.appendChild(revertLink);
		sellFont.appendChild(document.createTextNode(")"));
	}

	var breadcrumbsTable = getNthChildOfType(mainTD, "table", 1);
	var itemTable = getNthChildOfType(mainTD, "table", 2);

	var itemTBody = getChildOfType(itemTable, "tbody");

	var trIndex = 0;
	if (hasCatalogSection())
	{
		var catalogTR = getNthChildOfType(itemTBody, "tr", trIndex); trIndex++;
	}
	var imageTR = getNthChildOfType(itemTBody, "tr", trIndex); trIndex++;
	if (hasColorSection())
	{
		var colorTR = getNthChildOfType(itemTBody, "tr", trIndex); trIndex++;
	}
	var commentsTR = getNthChildOfType(itemTBody, "tr", trIndex); trIndex++;
	var quantityTR = getNthChildOfType(itemTBody, "tr", trIndex); trIndex++;
	var priceTR = getNthChildOfType(itemTBody, "tr", trIndex); trIndex++;
	var conditionTR = getNthChildOfType(itemTBody, "tr", trIndex); trIndex++;
	var superLotTR = getNthChildOfType(itemTBody, "tr", trIndex); trIndex++;
	var optionsTR = getNthChildOfType(itemTBody, "tr", trIndex); trIndex++;
	
	hideElement(breadcrumbsTable);
	
	if (hasCatalogSection())
	{
		if (hasColorSection())
			handleCatalogImageColorTRs(catalogTR, imageTR, colorTR);
		else
			handleCatalogImageTRs(catalogTR, imageTR);
	}
	handleCommentsTR(commentsTR);
	handleQuantityTR(quantityTR);
	handlePriceTR(priceTR);
	handleConditionTR(conditionTR);

	hideElement(superLotTR);
	hideElement(optionsTR);
}

function handleCatalogImageTRs(catalogTR, imageTR)
{
	var center = getChildOfTypeRec(catalogTR, "center");
	var itemNoOrig = getNthChildOfType(center, "table", 0);
	var itemNo = itemNoOrig.cloneNode(true); //Can't take the original or page code breaks
	hideElement(catalogTR);

	var imageTBody = getChildOfTypeRec(imageTR, "tbody");
	var imageTR1 = getNthChildOfType(imageTBody, "tr", 0);
	var imageTD1 = getNthChildOfType(imageTR1, "td", 0);
	var imageTD1Button = getChildOfType(imageTD1, "p");
	hideElement(imageTD1Button);
	var imageTD2 = getNthChildOfType(imageTR1, "td", 1);
	var imageTD3 = getNthChildOfType(imageTR1, "td", 2);
	hideElement(imageTD2);
	hideElement(imageTD3);
		
	var newTD1 = document.createElement("td");
	newTD1.appendChild(itemNo);
	
	imageTR1.insertBefore(itemNo, imageTD2);

	var imageTR2 = getNthChildOfType(imageTBody, "tr", 1);
	hideElement(imageTR2);
}

function handleCatalogImageColorTRs(catalogTR, imageTR, colorTR)
{
	var center = getChildOfTypeRec(catalogTR, "center");
	var itemNoOrig = getNthChildOfType(center, "table", 0);
	var itemNo = itemNoOrig.cloneNode(true); //Can't take the original or page code breaks
	hideElement(catalogTR);

	var imageTBody = getChildOfTypeRec(imageTR, "tbody");
	var imageTR1 = getNthChildOfType(imageTBody, "tr", 0);
	var imageTD1 = getNthChildOfType(imageTR1, "td", 0);
	var imageTD1Button = getChildOfType(imageTD1, "p");
	hideElement(imageTD1Button);
	
	hideElement(imageTR);
	
	var colorTD = getChildOfType(colorTR, "td");
	var colorTable = getChildOfType(colorTD, "table");
	var finalText = getChildOfType(colorTD, "p");
	hideElement(finalText);

	var newTable = document.createElement("table");
	var newTBody = document.createElement("tbody");
	var newTR = document.createElement("tr");
	var newTD1 = document.createElement("td");
	var newTD2 = document.createElement("td");
	
	colorTD.appendChild(newTable);
	newTable.appendChild(newTBody);
	newTBody.appendChild(newTR);
	newTD1.appendChild(imageTD1);
	newTR.appendChild(newTD1);
	newTD2.appendChild(itemNo);
	newTD2.appendChild(document.createElement("br"));
	newTD2.appendChild(colorTable);
	newTR.appendChild(newTD2);
}

function handleCommentsTR(commentsTR)
{
	var font = getChildOfTypeRec(commentsTR, "font");
	var textBoxIndex = 0;
	var commentCenter = getNthChildOfType(font, "center", textBoxIndex); textBoxIndex++;
	if (hasExtendedDescription())
	{
		var extendedCenter = getNthChildOfType(font, "center", textBoxIndex); textBoxIndex++;
		var ecInfoTip = getChildOfType(extendedCenter, "a");
		hideElement(ecInfoTip);
		var ecAfterBR = getNthChildOfType(extendedCenter, "br", 1);
		var ecText = getChildOfType(extendedCenter, "font");
		extendedCenter.removeChild(ecAfterBR);
		hideElement(ecText);
		
		var extendedTextArea = getChildOfType(extendedCenter, "textarea");
		extendedTextArea.setAttribute("rows", "2");
		extendedTextArea.setAttribute("cols", "72");
	}
	var remarksCenter = getNthChildOfType(font, "center", textBoxIndex); textBoxIndex++;
	var blah = getNthChildOfType(font, "p", 0);
	
	var commentTextArea = getChildOfType(commentCenter, "textarea");
	commentTextArea.setAttribute("rows", "2");
	commentTextArea.setAttribute("cols", "72");
	var explainTable = getChildOfType(commentCenter, "table");
	hideElement(explainTable);

	hideElement(blah);

	if (isType(remarksCenter.childNodes[0], "font"))
		remarksCenter = remarksCenter.childNodes[0]; //some pages have an extra font layer here... sigh
	var infoTip = getChildOfType(remarksCenter, "a");
	var afterBR = getNthChildOfType(remarksCenter, "br", 1);
	var remarksText = getChildOfType(remarksCenter, "font");
	var finalText = getChildOfType(remarksCenter, "p");
	hideElement(infoTip);
	remarksCenter.removeChild(afterBR);
	hideElement(remarksText);
	hideElement(finalText);
}

function handleQuantityTR(quantityTR)
{
	var tbody = getChildOfTypeRec(quantityTR, "tbody");
	var blankRow = getNthChildOfType(tbody, "tr", 1);
	var bulkRow = getNthChildOfType(tbody, "tr", 2);
	hideElement(blankRow);
	hideElement(bulkRow);
}

function handlePriceTR(priceTR)
{
	var tbody = getChildOfTypeRec(priceTR, "tbody");
	var tieredRow = getNthChildOfType(tbody, "tr", 1);
	var saleRowIndex = 3;
	if (!hasCatalogSection()) saleRowIndex = 2;
	var saleRow = getNthChildOfType(tbody, "tr", saleRowIndex);	
	hideElement(tieredRow);
	hideElement(saleRow);
}

function handleConditionTR(conditionTR)
{
	var td = getChildOfType(conditionTR, "td");
	var conditionTable = getNthChildOfType(td, "table", 0);
	var br = getChildOfType(td, "br");
	var otherTable = getNthChildOfType(td, "table", 1);
	
	td.removeChild(br);
	var otherTBody = getChildOfType(otherTable, "tbody");
	var stockroomTR = getNthChildOfType(otherTBody, "tr", 3);
	for (var i=0; i<otherTBody.childNodes.length; i++)
	{
		var child = otherTBody.childNodes[i];
		if (child == stockroomTR) continue;
		if (!isType(child, "tr")) continue;
		hideElement(child);
	}
	
	//remove infoTip from conditionTable
	var infoTip1 = getChildOfTypeRec(conditionTable, "a");
	hideElement(infoTip1);
	
	//remove infoTip from stockroomTR
	var infoTip2 = getChildOfTypeRec(stockroomTR, "a");
	hideElement(infoTip2.parentNode);
}

//-----------------------------------------------------

chrome.storage.sync.get({
	streamlineAdd: false,
    autoShowPriceGuide: true,
	advancedColorPicker: true,
	showCorrectColorImage: true,
}, function(items) {
	if (items.streamlineAdd)
		executeStreamlineAdd();
	if (items.autoShowPriceGuide)
		executeAutoShowPriceGuide();
	if (items.advancedColorPicker)
		executeAdvancedColorPicker();
	if (items.showCorrectColorImage)
		executeShowCorrectColorImage();
});

