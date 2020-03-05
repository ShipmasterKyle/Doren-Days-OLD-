window.overlayShowHide = function(elementId){
	var div = document.getElementById(elementId);
	if(div != undefined){
		div.classList.toggle("hidden");
		if(elementId === "debugOverlay"){
		   SugarCube.State.variables.debugMenu[0] = !SugarCube.State.variables.debugMenu[0];
		}
	}
}

window.overlayMenu = function(elementId, type){
	switch(type){
		case "debug":
		var debug = ["debugMain", "debugCharacter", "debugEvents"]
		for(var i = 0, l = debug.length; i < l; i++){
			var div = document.getElementById(debug[i]);
			if(div != undefined){
				SugarCube.State.variables.debugMenu[1] = elementId;
				if(elementId === debug[i]){
					div.classList.remove("hidden");
				}else{
					div.classList.add("hidden");
				}
			}
		}
		break;
	}
}

/*Sidebar swipe*/
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;


function getTouches(evt) {
	return evt.touches ||			 // browser API
			evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
	var firstTouch = getTouches(evt)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
	if ( ! xDown || ! yDown ) {
		return;
	}

	/**
	 * Activate the swipe only when finger near the UI Bar.
	 * 50px - +/- width of unstowed UI Bar
	 * 280px - +/- width of unstowed UI bar
	 */
	if ( isUIBarStowed() ) {
		if ( xDown > 50 ) {
			return;
		}
	} else
	{
		if ( xDown > 280 ) {
			return;
		}
	}

	var xUp = evt.touches[0].clientX;
	var yUp = evt.touches[0].clientY;

	var xDiff = xDown - xUp;
	var yDiff = yDown - yUp;

	if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
		if ( xDiff > 0 ) {
			UIBar.stow();/* left swipe */
		} else {
			UIBar.unstow();/* right swipe */
		}
	} else {
		if ( yDiff > 0 ) {
			/* up swipe */
		} else {
			/* down swipe */
		}
	}
	/* reset values */
	xDown = null;
	yDown = null;
};

function isUIBarStowed() {
	return $( '#ui-bar' ).hasClass( 'stowed' );
}

var disableNumberifyInVisibleElements = [
	'#passage-testing-room',
];

// Number-ify links
var currentLinks = [];

function getPrettyKeyNumber(counter) {
	var str = "";

	if (counter > 30)
		str = "Ctrl + ";
	else if (counter > 20)
		str = "Alt + ";
	else if (counter > 10)
		str = "Shift + ";

	if (counter % 10 === 0)
		str += "0";
	else if (counter < 10)
		str += counter;
	else {
		var c = Math.floor(counter / 10);
		str += (counter - (10 * c)).toString();
	}

	return str;
}

$(document).on(':passagerender', function(ev) {
	currentLinks = [];

	if (passage() == "GiveBirth") {
		$(ev.content).find("[type=checkbox]").on('propertychange change', function() { new Wikifier(null, '<<resetPregButtons>>');
		generateNumbers(ev);} );
	}

	generateNumbers(ev);
});

function generateNumbers(ev){
	if (!State.variables.numberify_enabled || !StartConfig.enableLinkNumberify)
		return;

	for (var i = 0; i < disableNumberifyInVisibleElements.length; i++) {
		if ($(ev.content).find(disableNumberifyInVisibleElements[i]).length || $(ev.content).is(disableNumberifyInVisibleElements[i]))
			return; // simply skip this render
	}

 	// wanted to use .macro-link, but wardrobe and something else doesn't get selected, lmao
	currentLinks = $(ev.content)
		.find(".link-internal")
		.not(".no-numberify *, .no-numberify");

	$(currentLinks).each(function(i, el) {
		$(el).html("(" + getPrettyKeyNumber(i + 1) + ") " + $(el).html());
	});
}

$(document).on('keyup', function(ev) {
	if (!State.variables.numberify_enabled || !StartConfig.enableLinkNumberify || State.variables.tempDisable)
		return;

	if ((ev.keyCode >= 48 && ev.keyCode <= 57) || (ev.keyCode >= 96 && ev.keyCode <= 105)) {
		var fixedKeyIndex = (ev.keyCode < 60 ? ev.keyCode - 48 : ev.keyCode - 96);

		var requestedLinkIndex = [
			9,
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8
		][fixedKeyIndex];

		if (ev.ctrlKey)
			requestedLinkIndex += 30;
		else if (ev.altKey)
			requestedLinkIndex += 20;
		else if (ev.shiftKey)
			requestedLinkIndex += 10;

		if ($(currentLinks).length >= requestedLinkIndex + 1)
			$(currentLinks[requestedLinkIndex]).click();
	}
});

window.skinColor = function(percent, overwrite){
	if(SugarCube.State.variables.skinColor.tanImgEnabled === "f"){
	   return "";
	}
	var result = "";
	var v = null;
	if(overwrite != null){
		v = overwrite;
	}else{
		v = {
			"hStart": 45, "hEnd": 45,
			"sStart": 0.2, "sEnd": 0.4,
			"bStart": 4.5, "bEnd": 0.7,
		}
	}
	if(v != null){
		var p = percent / 100;
		result = "hue-rotate("+((v.hEnd - v.hStart) * p + v.hStart)+"deg)";
		result += " saturate("+((v.sEnd - v.sStart) * p + v.sStart).toFixed(2)+")";
		result += " brightness("+((v.bEnd - v.bStart) * p + v.bStart).toFixed(2)+")";
	}
	return result;
}

window.closeFeats = function(id){
	var div1 = document.getElementById("feat-" + id);
	var div2 = document.getElementById("closeFeat-" + id);
	div1.style.display = "none";
	div2.style.display = "none";
}

window.filterFeats = function(){
	new Wikifier(null, '<<replace #featsList>><<featsList>><</replace>>');
}

window.getTimeNumber = function(t){
	var time = new Date(t);
	var result = time.getTime();
	if(isNaN(result)){
		return 9999999999999999;
	}
	return result;
}

window.extendStats = function(){
	SugarCube.State.variables.extendedStats = !SugarCube.State.variables.extendedStats;
	var captionDiv = document.getElementById('storyCaptionDiv'),
		statsDiv = document.getElementById('stats');
	if(SugarCube.State.variables.extendedStats === true){
		captionDiv.classList.add("storyCaptionDivExtended");
		statsDiv.classList.add("statsExtended");
	}else{
		captionDiv.classList.remove("storyCaptionDivExtended");
		statsDiv.classList.remove("statsExtended");
	}
	new Wikifier(null, '<<replace #stats>><<statsCaption>><</replace>>');
}

window.customColor = function(color, saturation, brightness, contrast, sepia){
	return 'filter: hue-rotate('+color+'deg) saturate('+saturation+') brightness('+brightness+') contrast('+contrast+') sepia('+sepia+')';
}