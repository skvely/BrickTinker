function openAboutPage() {
	chrome.windows.create({
		type: "popup",
		url: "about.html",
		width: 600,
		height: 600
	});
}

function openOptionsPage() {
	chrome.windows.create({
		type: "popup",
		url: "options.html",
		width: 600,
		height: 600
	});
}

function save_options() {
  chrome.storage.sync.set({
    searchInventory: document.getElementById('sw_search_inventory').checked,
    searchVariants: document.getElementById('sw_search_variants').checked,
	usaSellers: document.getElementById('sw_usa_sellers').checked,
	showMedianPrice: document.getElementById('sw_show_median_price').checked,
    uspsTracking: document.getElementById('sw_usps_tracking').checked,
	addInventorySearch: document.getElementById('sw_add_inventory_search').checked,	
	inventoryWidth: document.getElementById('sw_inventory_width').checked,
	addToInventory: document.getElementById('sw_add_to_inventory').checked,
	hideInputShipping: document.getElementById('sw_hide_shipping').checked,
	hideInputInsurance: document.getElementById('sw_hide_insurance').checked,
	hideInputAdditional: document.getElementById('sw_hide_additional').checked,
	hideInputTaxes: document.getElementById('sw_hide_taxes').checked,
 	streamlineAdd: document.getElementById('sw_streamline_add').checked,
	autoShowPriceGuide: document.getElementById('sw_auto_show_price_guide').checked,
	advancedColorPicker: document.getElementById('sw_advanced_color_picker').checked,
	showCorrectColorImage: document.getElementById('sw_show_correct_color_image').checked
  });
}

function restore_options() {
  chrome.storage.sync.get({
    searchInventory: true,
    searchVariants: true,
	usaSellers: false,
	showMedianPrice: true,
	uspsTracking: false,
	addInventorySearch: true,
	inventoryWidth: true,
	addToInventory: true,
	hideInputShipping: false,
	hideInputInsurance: false,
	hideInputAdditional: false,
	hideInputTaxes: false,
	streamlineAdd: false,
	autoShowPriceGuide: true,
	advancedColorPicker: true,
	showCorrectColorImage: true
  }, function(items) {
    document.getElementById('sw_search_inventory').checked = items.searchInventory;
    document.getElementById('sw_search_variants').checked = items.searchVariants;
	document.getElementById('sw_usa_sellers').checked = items.usaSellers;
	document.getElementById('sw_show_median_price').checked = items.showMedianPrice;
    document.getElementById('sw_usps_tracking').checked = items.uspsTracking;
	document.getElementById('sw_add_inventory_search').checked = items.addInventorySearch;
	document.getElementById('sw_inventory_width').checked = items.inventoryWidth;
	document.getElementById('sw_add_to_inventory').checked = items.addToInventory;
	document.getElementById('sw_hide_shipping').checked = items.hideInputShipping;
	document.getElementById('sw_hide_insurance').checked = items.hideInputInsurance;
	document.getElementById('sw_hide_additional').checked = items.hideInputAdditional;
	document.getElementById('sw_hide_taxes').checked = items.hideInputTaxes;
	document.getElementById('sw_streamline_add').checked = items.streamlineAdd;
	document.getElementById('sw_auto_show_price_guide').checked = items.autoShowPriceGuide;
	document.getElementById('sw_advanced_color_picker').checked = items.advancedColorPicker;
	document.getElementById('sw_show_correct_color_image').checked = items.showCorrectColorImage;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('sw_search_inventory').onchange = save_options;
document.getElementById('sw_search_variants').onchange = save_options;
document.getElementById('sw_usa_sellers').onchange = save_options;
document.getElementById('sw_show_median_price').onchange = save_options;
document.getElementById('sw_usps_tracking').onchange = save_options;
document.getElementById('sw_add_inventory_search').onchange = save_options;
document.getElementById('sw_inventory_width').onchange = save_options;
document.getElementById('sw_add_to_inventory').onchange = save_options;
document.getElementById('sw_hide_shipping').onchange = save_options;
document.getElementById('sw_hide_insurance').onchange = save_options;
document.getElementById('sw_hide_additional').onchange = save_options;
document.getElementById('sw_hide_taxes').onchange = save_options;
document.getElementById('sw_streamline_add').onchange = save_options;
document.getElementById('sw_auto_show_price_guide').onchange = save_options;
document.getElementById('sw_advanced_color_picker').onchange = save_options;
document.getElementById('sw_show_correct_color_image').onchange = save_options;

document.getElementById('about_button').onclick = openAboutPage;
document.getElementById('options_button').onclick = openOptionsPage;